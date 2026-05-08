# /loop prompt — PauseAI adapt for AI for Good Malaysia
# Copy everything between the triple-dashes and paste after `/loop`
---
You are implementing pages for AI for Good Malaysia at /Users/rashad/Desktop/code/aiforgood, adapting PauseAI's copywriting techniques to our mission. Work through one page per iteration.

## Step 1 — Read state
Read /Users/rashad/Desktop/code/aiforgood/.agents/pauseai-adapt.md in full. Find the first PENDING row. That is your task. If all rows are DONE, write a final summary section to that file and stop looping.

## Step 2 — Read the codebase before writing anything
Read these files:
- app/globals.css (full design token reference)
- app/funders/page.tsx (complete page example — structure, imports, section patterns)
- app/partners/page.tsx (second example)
- lib/constants.ts (SITE, STATS, existing data)
- components/Navbar.tsx and components/Footer.tsx (import patterns)

## Step 3 — Implement

Work from the spec for whichever page is PENDING:

---
### SPEC: /act

File: app/act/page.tsx — "use client"

**What it is:** PauseAI's /action page adapted for an AI builder+content creator community. The entire page is one question: what can YOU do right now, given how much time you have and what your skills are?

**Tab system:**
Two independent pill-button rows. Both active at once — the combination determines content.

Row 1 — Time:
  "5 Minutes" | "1 Hour" | "A Few Hours" | "Go All In"

Row 2 — You are a:
  "Builder" | "Advocate" | "Organizer" | "Researcher"

State: two useState hooks (selectedTime, selectedRole). Default: "5 Minutes" + "Builder".
Tab UI: pill buttons, border-2 border-border. Active = bg-clay text-white shadow-[3px_3px_0_#1a1b1f]. Inactive = bg-surface-raised text-text-secondary. Hover on inactive = bg-bg.

**Action cards:** Each combination renders 3–5 action cards (card-flat, p-5). Each card has:
- A left accent strip matching the role color (Builder=accent-sky, Advocate=accent-clay, Organizer=accent-olive, Researcher=accent-fig)
- A bold action title (e.g. "Star the GitHub repo")
- One sentence of WHY (the PauseAI rhythm: short claim, then the implication)
- An href link or mailto placeholder

**Content matrix — write real copy for each of the 16 combinations:**

5min + Builder: Star the GitHub repo / Share a project on LinkedIn ("You probably know 10 engineers who have never heard of AI for Good. One share changes that.") / Browse open issues and leave a comment

5min + Advocate: Share one AI for Good video to your story / Repost the AI adoption data with a one-line take / Follow @aiforgood.my on TikTok and Instagram

5min + Organizer: Forward this page to one community you're part of / Add AI for Good to your bio / Share the volunteer link in a WhatsApp group

5min + Researcher: Browse the AI Adoption by Country API / Star the aiadoption repo / Read one paper from our reading list (link placeholder)

1hr + Builder: Read the open issues list and pick one to scope / Review a PR or leave feedback on a community project / Scope a project idea for an NGO you already know

1hr + Advocate: Write one post about an AI safety concept in plain Bahasa Malaysia or English / Record a 60-second video explaining an AI for Good project / Translate existing AI safety content for a SEA audience

1hr + Organizer: Post about AI for Good in one Slack/Discord community you're in / DM three engineers you know who might want to build for good / Draft a short event proposal for a local AI meetup

1hr + Researcher: Pull one dataset and find one unexpected thing in it / Read the Stanford HAI AI Index and note three things relevant to Southeast Asia / Write a two-paragraph summary of the AI adoption gap with a citation

Few Hours + Builder: Pair with an NGO and scope a real problem they have / Build a rough prototype for an open issue / Write documentation for an existing community project

Few Hours + Advocate: Write a full blog post on one AI issue affecting Southeast Asia, backed by data / Produce a short-form video series (3 parts) on AI for social good / Design one shareable infographic with real statistics

Few Hours + Organizer: Host a small builder session — 3 people, 2 hours, one problem to scope / Set up a community call with one NGO to explore collaboration / Organize a local AI for Good watch party or discussion

Few Hours + Researcher: Audit the digital tools used by one NGO you have access to — what's missing, what AI could improve / Write a short report on AI procurement in one SEA government / Collect and clean one dataset that doesn't exist yet

Go All In + Builder: Own a project end-to-end as PIC (Person In Charge) — scope, build, ship, document / Mentor a newer builder through their first contribution / Become a recurring contributor — one commit per week minimum

Go All In + Advocate: Commit to one post per week for three months / Build a small audience around responsible AI in Southeast Asia / Become the voice of AI for Good in your language community

Go All In + Organizer: Run monthly builder sessions — own the logistics, the NGO pipeline, the follow-up / Be the Discord moderator and community glue / Connect AI for Good to two new communities in your city

Go All In + Researcher: Own the AI adoption dataset — expand it, maintain it, publish findings / Produce a quarterly report on the AI divide in Southeast Asia / Write the research that grant committees cite when they fund us

**Escalation copy — use PauseAI's rhythm:**
- 5min header: "Small actions compound. This one takes less time than a coffee."
- 1hr header: "An hour of your skill is worth more than most people realize."
- Few Hours header: "This is where most volunteer impact actually lives."
- Go All In header: "The most valuable thing you can give is not money. It is the skill the market is paying you to use elsewhere."

**Hero section:**
Heading (heading-display, large): "Pick your time. Pick your skill. Here's exactly what to do."
Sub (text-text-secondary): "Every action here moves something real. The 5-minute ones add up. The all-in ones change the direction of this project."

**Page metadata:** title="Take Action — AI for Good Malaysia"

---
### SPEC: /why-now

File: app/why-now/page.tsx — static, no client state

**What it is:** PauseAI's /risks page adapted for AI equity — not extinction risk, but concentration risk. Uses PauseAI's escalation structure: present harms (concrete, cited) → near-future (trending) → what we can still build.

**Tone rule:** Every claim is specific. No generic statements. Each card follows PauseAI's pattern exactly: plain claim → concrete evidence (number or incident) → "This means" or "This is why" closes each block. No em dashes. No semicolons. Plain English.

**Section 1 — "What is happening right now"**
Grid sm:grid-cols-2 gap-5, card-flat p-6 each with accent strip.

Card 1 — accent-clay: AI compute is owned by five companies
"Amazon, Google, Meta, Microsoft, and Oracle now control 71% of the world's cumulative AI compute — up from 63% eighteen months earlier. Their combined capital expenditure commitment for 2026 exceeds $660 billion. Any community, NGO, or government that needs AI must pay rent to this oligopoly."
Source: Epoch AI, 2025

Card 2 — accent-sky: The US gets 23 times more AI investment than China
"US private AI investment reached $285.9 billion in 2025. China received $13.3 billion. Southeast Asia received a rounding error. The AI frontier is not a global phenomenon. It is concentrated in a handful of zip codes in San Francisco and Seattle. Everywhere else is structurally excluded."
Source: Stanford HAI 2026 AI Index

Card 3 — accent-olive: 93% of the world's languages are invisible to AI
"Only 7% of the world's 7,000 languages are reflected in published online material. English dominates AI training data at 30%. Malay, Bahasa Indonesia, Tamil, and the languages of Malaysia's indigenous communities are statistical noise. AI systems built on this data will systematically fail anyone who does not speak English. Not as a bug. As an architectural consequence."
Source: Nature, 2025

Card 4 — accent-fig: The most powerful AI systems are getting less transparent
"Stanford HAI's Foundation Model Transparency Index dropped from 58 to 40 in a single year. The most capable AI systems are becoming less auditable and less accountable as they become more powerful. Power is concentrating. The public's ability to scrutinize it is shrinking."
Source: Stanford HAI 2026 AI Index

**Section 2 — "What happens next if nothing changes"**
Heading: "What comes next"
3 cards (card + accent-clay). Each one follows the PauseAI rhythm: plain claim, then implication.

Item 1: Southeast Asia's infrastructure gap becomes permanent
"Rural areas across Southeast Asia average 55% internet penetration versus 90% in major cities. Only 30% of rural schools have reliable high-speed internet versus 85% of urban schools. AI tools designed for the connected and English-literate will deepen these gaps unless communities actively counter them. The projected $1 trillion AI GDP boost to the region by 2030 will accrue to those already connected."
Source: Tech Collective SEA, 2025

Item 2: AI used on communities, not by them
"The AI Now Institute's 2025 report states it plainly: 'Today's AI is not just being used by us. It is being used on us.' Facial recognition systems misidentify Black and Asian faces 10 to 100 times more often than white faces. Automated hiring systems filter out applicants whose resumes do not match patterns from existing employees. The communities with the least power have the least recourse."
Source: AI Now Institute 2025; MIT Sloan facial recognition research

Item 3: NGOs locked out of tools they cannot afford
"Governments and NGOs that want AI will buy from the vendors who show up with a sales team. Those vendors will not build for the specific needs of a Malaysian food bank or a Philippine refugee legal aid clinic. They will sell a generic product at enterprise pricing. The organizations serving the most vulnerable people will be the last to benefit."

**Section 3 — "What we can still build"**
Heading: "What we can still build"
3 cards (card + accent-olive). Each one is the direct counter to a harm above.

Item 1: Open infrastructure anyone can use
"The OECD and the UN have both concluded that core AI components should be governed as public commons — open, interoperable, auditable. The policy consensus is building. Open-source communities building MIT-licensed tools for NGOs are not ahead of their time. They are ahead of most governments in actually doing it."
Source: OECD.AI 2025; UN Governing AI for Humanity 2024

Item 2: A public record of the AI divide
"Data that does not exist cannot drive policy. We built the AI Adoption by Country API because no single source tracked this across 16 countries in a usable format. That data is now free. Any researcher, journalist, or NGO can use it. This is what public-interest AI infrastructure looks like in practice."

Item 3: AI literacy in the languages that need it most
"Mozilla's research shows open source AI already works. Hugging Face grew from 160,000 to 1.57 million generative AI model repositories in two years. 46% of Fortune 500 leaders prefer open models. The technology is there. What is missing is content that explains it, in the languages of the people most affected by it."
Source: Mozilla Foundation 2024

**CTA row at bottom:**
Three cards side by side: "Build something → /act", "Bring us a problem → /partners", "Support this work → /funders"

**Page metadata:** title="Why This Matters Now — AI for Good Malaysia"

---
### SPEC: /faq

File: app/faq/page.tsx — static

**What it is:** Preemptive objection handling. PauseAI's technique: name the strongest version of the objection before answering. Never defensive. Links out to more detail rather than over-explaining.

**Apply PauseAI stylometry:** Short plain answers. "This is not X. It is Y." Demonstrative chains. No hedging on factual claims.

**Questions and answer approach:**

Q: "Is this just another tech nonprofit doing AI ethics theater?"
Steel-man: The AI ethics space is full of orgs that publish papers, host panels, and change nothing.
Answer: Point to the concrete output — Pocket of Pink website, AI Adoption API used by researchers across 16 countries, 20+ builders who shipped something real. "We measure success in shipped code and NGOs served, not white papers published."

Q: "Why Malaysia? Why Southeast Asia?"
Answer: Not charity from outside — builders who live here, building for problems they see. The AI divide is most visible in Southeast Asia. And no one else is doing this here. "The counterfactual is not 'someone else will.' The counterfactual is 'no one will.'"

Q: "Why volunteer time instead of just donating money?"
Answer: Money can not buy what a skilled engineer volunteering a weekend produces for an NGO with no tech budget. "The skill gap is not a funding gap. It is a who-shows-up gap."

Q: "Does open-source AI actually reach the NGOs that need it?"
Answer: Only if someone builds the bridge. That is what the community is for — not just shipping code to GitHub, but working directly with NGOs to scope, test, and deploy. Pocket of Pink is the proof of concept.

Q: "How is this different from Big Tech's own 'AI for Good' programs?"
Steel-man: Google.org and Microsoft Philanthropies spend hundreds of millions on AI for good.
Answer: They build for the problems their tools can already solve. They do not build for the problems no SaaS company would touch. "We build what the market will not."

Q: "What has AI for Good Malaysia actually shipped?"
Answer: List concretely — Pocket of Pink (website shipped in one day), AI Adoption by Country API (16 countries, used by researchers), 5M+ content views. Link to /partners and #projects.

Q: "Who funds this?"
Answer: Currently self-funded by the founder and running on volunteer time. Looking for funders who believe AI's benefits should not concentrate. Full transparency: no institutional funding yet. Link to /funders.

Q: "Will my volunteer hours make any difference?"
Steel-man: Most volunteer programs are not worth your time.
Answer: Depends on how you use them. If you show up and own something — an issue, a project, a session — yes. If you sign up and wait to be assigned a task, probably not. "We are looking for people who pick something up and run with it." Link to /act.

Q: "Why should I trust that this org will still exist in two years?"
Answer: Honest — the community already exists and has shipped things. The risk is not that it disappears, it is that it stays small. The people building it are not going anywhere. Link to /roadmap.

**Layout:** Flat Q+A list. Each Q in a card-flat with bold question, answer in text-secondary. No accordion needed — keep it scannable. Section heading: "Questions we hear a lot." No hero needed — start directly.

**Page metadata:** title="FAQ — AI for Good Malaysia"

---
### SPEC: /manifesto

File: app/manifesto/page.tsx — static, but needs navigator.clipboard so "use client"

**What it is:** A versioned position document. PauseAI's proposal page adapted — numbered claims, each backed by one data point, quiet absolutism throughout.

**Version block (top of page, small monospace):**
"Version 1.0 — Published May 2026"
Under it: "This document states what AI for Good Malaysia believes and why. It will be updated as the evidence changes."

**5 numbered claims — apply PauseAI stylometry: radical content, measured language, plain English. No em dashes.**

1. "AI's benefits are concentrating. This is not an accident. It is the expected outcome of building AI to maximize returns for shareholders."
Evidence: Five companies now control 71% of the world's AI compute. US private AI investment was $285.9 billion in 2025. The Global South received a rounding error. [Epoch AI 2025; Stanford HAI 2026]

2. "The communities that will be most transformed by AI are the least represented in building it."
Evidence: 93% of the world's languages are invisible to AI training data. Facial recognition systems misidentify dark-skinned faces 10 to 100 times more than light-skinned ones. The most powerful AI systems are getting less transparent, not more. [Nature 2025; MIT Sloan; Stanford HAI 2026]

3. "Open-source AI built by volunteer communities is one of the few mechanisms that consistently produces tools for people markets ignore."
Evidence: Hugging Face grew from 160,000 to 1.57 million AI model repositories in two years. 46% of Fortune 500 leaders prefer open models. The AI Adoption API is MIT-licensed, tracking 16 countries, used by researchers for free. [Mozilla 2024; our own data]

4. "AI literacy is not a luxury. In a world where AI systems are making decisions about jobs, loans, and services, not understanding how they work is a form of disenfranchisement."
Evidence: 5M+ views of AI literacy content produced by this community, mostly in English and Bahasa Malaysia. The communities most affected by AI are the least served by content explaining it.

5. "The window to shape public-interest AI infrastructure is now. The compute concentration ratio went from 63% to 71% in eighteen months. The trend is not slowing."
Evidence: OECD and the UN both concluded in 2024 that AI must be governed as public commons. The policy consensus exists. The implementation does not. This community is part of filling that gap. [OECD.AI 2025; UN 2024]

**Signatory section:**
Heading: "Add your name"
Body: "If you believe what this document says, sign on. We will maintain a public list of signatories. Individual names, organizational affiliations optional."
CTA: mailto link (m.fathyrashad@gmail.com?subject=Manifesto signatory — [Your name])

**Current signatories (hardcoded for now, 2-3 placeholders):**
"Cleve Mufti Athyrashad — Founder, AI for Good Malaysia"
"[Your name here]"

**Share section:**
"Share this manifesto" — copy-to-clipboard button (navigator.clipboard.writeText(window.location.href)), and a Twitter/X share link.

**Page metadata:** title="The Manifesto — AI for Good Malaysia"

---
### SPEC: /roadmap

File: app/roadmap/page.tsx — static

**What it is:** PauseAI's roadmap scenario model. What the community is and what becomes possible at different levels of support.

**Apply the PauseAI framing:** language of what each level ENABLES, not requires. State current constraints plainly — "the founder is doing everything" is vulnerability as credibility. No inflated claims.

**Section 1 — Today (bootstrapped):**
Plain statement of current reality.
"AI for Good Malaysia is a volunteer community. The founder is doing ops, community management, and technical work simultaneously. That is the constraint. Everything you see — the projects, the content, the NGO partnerships — was built in the gaps."
What exists: 20+ builders, 2 NGO partnerships, AI Adoption API (16 countries), 5M+ content views, active communities in KL, Singapore, and online.

**Scenario 1 — $10,000:**
"Community infrastructure becomes sustainable."
Enables: Consistent biweekly builder sessions. A proper project pipeline. The founder can focus on scoping NGO problems instead of also running logistics. 2–3 NGO projects scoped and started per quarter.

**Scenario 2 — $25,000:**
"The first flagship project ships with real resources."
Enables: A design budget. Paid NGO partner time (so the NGO co-owns the build, not just receives it). Documentation and onboarding so the project is reusable by other cities. 1 open-source flagship per year.

**Scenario 3 — $50,000:**
"The community doubles."
Enables: A dedicated community organizer (part-time, contract). Regular events in 2–3 cities. 5+ active projects. Content program reaches 10M views.

**Scenario 4 — $100,000:**
"This becomes infrastructure."
Enables: Full-time coordination. 3 flagship open-source builds per year with proper documentation. The AI Adoption API expands to 30+ countries. A Southeast Asia AI literacy curriculum, free and open. Other cities can fork the model.

Layout: Today = card-flat (no clay), each Scenario = card with accent-cactus and the dollar amount in large clay text. Bullet list of what becomes possible, all in "enables" language.

Close with /funders CTA.

**Page metadata:** title="Roadmap — AI for Good Malaysia"

---

## Step 4 — Anti-slop review

After writing all copy for the page, invoke `/stop-slop` on every paragraph of prose you wrote (hero text, card bodies, CTA copy, section headers). The scoring threshold is 35/50 — anything below triggers a revision pass.

Rules for this project specifically:
- No em dashes (user instruction — overrides PauseAI reference)
- No filler phrases: "unlock", "empower", "leverage", "journey", "transform", "thrive"
- No vague community-speak. Every claim is specific or it gets cut.
- Keep stop-slop's other 8 rules: no passive voice padding, no hedge stacking, no empty openers.

Revise, then move to Step 5.

## Step 5 — TypeScript check

Run: cd /Users/rashad/Desktop/code/aiforgood && npx tsc --noEmit
Fix all TypeScript errors. Do not mark DONE until it compiles clean.

## Step 6 — Update state file

In /Users/rashad/Desktop/code/aiforgood/.agents/pauseai-adapt.md, mark the page DONE. Add 2–3 bullet notes: key decisions made, content placeholders left, anything the founder should review.

## Non-negotiable design rules

- bg = #fff7e7 (eggshell). No dark backgrounds anywhere.
- All cards: `card` (border-2 + offset shadow + hover lift) or `card-flat` (border-2, no shadow).
- All buttons: `btn-pill btn-pill-clay` (primary) or `btn-pill btn-pill-outline` (secondary).
- Headings: `heading-display` or `heading-section` class.
- Section spacing: `section-padding` class.
- Accent strips on cards: `accent-clay`, `accent-sky`, `accent-olive`, `accent-fig`, `accent-cactus`.
- No new npm dependencies. No framer-motion on new pages.
- Always import Navbar from "@/components/Navbar" and Footer from "@/components/Footer".
- Each page file ≤ 300 lines. Extract sub-components in the same file if needed.

## Non-negotiable copy rules (from stylometry analysis)

- Short declarative sentence → medium explanatory → short conclusion. Never three long sentences in a row.
- "This leads to. This means. This is why." — demonstrative chains as transitions.
- "Not X, but Y" for pivoting objections.
- Hedge projections. State observable facts as facts.
- Radical claims in plain, measured language. No exclamation marks. No em dashes.
- Never imply confirmed staff hires, FTEs, or operational budgets that haven't been announced.
- AI for Good is a **community of builders and content creators**. That is the product. The community is the thing.
---
