/**
 * Static fallback provider data shown when the API is unreachable.
 * These are real Perth beauty businesses seeded in the database.
 * Once the API is live, the live data takes priority.
 */

export type FallbackProvider = {
  slug: string;
  businessName: string;
  city: string;
  averageRating: number;
  totalReviews: number;
  categories: string[];
  tagline?: string;
};

export const FALLBACK_FEATURED_PROVIDERS: FallbackProvider[] = [
  {
    slug: "hair-collection-tokyo-perth-cbd",
    businessName: "Hair Collection Tokyo Perth CBD",
    city: "Perth",
    averageRating: 4.9,
    totalReviews: 6731,
    categories: ["Hair"],
  },
  {
    slug: "ellie-dunne-collective-subiaco",
    businessName: "Ellie Dunne Collective",
    city: "Subiaco",
    averageRating: 5.0,
    totalReviews: 382,
    categories: ["Hair"],
  },
  {
    slug: "fountain-of-youth-skin-subiaco",
    businessName: "Fountain of Youth Skin",
    city: "Subiaco",
    averageRating: 4.9,
    totalReviews: 245,
    categories: ["Skin Care"],
  },
  {
    slug: "diamond-nails-perth-cbd",
    businessName: "Diamond Nails Perth CBD",
    city: "Perth",
    averageRating: 4.9,
    totalReviews: 75,
    categories: ["Nails"],
  },
  {
    slug: "breathe-beauty-mt-lawley",
    businessName: "Breathe Beauty Mt Lawley",
    city: "Mount Lawley",
    averageRating: 4.8,
    totalReviews: 195,
    categories: ["Lashes"],
  },
  {
    slug: "brow-house-subiaco",
    businessName: "Brow House Subiaco",
    city: "Subiaco",
    averageRating: 4.9,
    totalReviews: 156,
    categories: ["Brows"],
  },
  {
    slug: "nest-day-spa-perth",
    businessName: "Nest Day Spa",
    city: "Perth",
    averageRating: 4.8,
    totalReviews: 285,
    categories: ["Body"],
  },
  {
    slug: "glow-studio-fremantle",
    businessName: "Glow Studio Fremantle",
    city: "Fremantle",
    averageRating: 4.8,
    totalReviews: 168,
    categories: ["Makeup"],
  },
  {
    slug: "the-cosmetic-clinic-claremont",
    businessName: "The Cosmetic Clinic Claremont",
    city: "Claremont",
    averageRating: 4.9,
    totalReviews: 185,
    categories: ["Cosmetic"],
  },
];

/** Fallback providers for specific suburbs (top-rated in each area) */
export const FALLBACK_SUBURB_PROVIDERS: Record<string, FallbackProvider[]> = {
  perth: [
    { slug: "hair-collection-tokyo-perth-cbd", businessName: "Hair Collection Tokyo", city: "Perth", averageRating: 4.9, totalReviews: 6731, categories: ["Hair"] },
    { slug: "diamond-nails-perth-cbd", businessName: "Diamond Nails Perth CBD", city: "Perth", averageRating: 4.9, totalReviews: 75, categories: ["Nails"] },
    { slug: "le-pretty-little-squad-perth-cbd", businessName: "Le Pretty Little Squad", city: "Perth", averageRating: 5.0, totalReviews: 46, categories: ["Nails"] },
    { slug: "nest-day-spa-perth", businessName: "Nest Day Spa", city: "Perth", averageRating: 4.8, totalReviews: 285, categories: ["Body"] },
    { slug: "ella-bache-perth-cbd", businessName: "Ella Baché Perth CBD", city: "Perth", averageRating: 4.7, totalReviews: 155, categories: ["Skin Care"] },
    { slug: "lash-lab-east-perth", businessName: "Lash Lab East Perth", city: "Perth", averageRating: 4.8, totalReviews: 95, categories: ["Lashes"] },
  ],
  subiaco: [
    { slug: "ellie-dunne-collective-subiaco", businessName: "Ellie Dunne Collective", city: "Subiaco", averageRating: 5.0, totalReviews: 382, categories: ["Hair"] },
    { slug: "fountain-of-youth-skin-subiaco", businessName: "Fountain of Youth Skin", city: "Subiaco", averageRating: 4.9, totalReviews: 245, categories: ["Skin Care"] },
    { slug: "brow-house-subiaco", businessName: "Brow House Subiaco", city: "Subiaco", averageRating: 4.9, totalReviews: 156, categories: ["Brows"] },
  ],
  fremantle: [
    { slug: "glow-studio-fremantle", businessName: "Glow Studio Fremantle", city: "Fremantle", averageRating: 4.8, totalReviews: 168, categories: ["Makeup"] },
    { slug: "east-fremantle-hair-studio", businessName: "East Fremantle Hair Studio", city: "East Fremantle", averageRating: 4.8, totalReviews: 55, categories: ["Hair"] },
    { slug: "north-fremantle-hair-co", businessName: "North Fremantle Hair Co", city: "North Fremantle", averageRating: 4.8, totalReviews: 62, categories: ["Hair"] },
  ],
  joondalup: [
    { slug: "joondalup-nail-studio", businessName: "Joondalup Nail Studio", city: "Joondalup", averageRating: 4.7, totalReviews: 65, categories: ["Nails"] },
    { slug: "hair-lab-joondalup", businessName: "Hair Lab Joondalup", city: "Joondalup", averageRating: 4.7, totalReviews: 88, categories: ["Hair"] },
  ],
  claremont: [
    { slug: "the-cosmetic-clinic-claremont", businessName: "The Cosmetic Clinic Claremont", city: "Claremont", averageRating: 4.9, totalReviews: 185, categories: ["Cosmetic"] },
  ],
  scarborough: [
    { slug: "scarborough-cosmetic-studio", businessName: "Scarborough Cosmetic Studio", city: "Scarborough", averageRating: 4.7, totalReviews: 85, categories: ["Cosmetic"] },
  ],
  "mount-lawley": [
    { slug: "breathe-beauty-mt-lawley", businessName: "Breathe Beauty Mt Lawley", city: "Mount Lawley", averageRating: 4.8, totalReviews: 195, categories: ["Lashes"] },
  ],
  "victoria-park": [
    { slug: "the-beauty-spot-east-victoria-park", businessName: "The Beauty Spot", city: "East Victoria Park", averageRating: 4.7, totalReviews: 82, categories: ["Nails"] },
  ],
  leederville: [
    { slug: "leederville-cosmetic-clinic", businessName: "Leederville Cosmetic Clinic", city: "Leederville", averageRating: 4.8, totalReviews: 85, categories: ["Cosmetic"] },
    { slug: "west-leederville-hair-lounge", businessName: "West Leederville Hair Lounge", city: "West Leederville", averageRating: 4.7, totalReviews: 85, categories: ["Hair"] },
  ],
};

/** Get fallback providers for a suburb, or general featured ones */
export function getFallbackProviders(suburbSlug?: string): FallbackProvider[] {
  if (suburbSlug && FALLBACK_SUBURB_PROVIDERS[suburbSlug]) {
    return FALLBACK_SUBURB_PROVIDERS[suburbSlug];
  }
  return FALLBACK_FEATURED_PROVIDERS.slice(0, 6);
}
