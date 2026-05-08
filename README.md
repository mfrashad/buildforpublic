# AI for Good Malaysia

Open-source AI projects, community, and advocacy for social impact in Southeast Asia and beyond.

**Live site:** [aiforgood-two.vercel.app](https://aiforgood-two.vercel.app)

## What is this?

AI for Good is a hub connecting builders and communities for social impact. The people who need AI most — social impact orgs, NGOs, educators — are rarely in the room where it's being built. We're changing that.

Open-source social impact projects already exist: pasarmalam.app, sedekah.je, wikiimpact. Each built by one person, grown by contributors. They prove the model works, but they stay isolated. No shared infrastructure, no way to build on each other's work.

We're building that infrastructure.

## Three Initiatives

### 1. Community *(coming soon)*

Biweekly sessions connecting builders to NGOs and social impact orgs. Part workshop, part co-working, part open hangout. We form teams, match real needs to builders, and ship projects that matter.

### 2. Advocacy *(active)*

Educational content making AI accessible to everyone. Talks, short-form videos, blogs, and infographics advocating for responsible AI, AI safety, and open-source AI for social good. Content in English and Bahasa Malaysia.

- 20+ speaking engagements at meetups, conferences, and government briefings
- Featured on Bernama TV, RTM TV1, Era.fm, and Kosmo
- 5M+ combined content views

### 3. Open Source Projects *(active)*

A growing collection of open-source projects that use AI for social good. Each project ships reusable components — datasets, APIs, templates — so the next builder inherits, not rebuilds.

**Current projects:**

| Project | Description | Links |
|---------|-------------|-------|
| [aiadoption](https://github.com/mfrashad/aiadoption) | Interactive visualization + open data API for AI adoption across 16 countries | [Live](https://aiadoption-gray.vercel.app) · [API](https://aiadoption-gray.vercel.app/api/v1/countries.json) |

## Get Involved

We're looking for builders, designers, writers, and anyone who wants to use their skills for social good.

| Role | What you'd do |
|------|---------------|
| **Builder** | Contribute code to open-source projects. Ship tools that help real orgs. |
| **Advocate** | Create content, translate materials, speak at events, spread the word. |
| **Organizer** | Help run meetups, connect with NGOs, coordinate build cycles. |

Reach out: rashad@aiforgood.my

## Run locally

No build step — just serve the HTML file:

```bash
python3 -m http.server 8090
# or
npx serve .
```

## Tech stack

Single `index.html` with Tailwind CSS (CDN). No framework, no dependencies, no build step.

## License

MIT
