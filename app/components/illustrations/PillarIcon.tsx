type PillarVariant = "build" | "teach" | "advocate" | "convene";

interface PillarIconProps {
  variant: PillarVariant;
  accent: string;
}

function BuildIcon({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" role="img" aria-label="Build icon — workbench">
      {/* Workbench top */}
      <polygon points="40,20 64,32 40,44 16,32" fill={accent} opacity="0.4" />
      <polygon points="64,32 64,38 40,50 40,44" fill={accent} opacity="0.25" />
      <polygon points="16,32 40,44 40,50 16,38" fill={accent} opacity="0.3" />
      {/* Block being built on top */}
      <polygon points="38,8 46,12 46,20 38,16" fill={accent} opacity="0.9" />
      <polygon points="46,12 52,8 52,16 46,20" fill={accent} opacity="0.65" />
      <polygon points="38,16 46,20 46,24 38,20" fill={accent} opacity="0.5" />
      {/* Small block */}
      <polygon points="28,14 34,18 34,24 28,20" fill={accent} opacity="0.7" />
      <polygon points="34,18 38,14 38,20 34,24" fill={accent} opacity="0.5" />
    </svg>
  );
}

function TeachIcon({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" role="img" aria-label="Teach icon — chalkboard">
      {/* Board */}
      <polygon points="20,15 56,25 56,50 20,40" fill={accent} opacity="0.4" />
      <polygon points="56,25 62,20 62,45 56,50" fill={accent} opacity="0.25" />
      {/* Writing on board */}
      <rect x="25" y="22" width="20" height="3" rx="1" fill="white" opacity="0.5" />
      <rect x="25" y="28" width="14" height="3" rx="1" fill="white" opacity="0.35" />
      {/* Stand */}
      <polygon points="32,50 38,53 38,60 32,57" fill={accent} opacity="0.3" />
      <polygon points="42,50 38,53 38,60 42,57" fill={accent} opacity="0.2" />
    </svg>
  );
}

function AdvocateIcon({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" role="img" aria-label="Advocate icon — platform">
      {/* Platform */}
      <polygon points="40,50 64,62 40,74 16,62" fill={accent} opacity="0.3" />
      <polygon points="64,62 64,68 40,80 40,74" fill={accent} opacity="0.18" />
      <polygon points="16,62 40,74 40,80 16,68" fill={accent} opacity="0.22" />
      {/* Figure */}
      <polygon points="36,32 40,34 40,50 36,48" fill={accent} opacity="0.7" />
      <polygon points="40,34 44,32 44,48 40,50" fill={accent} opacity="0.55" />
      {/* Head */}
      <polygon points="36,24 40,26 40,32 36,30" fill={accent} opacity="0.9" />
      <polygon points="40,26 44,24 44,30 40,32" fill={accent} opacity="0.75" />
      {/* Raised block */}
      <polygon points="40,10 46,13 46,22 40,19" fill={accent} opacity="0.85" />
      <polygon points="46,13 50,10 50,19 46,22" fill={accent} opacity="0.6" />
    </svg>
  );
}

function ConveneIcon({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" role="img" aria-label="Convene icon — round table">
      {/* Central table block */}
      <polygon points="40,32 52,38 40,44 28,38" fill={accent} opacity="0.5" />
      <polygon points="52,38 52,44 40,50 40,44" fill={accent} opacity="0.3" />
      <polygon points="28,38 40,44 40,50 28,44" fill={accent} opacity="0.35" />
      {/* Figure left */}
      <polygon points="14,30 18,32 18,42 14,40" fill={accent} opacity="0.65" />
      <polygon points="18,32 22,30 22,40 18,42" fill={accent} opacity="0.5" />
      <polygon points="14,24 18,26 18,30 14,28" fill={accent} opacity="0.8" />
      {/* Figure right */}
      <polygon points="56,30 60,32 60,42 56,40" fill={accent} opacity="0.65" />
      <polygon points="60,32 64,30 64,40 60,42" fill={accent} opacity="0.5" />
      <polygon points="56,24 60,26 60,30 56,28" fill={accent} opacity="0.8" />
      {/* Block on table */}
      <polygon points="38,22 42,24 42,32 38,30" fill={accent} opacity="0.9" />
      <polygon points="42,24 46,22 46,30 42,32" fill={accent} opacity="0.7" />
    </svg>
  );
}

export default function PillarIcon({ variant, accent }: PillarIconProps) {
  switch (variant) {
    case "build":    return <BuildIcon accent={accent} />;
    case "teach":    return <TeachIcon accent={accent} />;
    case "advocate": return <AdvocateIcon accent={accent} />;
    case "convene":  return <ConveneIcon accent={accent} />;
  }
}
