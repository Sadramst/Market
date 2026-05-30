import {
  Paintbrush,
  Scissors,
  Eye,
  Sparkles,
  Droplets,
  Palette,
  Flower2,
  Heart,
  Syringe,
  Leaf,
  type LucideProps,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<LucideProps>> = {
  nails: Paintbrush,
  hair: Scissors,
  lashes: Eye,
  brows: Sparkles,
  "skin-care": Droplets,
  "skin care": Droplets,
  makeup: Palette,
  body: Flower2,
  massage: Heart,
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
