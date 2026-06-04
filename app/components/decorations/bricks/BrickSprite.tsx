// Shared isometric brick sprite primitive.
// All MRMO tiles are 128 × 144 pixels; the rendered size scales proportionally.
// Follows the same parametric signature as Stars.tsx.

export type BrickColor = "yellow" | "blue" | "green" | "red" | "cobalt" | "purple";
export type BrickType  = "cube" | "plate" | "slope";

/** 144/128 — native sprite aspect ratio */
export const BRICK_RATIO = 144 / 128;

interface BrickSpriteProps {
  type: BrickType;
  color: BrickColor;
  /** Rendered pixel width. Height is derived from the 128:144 ratio. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function BrickSprite({
  type,
  color,
  size = 80,
  className,
  style,
}: BrickSpriteProps) {
  const h = Math.round(size * BRICK_RATIO);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/bricks/${color}-${type}.png`}
      width={size}
      height={h}
      alt=""
      draggable={false}
      className={className}
      style={{ display: "block", userSelect: "none", ...style }}
    />
  );
}
