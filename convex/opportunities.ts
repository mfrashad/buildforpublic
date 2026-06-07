import { v } from "convex/values";
import { query } from "./_generated/server";

// Public-safe shape — strips moderation fields and PII links
type PublicOpportunity = {
  _id: string;
  _creationTime: number;
  kind: "ngo_request" | "project_idea" | "oss_project" | "community_project";
  title: string;
  summary: string;
  description: string;
  tags?: string[];
  link?: string;
  repoLink?: string;
  accent?: "yellow" | "blue" | "mint" | "peach" | "purple" | "orange";
  orgName?: string;
  skillsNeeded?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  featured?: boolean;
  image?: string;
  creator?: string;
  stars?: number;
};

export const listPublished = query({
  args: {
    kind: v.optional(
      v.union(
        v.literal("ngo_request"),
        v.literal("project_idea"),
        v.literal("oss_project"),
        v.literal("community_project"),
      ),
    ),
  },
  handler: async (ctx, args): Promise<PublicOpportunity[]> => {
    let docs;

    if (args.kind !== undefined) {
      docs = await ctx.db
        .query("opportunities")
        .withIndex("by_status_and_kind", (q) =>
          q.eq("status", "published").eq("kind", args.kind!),
        )
        .order("desc")
        .take(100);
    } else {
      docs = await ctx.db
        .query("opportunities")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .order("desc")
        .take(100);
    }

    // Map to public-safe shape — strip status, submitterRequestId
    return docs.map((doc) => ({
      _id: doc._id,
      _creationTime: doc._creationTime,
      kind: doc.kind,
      title: doc.title,
      summary: doc.summary,
      description: doc.description,
      tags: doc.tags,
      link: doc.link,
      repoLink: doc.repoLink,
      accent: doc.accent,
      orgName: doc.orgName,
      skillsNeeded: doc.skillsNeeded,
      difficulty: doc.difficulty,
      featured: doc.featured,
      image: doc.image,
      creator: doc.creator,
      stars: doc.stars,
    }));
  },
});
