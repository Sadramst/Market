import {
  Hand,
  Scissors,
  Eye,
  Feather,
  Droplet,
  Brush,
  Flower2,
  Waves,
  Sparkles,
  Syringe,
  Leaf,
  type LucideProps,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<LucideProps>> = {
  nails: Hand,
  hair: Scissors,
  lashes: Eye,
  brows: Feather,
  "skin-care": Droplet,
  "skin care": Droplet,
  makeup: Brush,
  body: Flower2,
  massage: Waves,
  cosmetic: Syringe,
  wellness: Leaf,
};

interface CategoryIconProps extends LucideProps {
  category: string;
}

export function CategoryIcon({ category, ...props }: CategoryIconProps) {
  const slug = category.toLowerCase().replace(/\s+/g, "-");
  const Icon = CATEGORY_ICONS[slug] || CATEGORY_ICONS[category.toLowerCase()] || Sparkles;
  return <Icon {...props} />;
}

export function getCategoryIconComponent(category: string): React.ComponentType<LucideProps> {
  const slug = category.toLowerCase().replace(/\s+/g, "-");
  return CATEGORY_ICONS[slug] || CATEGORY_ICONS[category.toLowerCase()] || Sparkles;
}
