import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const wipeSeedMembers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("members").collect();
    const seeds = all.filter((m) => m.email?.endsWith("@example.com"));
    for (const m of seeds) await ctx.db.delete(m._id);
    console.log(`Wiped ${seeds.length} seed members.`);
    return { wiped: seeds.length };
  },
});

export const seedMembers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const members = [
      { name: "Aisha Razak", country: "Malaysia", city: "Kuala Lumpur", bio: "Full-stack dev building civic tech tools.", skills: ["React", "Node.js", "PostgreSQL"], causes: ["Civic Tech", "Digital Access"], imageUrl: "https://i.pravatar.cc/150?img=47" },
      { name: "Marco Tan", country: "Singapore", city: "Singapore", bio: "Product designer focused on public-interest software.", skills: ["Figma", "UX Research", "Design Systems"], causes: ["Open Knowledge", "Education"], imageUrl: "https://i.pravatar.cc/150?img=12" },
      { name: "Priya Nair", country: "Malaysia", city: "Petaling Jaya", bio: "Data scientist working on open government datasets.", skills: ["Python", "Data Viz", "SQL"], causes: ["Open Knowledge", "Civic Tech"], imageUrl: "https://i.pravatar.cc/150?img=49" },
      { name: "Hafiz Zainal", country: "Malaysia", city: "Kuala Lumpur", bio: "Backend engineer, ex-GovTech.", skills: ["Go", "Kubernetes", "APIs"], causes: ["Civic Tech", "Digital Access"], imageUrl: "https://i.pravatar.cc/150?img=15" },
      { name: "Wei Lin Chong", country: "Malaysia", city: "George Town", bio: "Frontend dev and open-source contributor.", skills: ["Vue.js", "TypeScript", "CSS"], causes: ["Education", "AI Literacy"], imageUrl: "https://i.pravatar.cc/150?img=44" },
      { name: "Danial Fikri", country: "Malaysia", city: "Shah Alam", bio: "Volunteer organiser + software engineer.", skills: ["React", "Firebase", "Community"], causes: ["Poverty", "Human Rights"], imageUrl: "https://i.pravatar.cc/150?img=18" },
      { name: "Siti Hajar", country: "Malaysia", city: "Johor Bahru", bio: "NGO advocate turned developer.", skills: ["No-code", "Airtable", "Community Organizing"], causes: ["Gender Equality", "Human Rights"], imageUrl: "https://i.pravatar.cc/150?img=48" },
      { name: "Rajan Pillai", country: "Malaysia", city: "Ipoh", bio: "Mobile engineer building accessibility tools.", skills: ["React Native", "Swift", "A11y"], causes: ["Digital Access", "Health"], imageUrl: "https://i.pravatar.cc/150?img=14" },
      { name: "Nurul Ain", country: "Malaysia", city: "Kuala Lumpur", bio: "Researcher at the intersection of tech and policy.", skills: ["Research", "Policy", "Data"], causes: ["AI Safety", "AI Literacy"], imageUrl: "https://i.pravatar.cc/150?img=46" },
      { name: "Zafri Hamdan", country: "Malaysia", city: "Cyberjaya", bio: "Cloud engineer, contributes to open-data infra.", skills: ["AWS", "Terraform", "DevOps"], causes: ["Open Knowledge", "Digital Access"], imageUrl: "https://i.pravatar.cc/150?img=11" },
      { name: "Lena Chua", country: "Singapore", city: "Singapore", bio: "UX researcher and accessibility advocate.", skills: ["UX Research", "Figma", "Accessibility"], causes: ["Digital Access", "Mental Health"], imageUrl: "https://i.pravatar.cc/150?img=45" },
      { name: "Farid Ismail", country: "Malaysia", city: "Kuala Lumpur", bio: "Open-source maintainer and civic hacker.", skills: ["Python", "Open Data", "APIs"], causes: ["Civic Tech", "Open Knowledge"], imageUrl: "https://i.pravatar.cc/150?img=19" },
    ];

    for (const m of members) {
      await ctx.db.insert("members", {
        ...m,
        email: `${m.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        isPublic: true,
      });
    }

    console.log(`Seeded ${members.length} mock members.`);
    return { seeded: members.length };
  },
});

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

export const wipeCommunityProjects = internalMutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("opportunities")
      .withIndex("by_status_and_kind", (q) =>
        q.eq("status", "published").eq("kind", "community_project"),
      )
      .collect();
    for (const doc of all) await ctx.db.delete(doc._id);
    console.log(`Wiped ${all.length} community projects.`);
    return { wiped: all.length };
  },
});

export const seedCommunityProjects = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("opportunities")
      .withIndex("by_status_and_kind", (q) =>
        q.eq("status", "published").eq("kind", "community_project"),
      )
      .take(1);

    if (existing.length > 0) {
      console.log("Community projects already seeded — skipping.");
      return { skipped: true };
    }

    const projects: Parameters<typeof ctx.db.insert<"opportunities">>[1][] = [
      {
        kind: "community_project",
        title: "md-to-docx",
        summary: "Convert Markdown to Word documents — TypeScript module.",
        description:
          "A powerful TypeScript module that converts Markdown text to Microsoft Word (.docx) documents with support for tables, code blocks, lists, and more. Works in both Node.js and browser environments.",
        tags: ["TypeScript", "NPM", "Markdown", "Open Source"],
        repoLink: "https://github.com/MohtashamMurshid/md-to-docx",
        accent: "blue",
        status: "published",
        featured: false,
        creator: "Mohtasham Murshid",
        stars: 87,
      },
      {
        kind: "community_project",
        title: "getdesign",
        summary: "On-demand design systems extracted from any URL — web, API, CLI, SDK & agent skill.",
        description:
          "getdesign opens a site in a real browser, extracts palette, typography, and components, and returns a production-grade design.md grounded in the site's actual CSS. Five surfaces: web, API, CLI, TypeScript SDK, and a portable skill for Claude Code, Codex, and Cursor.",
        tags: ["Design System", "AI Agent", "Claude Code", "TypeScript"],
        link: "https://getdesign.app",
        repoLink: "https://github.com/MohtashamMurshid/getdesign",
        accent: "purple",
        status: "published",
        featured: false,
        image: "/projects/getdesign.png",
        creator: "Mohtasham Murshid",
        stars: 29,
      },
      {
        kind: "community_project",
        title: "Lepak Masjid",
        summary: "Find mosques with WiFi, coworking spaces, and facilities in Malaysia.",
        description:
          "Directory of Malaysian mosques that offer WiFi, workspaces, sports facilities, religious classes, and activities. Built for remote workers, students, and the community who want to work from the mosque.",
        tags: ["Malaysia", "Community", "Directory", "Mosque"],
        link: "https://lepakmasjid.app",
        repoLink: "https://github.com/muazhazali/lepakmasjid",
        accent: "mint",
        status: "published",
        featured: false,
        image: "/projects/lepakmasjid.png",
        creator: "Muaz Hazali",
        stars: 12,
      },
      {
        kind: "community_project",
        title: "Cari Pasar Malam",
        summary: "Find the nearest night market in Malaysia, with hours and location.",
        description:
          "Discover Malaysian night markets (pasar malam) near you with operating hours, location info, and map. Supports pasar tani and pasar pagi too.",
        tags: ["Malaysia", "Night Market", "Directory", "Community"],
        link: "https://pasarmalam.app",
        repoLink: "https://github.com/muazhazali/caripasarmalam",
        accent: "yellow",
        status: "published",
        featured: false,
        image: "/projects/caripasarmalam.png",
        creator: "Muaz Hazali",
        stars: 33,
      },
      {
        kind: "community_project",
        title: "DataAnalyst.my",
        summary: "The go-to resource to learn data science for Malaysians.",
        description:
          "All-in-one resource hub for aspiring data analysts in Malaysia — curated courses, local datasets, SQL patterns, career guides, and community links. Built around Malaysian data and workflows.",
        tags: ["Malaysia", "Data Science", "Education", "Community"],
        link: "https://dataanalyst.my",
        repoLink: "https://github.com/muazhazali/dataanalyst-my",
        accent: "blue",
        status: "published",
        featured: false,
        image: "/projects/dataanalyst-my.png",
        creator: "Muaz Hazali",
        stars: 3,
      },
      {
        kind: "community_project",
        title: "Commute.my",
        summary: "Making Klang Valley public transport accessible to everyone.",
        description:
          "Route planner and line explorer for RapidKL public transport across the Klang Valley. Plan journeys across LRT, MRT, and Monorail lines. Built for locals and tourists alike.",
        tags: ["Malaysia", "Transit", "Civic Tech", "Klang Valley"],
        link: "https://commute.my",
        repoLink: "https://github.com/commute-my/commute-my",
        accent: "blue",
        status: "published",
        featured: false,
        image: "/projects/commute-my.png",
        creator: "CommuteMY",
        stars: 20,
      },
      {
        kind: "community_project",
        title: "Claude Pomodoro",
        summary: "Pixel-art Claude mascot pomodoro timer for Mac, Windows & Linux.",
        description:
          "A cute pixel-art Claude mascot pomodoro timer. Native on macOS, Electron on Windows and Linux. Stay focused with a little AI company — sessions, breaks, and that familiar Claude face on your desktop.",
        tags: ["Desktop App", "Productivity", "Claude", "Electron"],
        repoLink: "https://github.com/Shawnchee/claude-pomodoro",
        accent: "peach",
        status: "published",
        featured: false,
        creator: "Shawn Chee",
        stars: 4,
      },
      {
        kind: "community_project",
        title: "Frontend God Mode",
        summary: "Every famous frontend design skill, bundled into one Claude Code skill.",
        description:
          "A Claude Code skill that bundles every famous frontend design pattern and technique — animations, layouts, micro-interactions, and more — into a single powerful agent skill.",
        tags: ["Claude Code", "Frontend", "Design", "Agent Skill"],
        repoLink: "https://github.com/Shawnchee/frontend-god-mode",
        accent: "purple",
        status: "published",
        featured: false,
        creator: "Shawn Chee",
        stars: 10,
      },
      {
        kind: "community_project",
        title: "GitResume",
        summary: "Turn a public GitHub repo into polished resume bullets.",
        description:
          "Point GitResume at any public GitHub repo, pick the commits that count as your work, and get tight verifiable resume bullets drafted by your LLM of choice — no backend, no analytics, API key stays local.",
        tags: ["Developer Tool", "Resume", "AI", "GitHub"],
        link: "https://gitresume-gold.vercel.app",
        repoLink: "https://github.com/Shawnchee/gitresume",
        accent: "mint",
        status: "published",
        featured: false,
        image: "/projects/gitresume.png",
        creator: "Shawn Chee",
        stars: 1,
      },
      {
        kind: "community_project",
        title: "Caveman Skill",
        summary: "Save tokens by making Claude explain code in caveman language.",
        description:
          "A Claude Code skill that strips back over-engineered thinking by making Claude explain code in caveman language — simple words, raw logic, no jargon. Reduce LLM overthinking and save tokens.",
        tags: ["Claude Code", "Agent Skill", "Developer Tool"],
        repoLink: "https://github.com/Shawnchee/caveman-skill",
        accent: "orange",
        status: "published",
        featured: false,
        creator: "Shawn Chee",
        stars: 65,
      },
    ];

    let count = 0;
    for (const p of projects) {
      await ctx.db.insert("opportunities", p);
      count++;
    }

    console.log(`Seeded ${count} community projects.`);
    return { seeded: count };
  },
});
