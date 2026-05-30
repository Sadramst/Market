import {
  Globe,
  Smartphone,
  Cloud,
  Shield,
  BarChart3,
  Headphones,
  Brain,
  Palette,
  Briefcase,
  Network,
  ShoppingCart,
  Megaphone,
  type LucideProps,
} from "lucide-react";

const SERVICE_ICONS: Record<string, React.ComponentType<LucideProps>> = {
  globe: Globe,
  smartphone: Smartphone,
  cloud: Cloud,
  shield: Shield,
  barChart3: BarChart3,
  headphones: Headphones,
  brain: Brain,
  palette: Palette,
  briefcase: Briefcase,
  network: Network,
  shoppingCart: ShoppingCart,
  megaphone: Megaphone,
};

interface ServiceCategoryIconProps extends LucideProps {
  iconName: string;
}

export function ServiceCategoryIcon({ iconName, ...props }: ServiceCategoryIconProps) {
  const Icon = SERVICE_ICONS[iconName] || Globe;
  return <Icon {...props} />;
}
