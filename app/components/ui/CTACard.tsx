interface CTACardProps {
  question: string;
  body: string;
  cta: string;
  href: string;
  bg: string;
}

export default function CTACard({ question, body, cta, href, bg }: CTACardProps) {
  return (
    <div className="card flex flex-col gap-4 p-7" style={{ background: bg }}>
      <h3 className="heading-display text-xl">{question}</h3>
      <p className="text-sm leading-relaxed flex-1 text-gray-700" style={{ fontFamily: "var(--font-sans)" }}>
        {body}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary self-start"
        style={{ fontSize: "0.875rem", padding: "10px 20px" }}
      >
        {cta} →
      </a>
    </div>
  );
}
