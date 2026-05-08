"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Time = "5 Minutes" | "1 Hour" | "A Few Hours" | "Go All In";
type Role = "Builder" | "Advocate" | "Organizer" | "Researcher";

const TIME_KEYS: Time[] = ["5 Minutes", "1 Hour", "A Few Hours", "Go All In"];
const ROLE_KEYS: Role[] = ["Builder", "Advocate", "Organizer", "Researcher"];

const ROLE_COLOR: Record<Role, string> = {
  Builder: "var(--color-sky)",
  Advocate: "var(--color-clay)",
  Organizer: "var(--color-olive)",
  Researcher: "var(--color-fig)",
};

const ESCALATION: Record<Time, string> = {
  "5 Minutes": "Small actions compound. This one takes less time than a coffee.",
  "1 Hour": "One skilled hour on a real problem does something a donation cannot.",
  "A Few Hours": "Most volunteer impact concentrates in a few focused hours. This is that window.",
  "Go All In":
    "The skill the market pays you for is the scarcest resource in this community. Use it here.",
};

type Action = { title: string; why: string; href: string };

const ACTIONS: Record<Time, Record<Role, Action[]>> = {
  "5 Minutes": {
    Builder: [
      { title: "Star the GitHub repo", why: "Most engineers who would build for good have not heard of us. One star changes their discovery feed.", href: "https://github.com/mfrashad/aiforgood" },
      { title: "Share a project on LinkedIn", why: "You know ten engineers who have never heard of AI for Good. One share changes that.", href: "https://github.com/mfrashad/aiforgood" },
      { title: "Browse open issues and leave a comment", why: "Comments attract contributors. Leave one.", href: "https://github.com/mfrashad/aiforgood/issues" },
    ],
    Advocate: [
      { title: "Share one AI for Good video to your story", why: "Each share reaches people the algorithm has not surfaced yet.", href: "https://tiktok.com/@mfrashad" },
      { title: "Repost the AI adoption data with a one-line take", why: "Nobody shares raw numbers. They share your one-line take on them.", href: "https://aiadoption-gray.vercel.app" },
      { title: "Follow @aiforgood.my on TikTok and Instagram", why: "Discovery is the first barrier. Help us past it.", href: "https://tiktok.com/@mfrashad" },
    ],
    Organizer: [
      { title: "Forward this page to one community you are part of", why: "One message in the right group can bring in ten builders.", href: "/act" },
      { title: "Add AI for Good to your bio", why: "Visibility is recruiting. Every impression is a potential volunteer.", href: "https://aiforgood.my" },
      { title: "Share the volunteer link in a WhatsApp group", why: "The people most likely to join are the ones you already know.", href: "/volunteer" },
    ],
    Researcher: [
      { title: "Browse the AI Adoption by Country API", why: "Sixteen countries, one open dataset. See what we have and what is missing.", href: "https://aiadoption-gray.vercel.app" },
      { title: "Star the aiadoption repo", why: "Stars signal credibility to researchers who will cite this data.", href: "https://github.com/mfrashad/aiadoption" },
      { title: "Read the AI Now 2025 Landscape Report", why: "The strongest contribution starts with knowing the field.", href: "https://ainowinstitute.org/publications/research/ai-now-2025-landscape-report" },
    ],
  },
  "1 Hour": {
    Builder: [
      { title: "Read the open issues list and pick one to scope", why: "An issue you have examined is one someone can build.", href: "https://github.com/mfrashad/aiforgood/issues" },
      { title: "Review a PR or leave feedback on a community project", why: "Good feedback halves the time it takes to ship.", href: "https://github.com/mfrashad/aiforgood" },
      { title: "Scope a project idea for an NGO you already know", why: "The strongest projects start with a real relationship.", href: "mailto:m.fathyrashad@gmail.com" },
    ],
    Advocate: [
      { title: "Write one post about an AI safety concept in plain Bahasa Malaysia or English", why: "If you can explain it to someone outside tech, you have done something useful.", href: "#" },
      { title: "Record a 60-second video explaining one AI for Good project", why: "Short-form content about real projects is rare. Yours will stand out.", href: "#" },
      { title: "Translate existing AI safety content for a SEA audience", why: "Translation is not copying. It is giving access.", href: "#" },
    ],
    Organizer: [
      { title: "Post about AI for Good in one Slack or Discord community you are in", why: "Most builders are in the right rooms. They have not heard of us yet.", href: "https://github.com/mfrashad/aiforgood" },
      { title: "DM three engineers who might want to build for good", why: "Personal invitations convert at ten times the rate of public posts.", href: "/volunteer" },
      { title: "Draft a short event proposal for a local AI meetup", why: "One written proposal is all it takes to start a session.", href: "mailto:m.fathyrashad@gmail.com" },
    ],
    Researcher: [
      { title: "Pull one dataset and find one unexpected thing in it", why: "Unexpected findings are what make data useful to journalists and policymakers.", href: "https://aiadoption-gray.vercel.app" },
      { title: "Read the Stanford HAI AI Index and note three things relevant to Southeast Asia", why: "The Index is comprehensive. The SEA read is the gap we are filling.", href: "https://hai.stanford.edu/ai-index" },
      { title: "Write a two-paragraph summary of the AI adoption gap with a citation", why: "A citable summary is infrastructure. Others will build on it.", href: "#" },
    ],
  },
  "A Few Hours": {
    Builder: [
      { title: "Pair with an NGO and scope a real problem they have", why: "Scoping is the work. A well-scoped problem builds itself.", href: "mailto:m.fathyrashad@gmail.com" },
      { title: "Build a rough prototype for an open issue", why: "A prototype that fails teaches more than a spec that is never tested.", href: "https://github.com/mfrashad/aiforgood/issues" },
      { title: "Write documentation for an existing community project", why: "Undocumented tools do not get used. Documentation is the second ship.", href: "https://github.com/mfrashad/aiforgood" },
    ],
    Advocate: [
      { title: "Write a full blog post on one AI issue affecting Southeast Asia, backed by data", why: "A single well-sourced piece becomes the reference others link to for years.", href: "#" },
      { title: "Produce a three-part short-form video series on AI for social good", why: "Three connected videos reach the algorithm in ways a single one cannot.", href: "#" },
      { title: "Design one shareable infographic with real statistics", why: "Data that fits in a screenshot gets shared. Data in a PDF does not.", href: "#" },
    ],
    Organizer: [
      { title: "Host a small builder session: three people, two hours, one problem", why: "The format works. It fits a weekday evening.", href: "mailto:m.fathyrashad@gmail.com" },
      { title: "Set up a community call with one NGO to explore collaboration", why: "Most NGO-builder relationships start with a single call.", href: "mailto:m.fathyrashad@gmail.com" },
      { title: "Organize a local AI for Good watch party or discussion", why: "The people who show up are the ones who stay.", href: "mailto:m.fathyrashad@gmail.com" },
    ],
    Researcher: [
      { title: "Audit the digital tools used by one NGO you have access to", why: "An honest audit of one NGO is more useful than a survey of one hundred.", href: "mailto:m.fathyrashad@gmail.com" },
      { title: "Write a short report on AI procurement in one SEA government", why: "No one is tracking this. The first person who does owns the reference.", href: "#" },
      { title: "Collect and clean one dataset that does not exist yet", why: "The most useful datasets are the ones no one wanted to build alone.", href: "mailto:m.fathyrashad@gmail.com" },
    ],
  },
  "Go All In": {
    Builder: [
      { title: "Own a project end-to-end as PIC: scope, build, ship, document", why: "Person In Charge means one person is accountable. That is why things ship.", href: "/volunteer" },
      { title: "Mentor a newer builder through their first contribution", why: "The builder you mentor will outlast the code you write.", href: "/volunteer" },
      { title: "Become a recurring contributor: one commit per week minimum", why: "Consistency is the only metric that matters at this stage.", href: "https://github.com/mfrashad/aiforgood" },
    ],
    Advocate: [
      { title: "Commit to one post per week for three months", why: "Three months is long enough to build an audience. Most people stop at week three.", href: "/volunteer" },
      { title: "Build a small audience around responsible AI in Southeast Asia", why: "An audience you own is infrastructure no algorithm can take away.", href: "/volunteer" },
      { title: "Become the voice of AI for Good in your language community", why: "No one is doing this in most SEA languages. That is the opening.", href: "/volunteer" },
    ],
    Organizer: [
      { title: "Run monthly builder sessions: own the logistics, the NGO pipeline, the follow-up", why: "The organizer is the reason sessions happen at all.", href: "/volunteer" },
      { title: "Be the Discord moderator and community glue", why: "Community without moderation decays. This role keeps it functional.", href: "/volunteer" },
      { title: "Connect AI for Good to two new communities in your city", why: "Each new community brings in builders we would never reach alone.", href: "/volunteer" },
    ],
    Researcher: [
      { title: "Own the AI adoption dataset: expand it, maintain it, publish findings", why: "The dataset is only as useful as the person maintaining it.", href: "/volunteer" },
      { title: "Produce a quarterly report on the AI divide in Southeast Asia", why: "Quarterly cadence means policymakers have something to cite. Annual is too slow.", href: "/volunteer" },
      { title: "Write the research that grant applications cite when they fund us", why: "Credible research is the foundation every community grant application needs.", href: "/volunteer" },
    ],
  },
};

function ActionCard({ action, roleColor }: { action: Action; roleColor: string }) {
  return (
    <div className="card-flat p-5 flex gap-4 items-start">
      <div className="w-1 flex-shrink-0 self-stretch rounded-full" style={{ background: roleColor }} />
      <div className="flex-1">
        <h4
          className="text-base font-semibold text-text-primary mb-1"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {action.title}
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed mb-3">{action.why}</p>
        <a href={action.href} className="text-sm font-medium text-clay hover:text-clay-hover transition-colors">
          Do this →
        </a>
      </div>
    </div>
  );
}

export default function ActPage() {
  const [selectedTime, setSelectedTime] = useState<Time>("5 Minutes");
  const [selectedRole, setSelectedRole] = useState<Role>("Builder");
  const actions = ACTIONS[selectedTime][selectedRole];
  const roleColor = ROLE_COLOR[selectedRole];

  return (
    <main>
      <Navbar />

      <section className="pt-40 pb-12 px-6 border-b-2 border-border">
        <div className="max-w-3xl mx-auto">
          <h1 className="heading-display text-4xl sm:text-5xl text-text-primary mb-5">
            Pick your time. Pick your skill.{" "}
            <span className="text-clay">Here&apos;s exactly what to do.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            Every action on this page connects to a concrete outcome. Five-minute ones compound. Going all in sets the direction of this project.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-3">
              How much time?
            </p>
            <div className="flex flex-wrap gap-2">
              {TIME_KEYS.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-full border-2 border-border text-sm font-semibold transition-all ${
                    selectedTime === time
                      ? "bg-clay text-white shadow-[3px_3px_0_#1a1b1f]"
                      : "bg-surface-raised text-text-secondary hover:bg-bg"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-3">
              You are a
            </p>
            <div className="flex flex-wrap gap-2">
              {ROLE_KEYS.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded-full border-2 border-border text-sm font-semibold transition-all ${
                    selectedRole === role
                      ? "bg-clay text-white shadow-[3px_3px_0_#1a1b1f]"
                      : "bg-surface-raised text-text-secondary hover:bg-bg"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p
            className="text-lg font-medium text-text-primary mb-8 border-l-4 pl-4"
            style={{ borderColor: roleColor }}
          >
            {ESCALATION[selectedTime]}
          </p>

          <div className="space-y-4">
            {actions.map((action, i) => (
              <ActionCard key={i} action={action} roleColor={roleColor} />
            ))}
          </div>

          <div className="mt-14 pt-10 border-t-2 border-border text-center">
            <p className="text-text-secondary mb-4">Ready to commit?</p>
            <a href="/volunteer" className="btn-pill btn-pill-clay px-8 py-3 text-base">
              Join as a Volunteer →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
