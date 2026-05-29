type PersonaVariant = "coder" | "ngo" | "movement" | "curious";

interface PersonaBlockProps {
  variant: PersonaVariant;
  accent: string;
}

function PersonaCoder({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 100" width="120" height="100" role="img" aria-label="Coder at workbench">
      {/* Platform */}
      <polygon points="60,45 100,65 60,85 20,65" fill={accent} opacity="0.3" />
      <polygon points="100,65 100,72 60,92 60,85" fill={accent} opacity="0.15" />
      <polygon points="20,65 60,85 60,92 20,72" fill={accent} opacity="0.2" />
      {/* Desk */}
      <polygon points="40,38 80,52 80,56 40,42" fill={accent} opacity="0.5" />
      <polygon points="80,52 90,46 90,50 80,56" fill={accent} opacity="0.3" />
      <polygon points="30,44 40,38 40,42 30,48" fill={accent} opacity="0.4" />
      {/* Screen block */}
      <polygon points="68,28 76,32 72,40 64,36" fill="white" opacity="0.9" />
      <polygon points="76,32 80,34 76,42 72,40" fill={accent} opacity="0.4" />
      {/* Figure head */}
      <polygon points="50,22 56,25 54,29 48,26" fill={accent} opacity="0.8" />
      {/* Figure body */}
      <polygon points="48,26 54,29 54,38 48,35" fill={accent} opacity="0.6" />
      <polygon points="54,29 58,31 58,40 54,38" fill={accent} opacity="0.45" />
    </svg>
  );
}

function PersonaNGO({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 100" width="120" height="100" role="img" aria-label="NGO builder on platform">
      {/* Plinth */}
      <polygon points="50,55 80,68 50,82 20,68" fill={accent} opacity="0.25" />
      <polygon points="80,68 80,76 50,90 50,82" fill={accent} opacity="0.15" />
      <polygon points="20,68 50,82 50,90 20,76" fill={accent} opacity="0.2" />
      {/* Figure body */}
      <polygon points="44,30 50,33 50,50 44,47" fill={accent} opacity="0.6" />
      <polygon points="50,33 56,30 56,47 50,50" fill={accent} opacity="0.45" />
      {/* Head */}
      <polygon points="44,22 50,25 50,30 44,27" fill={accent} opacity="0.85" />
      <polygon points="50,25 56,22 56,27 50,30" fill={accent} opacity="0.7" />
      {/* Clipboard */}
      <polygon points="56,33 64,29 64,42 56,46" fill="white" opacity="0.9" />
      <polygon points="64,29 68,31 68,44 64,42" fill={accent} opacity="0.3" />
    </svg>
  );
}

function PersonaMovement({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 100" width="120" height="100" role="img" aria-label="Movement maker with megaphone">
      {/* Ground */}
      <polygon points="60,60 90,72 60,84 30,72" fill={accent} opacity="0.15" />
      {/* Figure body */}
      <polygon points="50,30 56,33 56,52 50,49" fill={accent} opacity="0.6" />
      <polygon points="56,33 62,30 62,49 56,52" fill={accent} opacity="0.45" />
      {/* Head */}
      <polygon points="50,22 56,25 56,30 50,27" fill={accent} opacity="0.85" />
      <polygon points="56,25 62,22 62,27 56,30" fill={accent} opacity="0.7" />
      {/* Megaphone */}
      <polygon points="62,28 72,22 72,32 62,38" fill={accent} opacity="0.5" />
      <polygon points="72,22 78,24 78,34 72,32" fill={accent} opacity="0.35" />
      {/* Sound waves */}
      <rect x="78" y="24" width="6" height="2" rx="1" fill={accent} opacity="0.3" />
      <rect x="80" y="20" width="4" height="2" rx="1" fill={accent} opacity="0.2" />
    </svg>
  );
}

function PersonaCurious({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 100" width="120" height="100" role="img" aria-label="Curious newcomer with question mark">
      {/* Ground */}
      <polygon points="60,65 90,77 60,89 30,77" fill={accent} opacity="0.15" />
      {/* Figure body */}
      <polygon points="50,38 56,41 56,58 50,55" fill={accent} opacity="0.6" />
      <polygon points="56,41 62,38 62,55 56,58" fill={accent} opacity="0.45" />
      {/* Head */}
      <polygon points="50,30 56,33 56,38 50,35" fill={accent} opacity="0.85" />
      <polygon points="56,33 62,30 62,35 56,38" fill={accent} opacity="0.7" />
      {/* Question mark block floating above */}
      <polygon points="66,18 74,14 74,26 66,30" fill="white" opacity="0.95" />
      <polygon points="74,14 80,16 80,28 74,26" fill={accent} opacity="0.3" />
      <polygon points="66,26 74,22 74,26 66,30" fill={accent} opacity="0.1" />
      <text x="70" y="25" fontSize="8" fill={accent} textAnchor="middle" fontWeight="bold" opacity="0.8">?</text>
    </svg>
  );
}

export default function PersonaBlock({ variant, accent }: PersonaBlockProps) {
  switch (variant) {
    case "coder":    return <PersonaCoder accent={accent} />;
    case "ngo":      return <PersonaNGO accent={accent} />;
    case "movement": return <PersonaMovement accent={accent} />;
    case "curious":  return <PersonaCurious accent={accent} />;
  }
}
