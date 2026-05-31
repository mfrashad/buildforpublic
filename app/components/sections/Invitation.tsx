import CTACard from "@/app/components/ui/CTACard";
import BrickPhysics, { BrickDef } from "@/app/components/decorations/bricks/BrickPhysics";

// Bricks that rain down behind the "Come in." CTA band
const FALLING_BRICKS: BrickDef[] = [
  { type: "cube",  color: "blue",   size: 70, xPct:  5,  visualTilt: -12 },
  { type: "slope", color: "yellow", size: 58, xPct: 15,  visualTilt:  20 },
  { type: "cube",  color: "green",  size: 82, xPct: 28,  visualTilt:  -8 },
  { type: "plate", color: "red",    size: 65, xPct: 40,  visualTilt:  15 },
  { type: "cube",  color: "cobalt", size: 75, xPct: 55,  visualTilt: -18 },
  { type: "slope", color: "purple", size: 60, xPct: 67,  visualTilt:  10 },
  { type: "cube",  color: "yellow", size: 68, xPct: 78,  visualTilt:  22 },
  { type: "plate", color: "blue",   size: 55, xPct: 88,  visualTilt:  -5 },
  { type: "cube",  color: "red",    size: 78, xPct: 95,  visualTilt: -15 },
  { type: "slope", color: "green",  size: 62, xPct: 48,  visualTilt:  18 },
  { type: "cube",  color: "purple", size: 72, xPct: 22,  visualTilt:  -8 },
  { type: "plate", color: "cobalt", size: 58, xPct: 72,  visualTilt:  12 },
];

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
    <section className="band band-yellow section-padding px-6 relative overflow-hidden" aria-labelledby="invitation-heading">
      {/* Falling bricks that pile on an invisible floor at the section bottom */}
      <BrickPhysics
        bricks={FALLING_BRICKS}
        gravity={0.8}
        drag
        respawn
        className="absolute inset-0 z-0"
      />
      <div className="max-w-5xl mx-auto relative z-10">
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

