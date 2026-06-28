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

// One-off: add the "Seeder" community build (https://github.com/danielsyauqi/Seeder).
// Idempotent — skips if a published community_project titled "Seeder" already exists.
export const addSeeder = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("opportunities")
      .withIndex("by_status_and_kind", (q) =>
        q.eq("status", "published").eq("kind", "community_project"),
      )
      .collect();
    if (existing.some((d) => d.title === "Seeder")) {
      console.log("Seeder already added — skipping.");
      return { skipped: true };
    }

    const id = await ctx.db.insert("opportunities", {
      kind: "community_project",
      title: "Seeder",
      summary:
        "Self-hosted project manager — kanban tasks, client requests, a public client board, and a built-in MCP server.",
      description:
        "A foundational project manager for small teams: kanban tasks with categories, multi-tag labels, phases, priorities, assignees and due dates; a separate inbound client-request queue that converts into tasks; an opt-in, token-gated public client board to share progress without giving clients an account; a daily planner; and a built-in MCP server so AI assistants can read and edit your data. Open source (MIT) and self-hosted on Cloudflare Workers (D1 + R2) or a single Node VM — built with Next.js, Drizzle ORM, Better Auth, and Tailwind.",
      tags: ["TypeScript", "Project Management", "MCP", "Self-Hosted"],
      link: "https://seederpm.xyz",
      repoLink: "https://github.com/danielsyauqi/Seeder",
      accent: "mint",
      status: "published",
      featured: false,
      officialBFP: false,
      image: "/projects/seeder.png",
      creator: "Daniel Syauqi",
      stars: 56,
    });
    console.log(`Added Seeder community build: ${id}`);
    return { ok: true, id };
  },
});

// One-off: trim the Seeder card description to match sibling cards (~2 sentences).
export const fixSeederDescription = internalMutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("opportunities")
      .withIndex("by_status_and_kind", (q) =>
        q.eq("status", "published").eq("kind", "community_project"),
      )
      .collect();
    const seeder = all.find((d) => d.title === "Seeder");
    if (!seeder) {
      console.log("Seeder not found — nothing to patch.");
      return { patched: false };
    }
    await ctx.db.patch(seeder._id, {
      description:
        "A foundational project manager for small teams — kanban tasks, an inbound client-request queue, an opt-in public client board, and a daily planner. Self-hosted on Cloudflare Workers or a single Node VM, with a built-in MCP server so AI assistants can read and edit your data.",
    });
    console.log(`Patched Seeder description: ${seeder._id}`);
    return { patched: true };
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

    const bfpProjects: Parameters<typeof ctx.db.insert<"opportunities">>[1][] = [
      {
        kind: "community_project",
        title: "OpenNGO",
        summary: "A directory of Malaysia's NGOs, with an API anyone can build on.",
        description:
          "Civil society shouldn't be hard to find. OpenNGO is a public directory of Malaysian NGOs with structured data, search, and an open API. Built for journalists, funders, and researchers.",
        tags: ["Open Data", "API", "NGO", "Malaysia"],
        link: "https://open-ngo.vercel.app",
        repoLink: "https://github.com/mfrashad/OpenNGO",
        accent: "mint",
        status: "published",
        featured: false,
        image: "/og/openngo.png",
        creator: "Build for Public",
        stars: 1,
        officialBFP: true,
      },
      {
        kind: "community_project",
        title: "Bookshelf",
        summary: "Turn your reading library into a shareable poster.",
        description:
          "Import from Goodreads or Hardcover, pick a visualization style, and download. Built on World Book Day to raise awareness for global literacy — 773 million adults cannot read.",
        tags: ["Open Source", "Literacy", "Next.js"],
        link: "https://bookshelf.buildforpublic.com",
        repoLink: "https://github.com/mfrashad/bookshelf",
        accent: "yellow",
        status: "published",
        featured: false,
        image: "/projects/bookshelf.png",
        creator: "Build for Public",
        stars: 2,
        officialBFP: true,
      },
      {
        kind: "community_project",
        title: "AI Adoption by Country",
        summary: "Open data tracking AI adoption across 16 countries.",
        description:
          "Interactive visualization and open data API tracking AI adoption from UAE at 64% to Nigeria at 7%. Data sourced from Microsoft, Stanford HAI, OECD, and 11 other authoritative sources.",
        tags: ["Open Data", "AI", "Data Viz", "JSON API"],
        link: "https://aiadoption-gray.vercel.app",
        repoLink: "https://github.com/mfrashad/aiadoption",
        accent: "blue",
        status: "published",
        featured: false,
        image: "/projects/aiadoption.png",
        creator: "Build for Public",
        stars: 0,
        officialBFP: true,
      },
    ];

    let count = 0;
    for (const p of [...projects, ...bfpProjects]) {
      await ctx.db.insert("opportunities", p);
      count++;
    }

    console.log(`Seeded ${count} community projects.`);
    return { seeded: count };
  },
});

/**
 * Add specific board projects (HumAIne, TitikLab, YouthWave MY).
 * Idempotent: skips any whose title already exists.
 */
export const seedBoardProjects = internalMutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("opportunities").collect();
    const titles = new Set(all.map((o) => o.title));

    const entries: Parameters<typeof ctx.db.insert<"opportunities">>[1][] = [
      {
        kind: "community_project",
        title: "HumAIne",
        summary:
          "A movement and manifesto for staying human with AI — read, sign, and join.",
        description:
          "HumAIne is a global movement for people who refuse to choose between embracing AI and staying deeply human. The site lets people read the manifesto, sign it (with a hand-drawn or typed signature that replays stroke-by-stroke), and watch a living wall of signatures and messages grow. Built with Next.js + Turso. Open to contributors — next up are the About, Messages, and Resources pages.",
        tags: ["Open Source", "AI", "Movement", "Next.js"],
        link: "https://humaine-movement.com",
        repoLink: "https://github.com/buildforpublic/humaine",
        accent: "peach",
        status: "published",
        featured: false,
        creator: "Build for Public",
        skillsNeeded: ["Next.js", "React", "Design"],
        difficulty: "intermediate",
        stars: 0,
        officialBFP: true,
      },
      {
        kind: "community_project",
        title: "TitikLab — Pendigitalan Irama Kulintangan Bajau",
        summary:
          "A digital learning platform preserving traditional Bajau Tagungguk music and its five titik rhythms.",
        description:
          "TitikLab digitises and promotes traditional Bajau music (Tagungguk) from Semporna, Sabah. The educational site will let people learn the history and cultural significance of Tagungguk, explore the five traditional titik (Tabawan, Tarirai, Limbayan, Lellang, and Senai-senai), discover the ensemble's instruments, watch demonstration photos and videos, listen to each titik's rhythm, download a learning pamphlet, and read about the community partners. Early-stage build, in collaboration with researcher Cikgu Rosley (traditional rhythm codes) and the Sulimbag Jawtee music group of Semporna (content verification and workshop demonstrations). Builders welcome.",
        tags: ["Cultural Heritage", "Education", "Music", "Sabah"],
        repoLink: "https://github.com/buildforpublic/titiklab",
        accent: "blue",
        status: "published",
        featured: false,
        orgName: "TitikLab",
        creator: "Build for Public",
        skillsNeeded: ["Next.js", "Design", "Content"],
        difficulty: "beginner",
        stars: 0,
        officialBFP: true,
      },
      {
        kind: "ngo_request",
        title: "YouthWave MY (Pertubuhan Gelombang Muda Malaysia)",
        summary:
          "A Malaysian youth-empowerment NGO looking for builders — scope to be defined.",
        description:
          'Pertubuhan Gelombang Muda Malaysia ("YouthWave MY") is a youth-focused NGO in Malaysia. Public information is limited, so builders should research their Facebook group/posts and LinkedIn to understand their work, then propose how technology could help — for example a website, member/event tools, or content. An open opportunity to scope and shape from the ground up.',
        tags: ["NGO", "Youth", "Malaysia", "Scoping"],
        link: "https://my.linkedin.com/in/youthwave-malaysia-341347200",
        accent: "purple",
        status: "published",
        featured: false,
        orgName: "Pertubuhan Gelombang Muda Malaysia (YouthWave MY)",
        difficulty: "beginner",
      },
    ];

    let count = 0;
    for (const e of entries) {
      if (titles.has(e.title)) {
        console.log(`Skip existing: ${e.title}`);
        continue;
      }
      await ctx.db.insert("opportunities", e);
      count++;
    }

    console.log(`Seeded ${count} board projects.`);
    return { seeded: count };
  },
});

/**
 * Reclassify the board projects as NGO requests and rewrite each as a
 * developer-facing build brief (design guidelines + pages where they exist,
 * otherwise point devs to the org's socials to infer scope).
 * Idempotent: patches by title; safe to re-run.
 */
export const reclassifyBoardProjects = internalMutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("opportunities").collect();
    const byTitle = new Map(all.map((o) => [o.title, o._id]));

    const patches: Record<string, Record<string, unknown>> = {
      HumAIne: {
        kind: "ngo_request",
        summary:
          "Help build the HumAIne movement site — a signable manifesto for staying human with AI. Full brand + PRD provided.",
        description:
          "HumAIne is a global movement and a signable manifesto for people who refuse to choose between embracing AI and staying deeply human. Build a site that makes the manifesto feel serious, human, and signable, and turns agreement into visible momentum through signatures and messages.\n\nPages: (1) Homepage — the why (why HumAIne exists), the what (a global movement with the manifesto at its heart), founding members, and follow-the-movement (socials + newsletter); (2) Manifesto — the four values and principles plus a sign form (name, email, optional message), a live signature counter, a signature wall, and a message board. Future pages: About, Messages, Resources.\n\nBrand: titles in Georgia, body in Nunito. HUMAINE palette — Ancient Parchment #F4F1EA (background), Carbon Slate #2F353B (ink / the AI), Sun-Flare Amber #E6A532 (Purposeful Use), Ancient Moss #2D5A27 (Active Thinking), Burned Terracotta #A35C44 (Human Agency), Dusk Rose #D4908B (Deeper Connection). The logo is a fingerprint + circuit 'H'.\n\nDocs: a working build and full PRD already exist — see the repo README (linked) for the brief, brand kit, and voice guide. Good next tasks: align the live site to the official brand and build the About / Messages / Resources pages.",
        tags: ["AI", "Movement", "Manifesto", "Next.js"],
        skillsNeeded: ["Next.js", "React", "Design"],
        difficulty: "intermediate",
        link: "https://humaine-movement.com",
        repoLink: "https://github.com/buildforpublic/humaine",
        orgName: "HumAIne Movement",
        accent: "peach",
        officialBFP: false,
        featured: false,
      },
      "TitikLab — Pendigitalan Irama Kulintangan Bajau": {
        kind: "ngo_request",
        summary:
          "Build a digital learning platform for traditional Bajau Tagungguk music — page brief provided; brand open.",
        description:
          "TitikLab (Pendigitalan Irama Kulintangan Bajau) preserves and promotes traditional Bajau music — Tagungguk — from Semporna, Sabah.\n\nBuild a simple educational website where users can: learn the history and cultural significance of Tagungguk; explore the five traditional titik (Tabawan, Tarirai, Limbayan, Lellang, and Senai-senai); learn about the instruments in a Tagungguk ensemble; view demonstration photos and videos; listen to the rhythm of each titik (if possible); download a learning pamphlet; and read about the project and its community partners.\n\nPartners: it's early-stage, in collaboration with Cikgu Rosley (academic research on the traditional rhythm codes) and Sulimbag Jawtee, a traditional music group from Semporna (content verification and workshop demonstrations).\n\nBrand: no guidelines yet — propose a culturally-appropriate direction, or infer one from the partners' materials. The repo is set up (linked).",
        tags: ["Cultural Heritage", "Education", "Music", "Sabah"],
        skillsNeeded: ["Web", "Design", "Content"],
        difficulty: "beginner",
        repoLink: "https://github.com/buildforpublic/titiklab",
        orgName: "TitikLab",
        accent: "blue",
        officialBFP: false,
        featured: false,
      },
      "YouthWave MY (Pertubuhan Gelombang Muda Malaysia)": {
        kind: "ngo_request",
        summary:
          "A Malaysian youth NGO needs a builder — no brief yet; infer scope from their socials.",
        description:
          'Pertubuhan Gelombang Muda Malaysia ("YouthWave MY") is a Malaysian youth NGO that represents the voices of young people on current national issues.\n\nThere is no brief, brand, or page spec yet — builders should infer what\'s needed from the organisation\'s social media and posts, then propose how technology could help (a website, member/event tools, content, etc.) and reach out to scope it.\n\nSocials: Facebook https://www.facebook.com/youthwaveMY/ · LinkedIn https://my.linkedin.com/company/pertubuhan-gelombang-muda-malaysia-youthwave',
        tags: ["NGO", "Youth", "Malaysia", "Scoping"],
        difficulty: "beginner",
        link: "https://www.facebook.com/youthwaveMY/",
        repoLink: "https://github.com/buildforpublic/youthwave",
        orgName: "Pertubuhan Gelombang Muda Malaysia (YouthWave MY)",
        accent: "purple",
        officialBFP: false,
        featured: false,
      },
    };

    let count = 0;
    for (const [title, patch] of Object.entries(patches)) {
      const id = byTitle.get(title);
      if (!id) {
        console.log(`Not found: ${title}`);
        continue;
      }
      await ctx.db.patch(id, patch);
      count++;
    }

    console.log(`Reclassified ${count} board projects to ngo_request.`);
    return { updated: count };
  },
});
