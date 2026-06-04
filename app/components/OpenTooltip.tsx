export default function OpenTooltip() {
  return (
    <span className="group relative inline">
      <span className="underline underline-offset-2 decoration-black/30 cursor-help">
        open
      </span>
      <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-80 bg-black text-white text-xs leading-relaxed px-3 py-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        We encourage AGPL v3 over MIT for public-interest projects. AGPL ensures anything built on top stays open too — so corporations can&apos;t take your work, close it, and sell it back. MIT allows that. AGPL doesn&apos;t.
        <br /><br />
        That said, exceptions exist. NGOs that need to keep code private for operational or safety reasons are absolutely fine — the goal is public benefit, not ideological purity.
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
      </span>
    </span>
  );
}
