import Image from "next/image";
import {
  FEATURED_PROJECTS,
  COMMUNITY_PROJECTS,
  HELPED_NGOS,
  SITE,
} from "@/lib/constants";

const PROJECT_SCREENSHOTS: Record<string, string> = {
  MyMP: "/sprites/projects/mymp.png",
  "Sedekah.je": "/sprites/projects/sedekah.png",
  "Lepak Masjid": "/sprites/projects/lepakmasjid.png",
  "Pasar Malam": "/sprites/projects/pasarmalam.png",
};

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-padding">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-medium text-olive bg-olive/15 px-3 py-1 rounded-full inline-block mb-4">
            ACTIVE
          </span>
          <h2 className="heading-section text-black mb-3">
            Projects
          </h2>
          <p className="text-lg text-black/60">
            Open-source tools for social impact
          </p>
        </div>

        {/* Featured projects */}
        {FEATURED_PROJECTS.map((project) => (
          <div key={project.title} className="card-flat overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-1/2 p-8">
                <span className="text-xs font-medium text-olive bg-olive/15 px-3 py-1 rounded-full inline-block mb-4">
                  FEATURED
                </span>
                <h3
                  className="text-2xl text-black mb-3"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  {project.title}
                </h3>
                <p className="text-[15px] text-black/60 leading-relaxed mb-5">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white text-black/60 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill btn-pill-filled text-sm py-2 px-5"
                  >
                    Live Demo &rarr;
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill btn-pill-outline text-sm py-2 px-5"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 relative min-h-[240px]">
                <Image
                  src={project.imageUrl}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        ))}

        {/* NGOs We Helped */}
        {HELPED_NGOS.map((ngo) => (
          <div
            key={ngo.name}
            className="card-flat overflow-hidden border border-olive/20 mb-8"
          >
            <div className="md:flex">
              <div className="md:w-1/2 p-6">
                <span className="text-xs font-medium text-olive bg-olive/15 px-3 py-1 rounded-full inline-block mb-3">
                  {ngo.badge}
                </span>
                <h3
                  className="text-xl text-black mb-2"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  {ngo.name}
                </h3>
                <p className="text-[15px] text-black/60 leading-relaxed mb-4">
                  {ngo.description}
                </p>
                <a
                  href={ngo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-clay hover:underline transition-colors"
                >
                  Visit Website &rarr;
                </a>
              </div>
              <div className="md:w-1/2 relative min-h-[200px]">
                <Image
                  src="/sprites/projects/pocketofpink.png"
                  alt={`${ngo.name} website screenshot`}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Community Projects */}
        <div className="mb-8">
          <h3
            className="text-lg text-black/60 mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Local Open Source Projects
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {COMMUNITY_PROJECTS.map((project) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card overflow-hidden group"
              >
                <div className="relative w-full aspect-[16/10] bg-surface">
                  <Image
                    src={PROJECT_SCREENSHOTS[project.name]}
                    alt={`${project.name} screenshot`}
                    fill
                    className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h4
                    className="text-base text-black group-hover:text-black transition-colors mb-1"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                  >
                    {project.name}
                  </h4>
                  <p className="text-sm text-black/60 leading-relaxed mb-2">
                    {project.description}
                  </p>
                  <span className="text-xs text-black/50">
                    {project.url.replace("https://", "")} &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs text-black/50 mt-4 italic">
            Non-affiliated local projects building for social good
          </p>
        </div>

        {/* Submit / Shared Resources */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card-flat border border-black border-dashed p-8 text-center">
            <div className="text-3xl text-black/50 mb-3">+</div>
            <h4
              className="text-base text-black mb-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Your Project Here
            </h4>
            <p className="text-sm text-black/60 mb-4">
              Have an open-source AI project for social good? We want to feature
              it.
            </p>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-clay hover:underline transition-colors"
            >
              Submit a Project &rarr;
            </a>
          </div>

          <div className="card-flat border border-black border-dashed p-8 text-center">
            <div className="text-3xl text-black/50 mb-3">+</div>
            <h4
              className="text-base text-black mb-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Shared Resources
            </h4>
            <p className="text-sm text-black/60 mb-4">
              Reusable datasets, APIs, and templates from community projects.
              Coming soon.
            </p>
            <span className="text-sm text-black/50">In Progress</span>
          </div>
        </div>
      </div>
    </section>
  );
}
