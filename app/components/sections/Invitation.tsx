import CTACard from "@/app/components/ui/CTACard";

const CTAS = [
  {
    question: "Want to build?",
    body: "We have problems worth shipping for.",
    cta: "Join the next session",
    href: "https://join.slack.com/t/buildforpublic/shared_invite/TODO",
    bg: "#fff200",
  },
  {
    question: "Have a problem to solve?",
    body: "Tell us what tool your community needs.",
    cta: "Pitch a project",
    href: "https://join.slack.com/t/buildforpublic/shared_invite/TODO",
    bg: "#94e8ff",
  },
  {
    question: "Just curious?",
    body: "Show up, learn, see what catches you.",
    cta: "Join the Slack",
    href: "https://join.slack.com/t/buildforpublic/shared_invite/TODO",
    bg: "#6ff5b6",
  },
];

export default function Invitation() {
  return (
    <section className="band band-yellow section-padding px-6" aria-labelledby="invitation-heading">
      <div className="max-w-5xl mx-auto">
        <h2 id="invitation-heading" className="heading-section mb-12 lg:mb-16">
          Come in.
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {CTAS.map((c) => (
            <CTACard key={c.question} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
