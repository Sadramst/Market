import type { CSSProperties } from "react";

// Phase 18 emoji icon set — feminine, premium, legible at small sizes.
const CATEGORY_EMOJI: Record<string, string> = {
  nails: "💅",
  hair: "✂️",
  lashes: "👁️",
  brows: "🌙",
  "skin-care": "🌸",
  "skin care": "🌸",
  makeup: "💄",
  body: "🛁",
  massage: "💆",
  cosmetic: "⭐",
  wellness: "🌿",
};

const FALLBACK_EMOJI = "✨";

interface CategoryIconProps {
  category: string;
  className?: string;
  style?: CSSProperties;
  // Accepted for backwards-compatibility with the previous SVG icon; ignored for emoji.
  strokeWidth?: number;
}

// Derive a font-size (px) from a Tailwind `w-N` token so the emoji visually
// matches the size the old SVG icon rendered at (Tailwind scale: 1 unit = 4px).
function fontSizeFromClassName(className?: string): number {
  if (!className) return 24;
  const match = className.match(/w-(\d+(?:\.\d+)?)/);
  if (!match) return 24;
  return parseFloat(match[1]) * 4;
}

export function getCategoryEmoji(category: string): string {
  const slug = category.toLowerCase().replace(/\s+/g, "-");
  return CATEGORY_EMOJI[slug] || CATEGORY_EMOJI[category.toLowerCase()] || FALLBACK_EMOJI;
}

export function CategoryIcon({ category, className, style }: CategoryIconProps) {
  const emoji = getCategoryEmoji(category);
  const fontSize = fontSizeFromClassName(className);
  return (
    <span
      role="img"
      aria-label={`${category} icon`}
      className={className}
      style={{
        fontSize,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {emoji}
    </span>
  );
}
