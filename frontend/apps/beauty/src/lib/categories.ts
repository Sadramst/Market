export const BEAUTY_CATEGORIES = [
  { slug: "nails", name: "Nails", icon: "💅", description: "Manicures, pedicures, gel nails, nail art and extensions", displayName: "Nail Salons" },
  { slug: "hair", name: "Hair", icon: "💇‍♀️", description: "Cuts, colour, balayage, highlights, blowouts and styling", displayName: "Hair Salons & Stylists" },
  { slug: "lashes", name: "Lashes", icon: "👁️", description: "Lash extensions, lifts, tints and lash treatments", displayName: "Lash Technicians & Studios" },
  { slug: "brows", name: "Brows", icon: "✨", description: "Threading, tinting, lamination, microblading and henna", displayName: "Brow Artists & Studios" },
  { slug: "skin-care", name: "Skin Care", icon: "🧴", description: "Facials, peels, microdermabrasion and skin treatments", displayName: "Skin Care Clinics" },
  { slug: "makeup", name: "Makeup", icon: "💄", description: "Bridal, occasion, everyday and special event makeup", displayName: "Makeup Artists" },
  { slug: "body", name: "Body", icon: "🌸", description: "Massage, waxing, spray tan, body wraps and tanning", displayName: "Body & Massage Therapists" },
  { slug: "cosmetic", name: "Cosmetic", icon: "💉", description: "Injectables, fillers, anti-wrinkle and cosmetic aesthetics", displayName: "Cosmetic Clinics" },
  { slug: "wellness", name: "Wellness", icon: "🧘", description: "Holistic health, spa, meditation and wellness therapies", displayName: "Wellness & Spa" },
] as const;

export type BeautyCategory = (typeof BEAUTY_CATEGORIES)[number];

export function findCategory(slug: string): BeautyCategory | undefined {
  return BEAUTY_CATEGORIES.find((c) => c.slug === slug);
}
