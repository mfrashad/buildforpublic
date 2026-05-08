export const VARIANTS = [
  {
    key: "v1",
    voice: "Movement / mission",
    hero: "The systems shaping public life are being built privately.",
    slogan: "A movement of builders shipping open code for the public interest.",
  },
  {
    key: "v2",
    voice: "Alarm / closed-doors",
    hero: "Our public infrastructure is being built behind closed doors.",
    slogan: "The public alternative to private AI.",
  },
  {
    key: "v3",
    voice: "Broad-tech / future",
    hero: "The technology shaping our lives is privately owned.",
    slogan: "A public stack for a public future.",
  },
  {
    key: "v4",
    voice: "AI-sharp wedge",
    hero: "AI is becoming public infrastructure. It's being built privately.",
    slogan: "Open-source AI in service of the public.",
  },
] as const;

export type Variant = (typeof VARIANTS)[number];
