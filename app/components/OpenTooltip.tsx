import HoverTooltip from "@/app/components/HoverTooltip";

export default function OpenTooltip() {
  return (
    <HoverTooltip
      content={
        <>
          We recommend AGPL v3 over MIT to protect community members — especially those who
          don&apos;t know better — from having their work taken, closed off, and sold by companies.
          MIT allows that. AGPL doesn&apos;t.
          <br />
          <br />
          MIT still makes sense for some projects — libraries and tools meant for broad reuse are a
          good example. That&apos;s completely fine. But for most public-interest apps and services,
          AGPL v3 is the right default.
          <br />
          <br />
          NGOs that need to keep code private for operational or safety reasons are also welcome to
          — the goal is public benefit, not ideological purity.
        </>
      }
      triggerClassName="underline underline-offset-2 decoration-black/30 cursor-help"
      width="w-80"
    >
      open
    </HoverTooltip>
  );
}
