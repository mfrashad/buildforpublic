export const SITE = {
  name: "AI for Good",
  domain: "aiforgood.my",
  description:
    "Open-source AI projects, community, and advocacy for social impact in Southeast Asia and beyond.",
  email: "m.fathyrashad@gmail.com",
  github: "https://github.com/mfrashad/aiforgood",
  twitter: "https://x.com/maboroshiiii",
  tiktok: "https://tiktok.com/@mfrashad",
};

export const STATS = [
  { value: "20+", label: "Active Builders" },
  { value: "2", label: "NGOs Served" },
  { value: "16", label: "Countries Tracked" },
  { value: "5M+", label: "Content Views" },
];

export const NAV_LINKS = [
  { href: "/manifesto", label: "Manifesto" },
  { href: "/#community", label: "Community" },
  { href: "/#advocacy", label: "Advocacy" },
  { href: "/#projects", label: "Projects" },
];

export const ROLES = [
  {
    id: "builder",
    title: "Builder",
    description:
      "Contribute code to open-source projects. Ship tools that help real orgs.",
    emoji: "wrench",
  },
  {
    id: "advocate",
    title: "Advocate",
    description:
      "Create content, translate materials, speak at events, spread the word.",
    emoji: "megaphone",
  },
  {
    id: "organizer",
    title: "Organizer",
    description:
      "Host meetups or run the day-to-day: Discord, events, posters, logistics.",
    emoji: "clipboard",
  },
  {
    id: "researcher",
    title: "Researcher",
    description:
      "Produce data and analysis on AI adoption, NGO digital readiness, and public-sector AI in SEA.",
    emoji: "chart",
  },
];

export const FEATURED_PROJECTS = [
  {
    title: "AI Adoption by Country",
    description:
      "Interactive visualization + open data API tracking AI adoption across 16 countries. From UAE at 64% to Nigeria at 7%. Data sourced from Microsoft, Stanford HAI, OECD, and 11 other authoritative sources.",
    tags: ["Open Data", "JSON API", "16 Countries", "React"],
    liveUrl: "https://aiadoption-gray.vercel.app",
    githubUrl: "https://github.com/mfrashad/aiadoption",
    imageUrl: "/sprites/projects/aiadoption.png",
    imageAlt: "AI Adoption by Country screenshot",
  },
  {
    title: "Bookshelf",
    description:
      "Turn your reading library into a beautiful shareable poster. Import from Goodreads or Hardcover, pick a visualization style, and download. Built on World Book Day to raise awareness for global literacy — 773 million adults cannot read.",
    tags: ["Next.js", "Open Source", "Literacy", "World Book Day"],
    liveUrl: "https://bookshelf.aiforgood.my",
    githubUrl: "https://github.com/mfrashad/bookshelf",
    imageUrl: "/sprites/projects/bookshelf.png",
    imageAlt: "Bookshelf — book cover grid visualization",
  },
];

/** @deprecated use FEATURED_PROJECTS */
export const FEATURED_PROJECT = FEATURED_PROJECTS[0];

export const CONTENT_TYPES = [
  {
    id: "videos",
    badge: "TikTok · Instagram",
    title: "Short-form Videos",
    description:
      "Making AI concepts accessible in 60 seconds. AI safety, open source, and tech for good explained for everyone.",
    image: "/sprites/advocacy-videos.png",
  },
  {
    id: "articles",
    badge: "Blog · Tutorials",
    title: "Articles & Guides",
    description:
      "Technical tutorials, AI safety guides, and thought pieces on responsible AI. Published in English and Bahasa Malaysia.",
    image: "/sprites/advocacy-articles.png",
  },
  {
    id: "infographics",
    badge: "Infographics · Data Viz",
    title: "Infographics & Data",
    description:
      "Visual explainers on AI adoption, safety, and impact. Open data visualizations anyone can share and build on.",
    image: "/sprites/advocacy-infographics.png",
  },
];

export const VISION = {
  problem: [
    "AI is being built to maximize returns for shareholders. Problems that don't generate revenue stay unsolved.",
    "The organizations that could most use AI are the ones no company will build for. Food banks, refugee legal aid clinics, rural schools. They are not paying customers.",
  ],
  problemImage: "/sprites/vision-problem.png",
  vision: [
    {
      title: "Build What the Market Won't",
      text: "We build and fund projects the market won't touch. If no company will ship it, we will.",
      image: "/sprites/vision-fund.png",
    },
    {
      title: "Put AI in the Hands of NGOs",
      text: "AI lets one volunteer build what used to take a team. We show NGOs what's possible, match them with builders, and ship the tool together.",
      image: "/sprites/vision-volunteer.png",
    },
    {
      title: "Keep Everything Open",
      text: "AI was trained on what humanity wrote. We publish everything as MIT-licensed code. The next builder starts where we left off, not from scratch.",
      image: "/sprites/vision-opensource.png",
    },
  ],
};

export const COMMUNITY_PROJECTS = [
  {
    name: "MyMP",
    url: "https://mymp.org.my",
    description: "Track Malaysian Members of Parliament — voting records, attendance, and more.",
  },
  {
    name: "Sedekah.je",
    url: "https://sedekah.je",
    description: "Open-source donation directory connecting donors to verified causes across Malaysia.",
  },
  {
    name: "Lepak Masjid",
    url: "https://lepakmasjid.app",
    description: "Find mosques, prayer times, and community events near you.",
  },
  {
    name: "Pasar Malam",
    url: "https://pasarmalam.app",
    description: "Night market directory mapping locations and schedules across Malaysia.",
  },
];

export const HELPED_NGOS = [
  {
    name: "Pocket of Pink",
    url: "https://www.pocketofpink.com",
    description: "Youth education nonprofit — we helped ship their website in a single day using AI.",
    badge: "NGO WE HELPED",
  },
];

export const AI_COMMUNITIES = [
  {
    name: "Build Club",
    description:
      "AI learning community focused on building, with AI-native courses and certifications.",
    url: "https://www.buildclub.ai/",
    image: "/communities/build-club-logo-navbar.webp",
  },
  {
    name: "Build with AI",
    description:
      "Project showcase for the Build With AI Malaysia community, featuring AI projects built by Malaysian builders.",
    url: "https://buildwithai.my/",
    image: "/communities/build_with_ai_logo.jpeg",
  },
  {
    name: "AI Tinkerers",
    description:
      "Global community of AI engineers and researchers building real systems and sharing unfinished work.",
    url: "https://kuala-lumpur.aitinkerers.org/",
    image: "/communities/ai_tinkerers_logo.png",
  },
  {
    name: "AI Hackerdorm",
    description:
      "Student-first community hosting regular builder sessions with project showcases and mentorship.",
    url: "https://aihackerdorm.com/",
    image: "/communities/ai_hackerdorm.webp",
  },
  {
    name: "AI SEA",
    description:
      "Southeast Asia grassroots builder movement connecting local communities into a coalition.",
    url: "https://www.aisea.builders/",
    image: "/communities/aisea_logo.png",
  },
  {
    name: "Rakan Tutor",
    description:
      "Free AI programs for ASEAN youth through hands-on workshops and a digital learning platform.",
    url: "https://rakantutor.org/",
    image: "/communities/rakan-tutor-logo.png",
  },
  {
    name: "Cursor Malaysia",
    description:
      "The Cursor community for Malaysia, hosting hackathons, meetups, and workshops.",
    url: "https://www.instagram.com/cursor.my/",
    image: "/communities/cursor_my_logo.jpg",
  },
  {
    name: "CoderPuffs",
    description:
      "A women-first initiative where we learn coding and AI while cafe-hopping together.",
    url: "https://www.instagram.com/coderpuffs/",
    image: "/communities/coderpuffs_logo.jpg",
  },
  {
    name: "500 AI Residency",
    description:
      "An AI residency program focused on rapid building and shipping, bringing together builders to create and scale AI projects.",
    url: "https://www.500.house/",
  },
];

export const TALKS_DESCRIPTION =
  "20+ speaking engagements at meetups, conferences, and government briefings including Malaysia's Foreign Affairs Ministry (IDFR) and Yayasan Peneraju. Featured on Bernama TV, RTM TV1, Era.fm, and Kosmo.";

export const ROLE_DETAILS = [
  {
    id: "builder",
    title: "Builder",
    tagline: "Build open-source AI tools for social impact and local community problems.",
    commitment: "3–7 hrs / week",
    accentClass: "accent-sky",
    responsibilities: [
      "Take full ownership as PIC (Person In Charge) of one project end-to-end — start a new one, or take over an existing one until it ships.",
      "Projects tackle real problems: NGO needs, underserved communities, local causes in Southeast Asia — not random open source.",
      "Open-source the work where possible and keep the community updated on your progress.",
      "Scope, build, iterate, and hand off with documentation when done.",
    ],
    whoFits: [
      "Experienced devs, vibe coders, AI-assisted builders, and curious beginners",
      "Anyone willing to own a project end-to-end — we'll match your level to the right scope",
      "People who want their work to reach real users with real needs",
    ],
  },
  {
    id: "advocate",
    title: "Advocate",
    tagline: "Be the voice of AI for Good.",
    commitment: "~1 post / week",
    accentClass: "accent-clay",
    responsibilities: [
      "Publish ~1 piece of content per week in any format: short-form video, blog post, tweet/thread, or infographic.",
      "Topics: AI social-impact & safety awareness, OR marketing AI for Good's projects and events.",
      "Claim content requests posted by builders when they need launch coverage or a specific topic covered.",
      "Publish in English or Bahasa Malaysia.",
    ],
    whoFits: [
      "Writers, video creators, graphic designers",
      "Anyone with a platform or learning to build one",
      "People who want to make AI topics accessible to everyone",
    ],
  },
  {
    id: "organizer",
    title: "Organizer",
    tagline: "Be the connective tissue — events, Discord, the day-to-day.",
    commitment: "1+ event / month or online admin",
    accentClass: "accent-olive",
    responsibilities: [
      "In-person: host or co-organize at least one meetup per month. Support PIC launch events, hackathons, and demo nights.",
      "Online admin: manage Discord (moderation, welcomes), keep the event calendar updated, design event posters and social cards.",
      "Connect with local AI communities, NGOs, and venues.",
      "Pick one or both modes — let us know what fits your schedule.",
    ],
    whoFits: [
      "Organized, reliable, and friendly people",
      "Comfortable with chat-driven async work",
      "Event planners, community managers, anyone who likes connecting people",
    ],
  },
  {
    id: "researcher",
    title: "Researcher",
    tagline: "Produce the data and analysis that powers our advocacy.",
    commitment: "3–5 hrs / week",
    accentClass: "accent-fig",
    responsibilities: [
      "Collect, clean, and analyze data on AI adoption, NGO digital readiness, and public-sector AI procurement across Southeast Asia.",
      "Produce reports, datasets, and visual summaries the community can publish and cite in advocacy and grant applications.",
      "Conduct NGO digital-capacity audits — what tools they use, what they're missing, what AI could improve.",
      "Contribute new datasets and improved methodology to our open data API on AI adoption across 16+ countries.",
    ],
    whoFits: [
      "Grad students, policy researchers, data journalists, or anyone with quantitative skills",
      "People interested in AI governance, global development, or public-sector technology",
      "Writers who can turn raw numbers into readable, citable analysis",
    ],
  },
];

export const MANIFESTO_CLAIMS = [
  {
    n: "01",
    claim:
      "AI's benefits are concentrating. This is the expected outcome of building AI to maximize returns for shareholders.",
    evidence:
      "Five companies control 71% of the world's AI compute, up from 63% eighteen months earlier. US private AI investment reached $285.9 billion in 2025. The Global South received a rounding error.",
    source: "Epoch AI 2025; Stanford HAI 2026 AI Index",
  },
  {
    n: "02",
    claim:
      "The communities that will be most transformed by AI are the least represented in building it.",
    evidence:
      "93% of the world's languages are absent from AI training data. Facial recognition systems misidentify dark-skinned faces 10 to 100 times more often than light-skinned ones. The Foundation Model Transparency Index dropped from 58 to 40 in a single year.",
    source: "Nature 2025; MIT Sloan; Stanford HAI 2026",
  },
  {
    n: "03",
    claim:
      "Open-source AI built by volunteer communities is one of the few mechanisms that consistently produces tools for people markets ignore.",
    evidence:
      "Hugging Face grew from 160,000 to 1.57 million generative AI model repositories in two years. 46% of Fortune 500 leaders prefer open models. The AI Adoption by Country API is MIT-licensed, tracks 16 countries, and is used by researchers for free.",
    source: "Mozilla Foundation 2024; our own data",
  },
  {
    n: "04",
    claim:
      "AI literacy is not a luxury. AI systems already make decisions about jobs, loans, content, and public services. Communities that cannot read those decisions are subject to them.",
    evidence:
      "5M+ views of AI literacy content produced by this community, mostly in English and Bahasa Malaysia — languages underrepresented in AI safety discourse.",
    source: "",
  },
  {
    n: "05",
    claim:
      "The window to build public-interest AI infrastructure is closing. The compute concentration ratio moved from 63% to 71% in eighteen months. The trend is not slowing.",
    evidence:
      "The OECD and the UN both concluded in 2024 that AI must be governed as public commons. The policy consensus exists. The implementation does not. Communities like this one are part of filling that gap.",
    source: "OECD.AI 2025; UN Governing AI for Humanity 2024",
  },
];

export const VOLUNTEER_EXPECTATIONS = [
  {
    icon: "🎯",
    title: "Passion for the Mission",
    body: "You believe AI should serve communities, not shareholders. You show up to contribute, not to build your portfolio.",
  },
  {
    icon: "🤲",
    title: "Volunteerism",
    body: "This role is unpaid. Past members have shipped real tools, spoken at conferences, and built working relationships they would not have found otherwise.",
  },
  {
    icon: "🛠️",
    title: "Resourcefulness",
    body: "We run lean. If something is broken, fix it. If a tool doesn't exist, build it. We don't wait for resources.",
  },
  {
    icon: "📆",
    title: "Commitment",
    body: "We need 3 to 7 hours a week, every week. Deliver what you commit to. Show up when you say you will.",
  },
  {
    icon: "📱",
    title: "Clear Communication",
    body: "We work remotely. Reply to messages. Update your team before they ask. Don't go silent.",
  },
];
