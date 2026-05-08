import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ — Build for Public",
  description:
    "Questions we hear a lot about Build for Public: what we have shipped, who we are for, how volunteer time works, and why this exists.",
};

const FAQS = [
  {
    q: "Is this just another tech nonprofit doing AI ethics theater?",
    steel: "The AI ethics space is full of organizations that publish papers, host panels, and change nothing.",
    a: "We measure output in shipped code and NGOs served. Pocket of Pink got a working website in a single day at zero cost to them. The AI Adoption by Country API tracks 16 countries and is used by researchers for free. 20+ builders have contributed real work. White papers are not what we produce.",
  },
  {
    q: "Why Malaysia? Why Southeast Asia?",
    a: "The people building this live here. The AI divide is sharpest here: rural Southeast Asia averages 55% internet penetration versus 90% in cities. Malay, Bahasa Indonesia, and Tamil are statistical noise in AI training data. No one else is building public-interest AI infrastructure in this region at the community level. The counterfactual is not that someone else will. The counterfactual is that no one will.",
  },
  {
    q: "Why volunteer time instead of just donating money?",
    a: "A skilled engineer volunteering a weekend produces something money cannot buy: a tool built for that specific context, scoped by someone who talked to the team. Most NGOs cannot hire a developer. They can work with a volunteer community that shows up. Showing up is the scarce thing.",
  },
  {
    q: "Does open-source AI actually reach the NGOs that need it?",
    a: "Only if someone builds the bridge. Shipping code to GitHub is not enough. We scope directly with NGOs, co-design the build with their staff, and hand over documentation they can maintain. Pocket of Pink is the proof of concept. It required a human relationship, not just a repository.",
  },
  {
    q: "How is this different from Big Tech's own Build for Public programs?",
    steel: "Google.org and Microsoft Philanthropies spend hundreds of millions on AI for social good.",
    a: "They build for problems their existing tools can already solve. They do not build for the specific, unglamorous bottlenecks of a Malaysian food bank or a Philippine refugee legal aid clinic. Those problems have no product-market fit. We build what the market will not.",
  },
  {
    q: "What has Build for Public actually shipped?",
    a: "Pocket of Pink: a youth education nonprofit's website, shipped in one day. The AI Adoption by Country API: 16 countries, open JSON, used by researchers. 5M+ views of AI literacy content in English and Bahasa Malaysia. 20+ active community builders. Two NGO partnerships active or in scoping. See more at the projects section or contact us directly.",
    links: [{ label: "Browse projects", href: "/#projects" }, { label: "Contact", href: "mailto:m.fathyrashad@gmail.com" }],
  },
  {
    q: "Who funds this?",
    a: "Currently self-funded by the founder and running on volunteer time. No institutional funding yet. We are transparent about that. We are looking for funders who believe AI's benefits should not concentrate in five zip codes. If that is you, read the funders page.",
    links: [{ label: "Funders page", href: "/funders" }],
  },
  {
    q: "Will my volunteer hours make any difference?",
    steel: "Most volunteer programs are not worth your time.",
    a: "It depends on how you use them. If you show up and own something — an issue, a project, a session — yes. If you sign up and wait to be assigned a task, probably not. We look for people who pick something up and run with it. The /act page has concrete starting points for every time budget.",
    links: [{ label: "See what to do", href: "/act" }],
  },
  {
    q: "Why should I trust that this community will still exist in two years?",
    a: "The community already exists and has shipped things. The risk is not that it disappears. It is that it stays small. The people building it are not going anywhere. The trajectory depends on how many skilled volunteers join and stay committed. The roadmap page is honest about what different levels of support make possible.",
    links: [{ label: "Read the roadmap", href: "/roadmap" }],
  },
];

export default function FaqPage() {
  return (
    <main>
      <Navbar />

      <section className="pt-40 pb-16 px-6 border-b-2 border-black">
        <div className="max-w-3xl mx-auto">
          <h1 className="heading-display text-4xl sm:text-5xl text-black mb-6">
            Questions we hear a lot.
          </h1>
          <p className="text-lg text-black/60 leading-relaxed">
            Honest answers. No softening.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto space-y-5">
          {FAQS.map((faq, i) => (
            <div key={i} className="card-flat p-6 sm:p-8">
              {faq.steel && (
                <p className="text-xs font-semibold text-black/50 uppercase tracking-widest mb-3">
                  The objection
                </p>
              )}
              {faq.steel && (
                <p className="text-sm text-black/60 italic mb-5 border-l-2 border-black/20 pl-4">
                  {faq.steel}
                </p>
              )}
              <h3
                className="text-lg font-semibold text-black mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {faq.q}
              </h3>
              <p className="text-sm text-black/60 leading-relaxed mb-4">{faq.a}</p>
              {faq.links && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {faq.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium text-clay hover:underline transition-colors"
                    >
                      {link.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Graduated engagement CTA */}
      <section className="section-padding pt-0 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="divider mb-14" />
          <h2 className="heading-section text-black mb-4">Still have questions?</h2>
          <p className="text-lg text-black/60 mb-8 leading-relaxed">
            Email the founder directly. Response within 48 hours.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:m.fathyrashad@gmail.com" className="btn-pill btn-pill-filled px-8 py-3 text-base">
              Email Rashad
            </a>
            <a href="/act" className="btn-pill btn-pill-outline px-8 py-3 text-base">
              See what to do right now →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
