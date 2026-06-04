import HoverTooltip from "@/app/components/HoverTooltip";

const CONTENT =
  "We encourage AGPL v3 over MIT for public-interest projects. AGPL ensures anything built on top stays open too — so corporations can't take your work, close it, and sell it back. MIT allows that. AGPL doesn't.\n\nThat said, exceptions exist. NGOs that need to keep code private for operational or safety reasons are absolutely fine — the goal is public benefit, not ideological purity.";

export default function OpenTooltip() {
  return (
    <HoverTooltip
      content={
        <>
          We encourage AGPL v3 over MIT for public-interest projects. AGPL ensures anything built
          on top stays open too — so corporations can&apos;t take your work, close it, and sell it
          back. MIT allows that. AGPL doesn&apos;t.
          <br />
          <br />
          That said, exceptions exist. NGOs that need to keep code private for operational or
          safety reasons are absolutely fine — the goal is public benefit, not ideological purity.
        </>
      }
      triggerClassName="underline underline-offset-2 decoration-black/30 cursor-help"
      width="w-80"
    >
      open
    </HoverTooltip>
  );
}
