import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Seed the opportunities table with initial data so the directory board
 * is not empty at launch. Run once from the Convex dashboard.
 *
 * Idempotent: bails if any published opportunities already exist.
 */
export const seedOpportunities = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db
      .query("opportunities")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .take(1);

    if (existing.length > 0) {
      console.log("Opportunities already seeded — skipping.");
      return { skipped: true };
    }

    const seeds: Parameters<typeof ctx.db.insert<"opportunities">>[1][] = [
      // ── Open-source projects to contribute to (from Projects.tsx) ──
      {
        kind: "oss_project",
        title: "Pocket of Pink",
        summary: "Website for a Malaysian youth education NGO.",
        description:
          "Pocket of Pink is a Malaysian NGO doing youth education work. We built their website with them, in the open. The codebase is open-source and welcomes contributions — content updates, accessibility improvements, new features.",
        tags: ["NGO", "Next.js", "Malaysia"],
        link: "https://pocketofpink.com",
        accent: "peach",
        status: "published",
        featured: false,
      },
      {
        kind: "oss_project",
        title: "AI Adoption by Country",
        summary: "Open data tracking AI adoption across 16 countries.",
        description:
          "Interactive visualization and open data API tracking AI adoption from UAE at 64% to Nigeria at 7%. Data sourced from Microsoft, Stanford HAI, OECD, and 11 other authoritative sources. Looking for contributors to add more countries and data sources.",
        tags: ["Open Data", "JSON API", "React", "Data Viz"],
        link: "https://aiadoption-gray.vercel.app",
        repoLink: "https://github.com/mfrashad/aiadoption",
        accent: "blue",
        status: "published",
        featured: true,
      },
      {
        kind: "oss_project",
        title: "Bookshelf",
        summary: "Turn your reading library into a shareable poster.",
        description:
          "Import from Goodreads or Hardcover, pick a visualization style, and download. Built on World Book Day to raise awareness for global literacy — 773 million adults cannot read. Open to contributions: new visualization styles, import sources, accessibility.",
        tags: ["Next.js", "Open Source", "Literacy"],
        link: "https://bookshelf.buildforpublic.com",
        repoLink: "https://github.com/mfrashad/bookshelf",
        accent: "yellow",
        status: "published",
        featured: false,
      },
      {
        kind: "oss_project",
        title: "OpenNGO",
        summary: "A directory of Malaysia's NGOs with an open API.",
        description:
          "Civil society shouldn't be hard to find. OpenNGO is a public directory of Malaysian NGOs with structured data, search, and an open API. Built for journalists, funders, and researchers. Looking for help expanding the dataset and improving the API.",
        tags: ["Open Data", "API", "NGO", "Malaysia"],
        link: "https://open-ngo.vercel.app",
        accent: "mint",
        status: "published",
        featured: false,
      },
      // ── Community open-source projects ──
      {
        kind: "oss_project",
        title: "MyMP",
        summary: "Track Malaysian Members of Parliament.",
        description:
          "Track Malaysian Members of Parliament — voting records, attendance, and more. Open-source civic tech project welcoming new contributors.",
        tags: ["Civic Tech", "Malaysia", "Open Data"],
        link: "https://mymp.org.my",
        accent: "blue",
        status: "published",
        featured: false,
      },
      {
        kind: "oss_project",
        title: "Sedekah.je",
        summary: "Open-source donation directory for verified Malaysian causes.",
        description:
          "Open-source donation directory connecting donors to verified causes across Malaysia. Community-maintained, welcoming PRs to add new organisations and improve discovery.",
        tags: ["Nonprofit", "Malaysia", "Open Source"],
        link: "https://sedekah.je",
        accent: "mint",
        status: "published",
        featured: false,
      },
      // ── Project ideas a builder can pick up ──
      {
        kind: "project_idea",
        title: "Multilingual AI Safety Explainer",
        summary: "Make AI safety concepts accessible in Bahasa Malaysia and other SEA languages.",
        description:
          "Most AI safety content is English-only. This project would create short, accurate explanations of core AI safety and AI ethics concepts in Bahasa Malaysia, Mandarin, Tamil, and other SEA languages — as a web app and shareable cards. Ideal for NGOs, schools, and community groups that don't engage in English.",
        tags: ["AI Safety", "Multilingual", "Content", "SEA"],
        skillsNeeded: ["Content / Writing", "Frontend", "Design", "Translation"],
        difficulty: "beginner",
        accent: "yellow",
        status: "published",
        featured: false,
      },
      {
        kind: "project_idea",
        title: "NGO Digital Readiness Audit Tool",
        summary: "Help NGOs understand what digital tools they need and how to get them.",
        description:
          "Many NGOs don't know what digital tools could help them — or how to evaluate options. This tool would guide an NGO through a structured self-assessment of their current digital capabilities (communications, data management, fundraising, service delivery) and produce a prioritised recommendations report. Could be a simple web form with an AI-assisted report output.",
        tags: ["NGO", "AI", "Assessment", "Frontend"],
        skillsNeeded: ["Frontend", "AI / ML", "Product", "Research"],
        difficulty: "intermediate",
        accent: "peach",
        status: "published",
        featured: true,
      },
      {
        kind: "project_idea",
        title: "Open Grants Database for Malaysian NGOs",
        summary: "A searchable, up-to-date directory of grants available to Malaysian civil society.",
        description:
          "Grant information for Malaysian NGOs is scattered across government portals, foundation websites, and word of mouth. This project would aggregate and maintain an open database of available grants (local and international), searchable by eligibility, sector, and deadline. NGOs currently spend enormous time on discovery that could be automated.",
        tags: ["Open Data", "NGO", "Malaysia", "Research"],
        skillsNeeded: ["Research", "Backend", "Frontend", "Data"],
        difficulty: "beginner",
        accent: "mint",
        status: "published",
        featured: false,
      },
    ];

    let count = 0;
    for (const seed of seeds) {
      await ctx.db.insert("opportunities", seed);
      count++;
    }

    console.log(`Seeded ${count} opportunities.`);
    return { seeded: count };
  },
});
