export const serviceCategories = [
  { name: "Web Development", desc: "Websites, web apps, portals, and integrations", slug: "web-development", short: "Web", iconName: "globe" },
  { name: "Mobile Apps", desc: "iOS, Android, and cross-platform product builds", slug: "mobile-apps", short: "App", iconName: "smartphone" },
  { name: "Cloud & DevOps", desc: "Cloud architecture, CI/CD, hosting, and automation", slug: "cloud-devops", short: "Ops", iconName: "cloud" },
  { name: "Cybersecurity", desc: "Security reviews, testing, hardening, and compliance", slug: "cybersecurity", short: "Sec", iconName: "shield" },
  { name: "Data & Analytics", desc: "Dashboards, BI, reporting, and data pipelines", slug: "data-analytics", short: "Data", iconName: "barChart3" },
  { name: "IT Support", desc: "Managed services, helpdesk, and device support", slug: "it-support", short: "IT", iconName: "headphones" },
  { name: "AI & ML", desc: "Automation, machine learning, and applied AI systems", slug: "ai-ml", short: "AI", iconName: "brain" },
  { name: "UI/UX Design", desc: "Research, product design, prototypes, and design systems", slug: "ui-ux-design", short: "UX", iconName: "palette" },
  { name: "Consulting", desc: "Technology strategy, audits, architecture, and advisory", slug: "consulting", short: "Pro", iconName: "briefcase" },
  { name: "Networking", desc: "Infrastructure, connectivity, Wi-Fi, and office networks", slug: "networking", short: "Net", iconName: "network" },
  { name: "E-Commerce", desc: "Online stores, marketplaces, payments, and fulfilment", slug: "ecommerce", short: "Shop", iconName: "shoppingCart" },
  { name: "Digital Marketing", desc: "SEO, PPC, analytics, content, and conversion work", slug: "digital-marketing", short: "Ads", iconName: "megaphone" },
] as const;

export type ServiceCategory = (typeof serviceCategories)[number];

export function findServiceCategory(slug: string) {
  return serviceCategories.find((category) => category.slug === slug);
}
