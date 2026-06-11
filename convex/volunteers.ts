import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import {
  MAX_POSITIONS_PER_APPLICATION,
  getPosition,
  positionTitle,
} from "./positionsData";

export const apply = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    country: v.string(),
    city: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    github: v.optional(v.string()),
    portfolio: v.optional(v.string()),

    about: v.string(),
    motivation: v.string(),

    positions: v.array(v.string()),
    positionAnswers: v.array(
      v.object({
        positionId: v.string(),
        question: v.string(),
        answer: v.string(),
      }),
    ),

    hoursPerWeek: v.optional(v.string()),
    canCommit: v.optional(v.boolean()),
    referralSource: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!/^\S+@\S+\.\S+$/.test(args.email))
      throw new ConvexError("Invalid email address.");
    if (args.positions.length === 0)
      throw new ConvexError("Please select at least one position.");
    if (args.positions.length > MAX_POSITIONS_PER_APPLICATION)
      throw new ConvexError(
        `You can apply for at most ${MAX_POSITIONS_PER_APPLICATION} positions.`,
      );
    if (args.about.length < 20)
      throw new ConvexError("Please tell us more about yourself (20 chars min).");
    if (args.motivation.length < 20)
      throw new ConvexError("Please share more about your motivation (20 chars min).");

    for (const id of args.positions) {
      const position = getPosition(id);
      if (!position) throw new ConvexError(`Unknown position: ${id}`);
      if (position.filled)
        throw new ConvexError(`${position.title} is no longer open.`);
      if (position.requiresPortfolio && !args.portfolio?.trim())
        throw new ConvexError(
          `A portfolio link is required when applying for ${position.title}.`,
        );
      for (const question of position.roleQuestions) {
        const answer = args.positionAnswers.find(
          (a) => a.positionId === id && a.question === question,
        );
        if (!answer || answer.answer.trim().length < 20)
          throw new ConvexError(
            `Please answer all questions for ${position.title} (20 chars min).`,
          );
      }
    }

    const id = await ctx.db.insert("volunteers", {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      phone: args.phone || undefined,
      country: args.country.trim(),
      city: args.city || undefined,
      linkedin: args.linkedin || undefined,
      github: args.github || undefined,
      portfolio: args.portfolio || undefined,
      about: args.about.trim(),
      motivation: args.motivation.trim(),
      positions: args.positions,
      positionAnswers: args.positionAnswers.map((a) => ({
        positionId: a.positionId,
        question: a.question,
        answer: a.answer.trim(),
      })),
      hoursPerWeek: args.hoursPerWeek || undefined,
      canCommit: args.canCommit,
      referralSource: args.referralSource || undefined,
      notes: args.notes || undefined,
      status: "new",
      recruitStatus: "applied",
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendVolunteerNotification, {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      positions: args.positions.map((p, i) => `${i + 1}. ${positionTitle(p)}`),
      country: args.country.trim(),
      about: args.about.trim(),
      motivation: args.motivation.trim(),
      answers: args.positionAnswers.map((a) => ({
        position: positionTitle(a.positionId),
        question: a.question,
        answer: a.answer.trim(),
      })),
    });

    return { ok: true, id };
  },
});
