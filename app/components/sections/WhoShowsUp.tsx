import PersonaTile from "@/app/components/ui/PersonaTile";
import TerminalIcon from "@/components/ui/icons/terminal-icon";
import HandHeartIcon from "@/components/ui/icons/hand-heart-icon";
import PenIcon from "@/components/ui/icons/pen-icon";
import SparklesIcon from "@/components/ui/icons/sparkles-icon";

const PERSONAS = [
  {
    Icon: TerminalIcon,
    title: "Coders building for good.",
    description:
      "Devs, designers, students, self-taught hackers using their skills for something larger than a series A.",
    accent: "#000",
    bg: "#fff200",
  },
  {
    Icon: HandHeartIcon,
    title: "NGO workers and changemakers.",
    description:
      "Social workers, teachers, organizers, NGO staff. The people who know the problems and now, finally, can build the solutions.",
    accent: "#000",
    bg: "#94e8ff",
  },
  {
    Icon: PenIcon,
    title: "Community builders and content creators.",
    description:
      "Content creators, event hosts, writers, translators, illustrators. The work that turns scattered projects into a culture.",
    accent: "#000",
    bg: "#ffc0a1",
  },
  {
    Icon: SparklesIcon,
    title: "Curious newcomers.",
    description:
      "You don't have to code. You don't have to know what a Git branch is. You don't have to have ever called yourself technical. You need a problem worth solving and a few hours a week.",
    accent: "#000",
    bg: "#6ff5b6",
  },
];

export default function WhoShowsUp() {
  return (
    <section
      className="band band-white grid-bg section-padding px-6"
      aria-labelledby="who-heading"
    >
      <div className="max-w-5xl mx-auto">
        <h2 id="who-heading" className="heading-section mb-12 lg:mb-16">
          Who is this for.
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {PERSONAS.map((p) => (
            <PersonaTile key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
