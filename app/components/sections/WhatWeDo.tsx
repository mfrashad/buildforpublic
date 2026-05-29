import PillarItem from "@/app/components/ui/PillarItem";
import UsersIcon from "@/components/ui/icons/users-icon";
import CodeIcon from "@/components/ui/icons/code-icon";
import RocketIcon from "@/components/ui/icons/rocket-icon";
import BookIcon from "@/components/ui/icons/book-icon";

const PILLARS = [
  {
    Icon: UsersIcon,
    title: "Meetup",
    description:
      "A few hours every week where we sit down, discuss problems, team up, and actually ship impactful open source projects solving local problems for the public.",
    bg: "#fff200",
  },
  {
    Icon: CodeIcon,
    title: "Build",
    description:
      "We team up and partner with NGOs to properly maintain and develop projects that are actually useful to the communities they serve.",
    bg: "#ffc0a1",
  },
  {
    Icon: RocketIcon,
    title: "Share",
    description:
      "We post about the work, share what we're building, and try to make sure good projects don't just disappear into GitHub. Too many do.",
    bg: "#94e8ff",
  },
  {
    Icon: BookIcon,
    title: "Teach",
    description:
      "We help fellow members and non-technical changemakers build, advocate for open and public tech, and create awareness content on the risks and potential of AI.",
    bg: "#6ff5b6",
  },
];

export default function WhatWeDo() {
  return (
    <section
      className="band band-white section-padding px-6"
      aria-labelledby="what-heading"
    >
      <div className="max-w-5xl mx-auto">
        <h2 id="what-heading" className="heading-section mb-12 lg:mb-16">
          What we do.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p) => (
            <PillarItem key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
