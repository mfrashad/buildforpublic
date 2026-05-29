export const SITE = {
  name: "Build for Public",
  domain: "buildforpublic.com",
  description:
    "A movement of builders shipping open code for the public interest — open-source software for communities private capital won't serve.",
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
      "Contribute code to open-source projects. Ship tools that serve the public interest.",
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
      "Produce data and analysis on AI adoption, public-sector readiness, and open-source infrastructure.",
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
      "Making AI concepts accessible in 60 seconds. AI safety, open source, and public-interest tech explained for everyone.",
    image: "/sprites/advocacy-videos.png",
  },
  {
    id: "articles",
    badge: "Blog · Tutorials",
    title: "Articles & Guides",
    description:
      "Technical tutorials, AI safety guides, and thought pieces on public-interest technology. Published in English and Bahasa Malaysia.",
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
    "The systems shaping public life are privately owned. Infrastructure deciding loans, jobs, health, and governance is built to maximize private return — not public benefit.",
    "Private capital builds for paying customers. Communities that don't generate revenue — NGOs, public services, underrepresented languages — get nothing. The public stack has to be built by the public.",
  ],
  problemImage: "/sprites/vision-problem.png",
  vision: [
    {
      title: "Build What Private Capital Won't",
      text: "We build and fund projects private capital won't touch. If no company will ship it for public benefit, we will.",
      image: "/sprites/vision-fund.png",
    },
    {
      title: "Put Open AI in the Hands of the Public",
      text: "AI lets one volunteer build what used to take a team. We show NGOs and public-interest orgs what's possible, match them with builders, and ship the tool together.",
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
  "20+ speaking engagements at meetups, conferences, and government briefings. Featured on Bernama TV, RTM TV1, Era.fm, and Kosmo.";

export const ROLE_DETAILS = [
  {
    id: "builder",
    title: "Builder",
    tagline: "Build open-source software for public-interest problems.",
    commitment: "3–7 hrs / week",
    accentClass: "accent-blue",
    responsibilities: [
      "Take full ownership as PIC (Person In Charge) of one project end-to-end — start a new one, or take over an existing one until it ships.",
      "Projects tackle real problems: NGO needs, underserved communities, public-sector gaps — not random open source.",
      "Open-source the work and keep the community updated on your progress.",
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
    tagline: "Be the voice of Build for Public.",
    commitment: "~1 post / week",
    accentClass: "accent-yellow",
    responsibilities: [
      "Publish ~1 piece of content per week in any format: short-form video, blog post, tweet/thread, or infographic.",
      "Topics: public-interest tech, AI safety awareness, OR marketing Build for Public's projects and events.",
      "Claim content requests posted by builders when they need launch coverage or a specific topic covered.",
      "Publish in any language — multilingual reach is a feature, not an afterthought.",
    ],
    whoFits: [
      "Writers, video creators, graphic designers",
      "Anyone with a platform or learning to build one",
      "People who want to make public-interest tech topics accessible to everyone",
    ],
  },
  {
    id: "organizer",
    title: "Organizer",
    tagline: "Be the connective tissue — events, Discord, the day-to-day.",
    commitment: "1+ event / month or online admin",
    accentClass: "accent-mint",
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
    accentClass: "accent-peach",
    responsibilities: [
      "Collect, clean, and analyze data on AI adoption, NGO digital readiness, and public-sector AI procurement.",
      "Produce reports, datasets, and visual summaries the community can publish and cite in advocacy and grant applications.",
      "Conduct NGO digital-capacity audits — what tools they use, what they're missing, what open-source AI could improve.",
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
    n: "1",
    title: "Technology is Power, and Power is Concentrating",
    body: "Humanity is being handed almost unimaginable power through AI, yet our social and political systems are struggling to keep up. Right now, this technology is largely owned by a few big tech companies and elites. It was trained on the collective knowledge of humanity, but its dividends are driving unprecedented wealth concentration. Because AI acts as a massive productivity multiplier that scales with capital, those with the money to wield it pull exponentially further ahead. Left unchecked, the speed and breadth of this shift will widen the social gap and fracture society.",
  },
  {
    n: "2",
    title: "Private Interests Will Not Build Public Goods",
    body: "The technology that dictates our daily lives is often designed without our best interests in mind. Social media was optimized for attention, leading to radicalization and brain rot. If we leave AI entirely to private companies, the most critical societal problems will remain under-resourced. We cannot rely on a few corporations to build everything society needs, and we cannot afford the risk that they won't.",
  },
  {
    n: "3",
    title: "We Need Public AI",
    body: "We need a whole parallel AI ecosystem that runs on non-commercial incentives. Just like Firefox competing with Internet Explorer, the existence of secure, private, open-source options provides critical alternatives for consumers and forces private competitors to adopt better practices. We must build Public AI — an ecosystem where everyone, not just the wealthiest corporations, can shape and benefit from technology.",
  },
  {
    n: "4",
    title: "The Barrier to Entry Has Collapsed",
    body: "For decades, changemakers have been locked out of technology by the sheer cost of building software. Developers who cared were locked out by the demands of their day jobs. AI is dissolving both problems at once. The cost of creation is collapsing. The gap between knowing a problem deeply and shipping a solution has never been smaller. For the first time, the people closest to the problems can build the solutions themselves.",
  },
  {
    n: "5",
    title: "We Build Together",
    body: "To build technology for the public, the public must build it. We turn changemakers into builders and builders into changemakers. By distributing power and expanding opportunity, we can level the playing field and engage more communities in the future of technology.",
  },
];

export const VOLUNTEER_EXPECTATIONS = [
  {
    icon: "🎯",
    title: "Belief in the Mission",
    body: "You believe technology should serve public interest, not private capital. You show up to contribute, not to build your portfolio.",
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
