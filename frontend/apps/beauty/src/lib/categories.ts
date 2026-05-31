export const BEAUTY_CATEGORIES = [
  { slug: "nails", name: "Nails", icon: "💅", description: "Manicures, pedicures, gel sets, nail art and extensions", displayName: "Nail Salons & Technicians", gradient: "from-pink-50 to-rose-100", accent: "#E8A8AD" },
  { slug: "hair", name: "Hair", icon: "✂️", description: "Cuts, colour, balayage, highlights, blowouts and bridal styling", displayName: "Hair Salons & Stylists", gradient: "from-amber-50 to-orange-100", accent: "#C9A96E" },
  { slug: "lashes", name: "Lashes", icon: "👁️", description: "Classic, hybrid and volume lash extensions, lifts and tints", displayName: "Lash Technicians & Studios", gradient: "from-purple-50 to-pink-100", accent: "#9B7B84" },
  { slug: "brows", name: "Brows", icon: "🌙", description: "Threading, tinting, lamination, microblading and henna brows", displayName: "Brow Artists & Studios", gradient: "from-rose-50 to-pink-100", accent: "#C8737A" },
  { slug: "skin-care", name: "Skin Care", icon: "🌸", description: "Facials, peels, hydradermabrasion and advanced skin treatments", displayName: "Skin Care Clinics", gradient: "from-green-50 to-teal-100", accent: "#7B9B84" },
  { slug: "makeup", name: "Makeup", icon: "💄", description: "Bridal, occasion, editorial and everyday glam makeup", displayName: "Makeup Artists", gradient: "from-red-50 to-rose-100", accent: "#A35560" },
  { slug: "body", name: "Body", icon: "🛁", description: "Waxing, spray tan, body wraps, tanning and body sculpting", displayName: "Body Treatment Specialists", gradient: "from-pink-50 to-fuchsia-100", accent: "#C8737A" },
  { slug: "massage", name: "Massage", icon: "💆", description: "Remedial, relaxation, deep tissue, hot stone, sports and therapeutic massage", displayName: "Massage Therapists & Studios", gradient: "from-teal-50 to-cyan-100", accent: "#6B9B9B" },
  { slug: "cosmetic", name: "Cosmetic", icon: "⭐", description: "Anti-wrinkle, dermal fillers, lip enhancement and aesthetics", displayName: "Cosmetic Clinics", gradient: "from-slate-50 to-purple-100", accent: "#9B7B84" },
  { slug: "wellness", name: "Wellness", icon: "🌿", description: "Holistic health, spa treatments, meditation and wellness therapies", displayName: "Wellness & Spa", gradient: "from-emerald-50 to-green-100", accent: "#7B9B8C" },
] as const;

export type BeautyCategory = (typeof BEAUTY_CATEGORIES)[number];

export function findCategory(slug: string): BeautyCategory | undefined {
  return BEAUTY_CATEGORIES.find((c) => c.slug === slug);
}
