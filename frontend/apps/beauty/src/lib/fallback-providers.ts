/**
 * Static fallback provider data shown when the API is unreachable.
 * These are real Perth beauty businesses from Google Places data.
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
    { slug: "hussein-hair-dresser-bentley", businessName: "Hussein Hair Dresser", city: "Bentley", averageRating: 4.7, totalReviews: 1328, categories: ["Skin","Brows"] },
    { slug: "arch-beauty-bar-cannington", businessName: "Arch Beauty Bar", city: "Cannington", averageRating: 4.7, totalReviews: 996, categories: ["Nails","Brows"] },
    { slug: "minu-threading-and-beauty-madeley", businessName: "Minu Threading and Beauty", city: "Madeley", averageRating: 3.9, totalReviews: 946, categories: ["Nails","Skin"] },
    { slug: "bang-on-brows-cockburn", businessName: "Bang on Brows", city: "Cockburn", averageRating: 4.9, totalReviews: 923, categories: ["Skin","Nails"] },
    { slug: "bi-hair-nail-beauty-salon-morley", businessName: "BI HAIR NAIL & BEAUTY SALON", city: "Morley", averageRating: 4.7, totalReviews: 917, categories: ["Skin","Nails"] },
    { slug: "arch-beauty-bar-beeliar", businessName: "Arch Beauty Bar", city: "Beeliar", averageRating: 4.7, totalReviews: 747, categories: ["Skin","Nails"] },
    { slug: "tao-of-hair-perth", businessName: "Tao of Hair", city: "Perth", averageRating: 4.8, totalReviews: 725, categories: ["Lashes","Brows"] },
    { slug: "hillarys-nails-beauty-hillarys", businessName: "Hillarys Nails & Beauty", city: "Hillarys", averageRating: 4.8, totalReviews: 698, categories: ["Brows","Lashes"] },
];

/** Fallback providers for specific suburbs (top-rated in each area) */
export const FALLBACK_SUBURB_PROVIDERS: Record<string, FallbackProvider[]> = {
  "perth": [
    { slug: "tao-of-hair-perth", businessName: "Tao of Hair", city: "Perth", averageRating: 4.8, totalReviews: 725, categories: ["Lashes","Brows"] },
    { slug: "unique-beauty-style-hair-and-beauty-in-west-perth-perth", businessName: "Unique Beauty & Style - Hair and Beauty in West Perth", city: "Perth", averageRating: 4.8, totalReviews: 642, categories: ["Nails","Brows"] },
    { slug: "skindeep-medi-spas-perth", businessName: "Skindeep Medi-Spas", city: "Perth", averageRating: 4.9, totalReviews: 489, categories: ["Lashes","Brows"] },
  ],
  "fremantle": [
    { slug: "unique-hair-beauty-fremantle", businessName: "Unique Hair & Beauty", city: "Fremantle", averageRating: 4.6, totalReviews: 278, categories: ["Lashes","Skin"] },
    { slug: "djurra-lifestyle-salon-and-spa-fremantle", businessName: "Djurra Lifestyle Salon and Spa", city: "Fremantle", averageRating: 4.7, totalReviews: 157, categories: ["Nails","Skin"] },
    { slug: "beauty-insiders-lash-brow-studio-fremantle", businessName: "Beauty Insiders- Lash & Brow Studio", city: "Fremantle", averageRating: 4.9, totalReviews: 39, categories: ["Brows","Lashes"] },
  ],
  "joondalup": [
    { slug: "arch-beauty-bar-joondalup", businessName: "ARCH BEAUTY BAR", city: "Joondalup", averageRating: 4.5, totalReviews: 657, categories: ["Nails","Skin"] },
    { slug: "ella-bach-joondalup-joondalup", businessName: "Ella Baché Joondalup", city: "Joondalup", averageRating: 4.4, totalReviews: 179, categories: ["Skin","Nails"] },
    { slug: "parlour-beautique-joondalup", businessName: "Parlour Beautique", city: "Joondalup", averageRating: 4.1, totalReviews: 176, categories: ["Skin","Nails"] },
  ],
  "morley": [
    { slug: "bi-hair-nail-beauty-salon-morley", businessName: "BI HAIR NAIL & BEAUTY SALON", city: "Morley", averageRating: 4.7, totalReviews: 917, categories: ["Skin","Nails"] },
    { slug: "me-by-maurice-meade-morley-morley", businessName: "Me by Maurice Meade Morley", city: "Morley", averageRating: 4.8, totalReviews: 383, categories: ["Brows","Skin"] },
    { slug: "iconic-beaute-wa-morley", businessName: "Iconic Beaute WA", city: "Morley", averageRating: 4.4, totalReviews: 260, categories: ["Skin","Brows"] },
  ],
  "cannington": [
    { slug: "arch-beauty-bar-cannington", businessName: "Arch Beauty Bar", city: "Cannington", averageRating: 4.7, totalReviews: 996, categories: ["Nails","Brows"] },
    { slug: "asian-trend-beauty-salon-cannington", businessName: "Asian Trend Beauty Salon", city: "Cannington", averageRating: 4.9, totalReviews: 517, categories: ["Brows","Skin"] },
    { slug: "the-empire-beauty-bar-westfield-carousel-cannington", businessName: "The Empire Beauty Bar Westfield Carousel", city: "Cannington", averageRating: 4.5, totalReviews: 305, categories: ["Lashes","Nails"] },
  ],
  "baldivis": [
    { slug: "glow-skin-spa-baldivis", businessName: "Glow Skin & Spa", city: "Baldivis", averageRating: 5, totalReviews: 284, categories: ["Brows","Lashes"] },
    { slug: "hair-and-beauty-baldivis-baldivis", businessName: "Hair and Beauty Baldivis", city: "Baldivis", averageRating: 4.4, totalReviews: 267, categories: ["Lashes","Nails"] },
    { slug: "sass-maine-hair-studio-baldivis", businessName: "Sass & Maine Hair Studio", city: "Baldivis", averageRating: 4.8, totalReviews: 189, categories: ["Nails","Skin"] },
  ],
  "armadale": [
    { slug: "room-for-hair-armadale", businessName: "Room for Hair", city: "Armadale", averageRating: 4.8, totalReviews: 136, categories: ["Skin","Brows"] },
    { slug: "adore-beauty-secret-armadale", businessName: "Adore Beauty Secret", city: "Armadale", averageRating: 5, totalReviews: 117, categories: ["Skin","Nails"] },
    { slug: "the-threading-company-armadale", businessName: "The Threading Company", city: "Armadale", averageRating: 4.5, totalReviews: 72, categories: ["Lashes","Nails"] },
  ],
  "subiaco": [
    { slug: "ultimate-aesthetics-subiaco-subiaco", businessName: "Ultimate Aesthetics Subiaco", city: "Subiaco", averageRating: 5, totalReviews: 225, categories: ["Brows","Skin"] },
    { slug: "maurice-meade-subiaco-subiaco", businessName: "Maurice Meade Subiaco", city: "Subiaco", averageRating: 4.8, totalReviews: 207, categories: ["Skin","Nails"] },
    { slug: "sonya-s-beauty-eyelash-extensions-studio-subiaco", businessName: "Sonya's Beauty — Eyelash Extensions Studio", city: "Subiaco", averageRating: 5, totalReviews: 106, categories: ["Nails","Brows"] },
  ],
  "claremont": [
    { slug: "bang-on-brows-claremont", businessName: "Bang on Brows", city: "Claremont", averageRating: 4.9, totalReviews: 384, categories: ["Brows","Lashes"] },
    { slug: "nuhairco-claremont", businessName: "NUHAIRCO", city: "Claremont", averageRating: 4.9, totalReviews: 116, categories: ["Lashes","Brows"] },
    { slug: "abh-studio-claremont", businessName: "ABH Studio", city: "Claremont", averageRating: 4.9, totalReviews: 114, categories: ["Nails","Skin"] },
  ],
  "scarborough": [
    { slug: "brow-beauty-nation-scarborough-scarborough", businessName: "Brow & Beauty Nation Scarborough", city: "Scarborough", averageRating: 5, totalReviews: 173, categories: ["Lashes","Brows"] },
    { slug: "loyal-beauty-and-grooming-scarborough", businessName: "Loyal Beauty and Grooming", city: "Scarborough", averageRating: 5, totalReviews: 167, categories: ["Nails","Skin"] },
    { slug: "ra-ra-rachael-louise-studio-scarborough", businessName: "RA'RA - Rachael Louise Studio", city: "Scarborough", averageRating: 4.9, totalReviews: 126, categories: ["Skin","Nails"] },
  ],
  "mount-lawley": [
    { slug: "pierrot-s-hair-brow-studio-mount-lawley", businessName: "Pierrot’s Hair & Brow Studio", city: "Mount Lawley", averageRating: 4.8, totalReviews: 172, categories: ["Skin","Nails"] },
    { slug: "bigoudee-coiffure-mount-lawley", businessName: "Bigoudee Coiffure", city: "Mount Lawley", averageRating: 4.9, totalReviews: 127, categories: ["Lashes","Nails"] },
    { slug: "mane-code-co-mount-lawley", businessName: "Mane Code + Co", city: "Mount Lawley", averageRating: 5, totalReviews: 115, categories: ["Lashes","Skin"] },
  ],
  "victoria-park": [
    { slug: "j-k-hair-salon-victoria-park", businessName: "J & K Hair Salon", city: "Victoria Park", averageRating: 4.6, totalReviews: 192, categories: ["Brows","Lashes"] },
    { slug: "i-love-hair-victoria-park", businessName: "I Love Hair", city: "Victoria Park", averageRating: 4.2, totalReviews: 170, categories: ["Skin","Brows"] },
    { slug: "lvo-beauty-lounge-victoria-park", businessName: "Lvo Beauty Lounge", city: "Victoria Park", averageRating: 4.1, totalReviews: 99, categories: ["Brows","Lashes"] },
  ],
  "leederville": [
    { slug: "ivy-reign-leederville", businessName: "IVY REIGN", city: "Leederville", averageRating: 5, totalReviews: 407, categories: ["Skin","Nails"] },
    { slug: "iza-clarke-hair-and-beauty-leederville", businessName: "Iza Clarke Hair and Beauty", city: "Leederville", averageRating: 4.8, totalReviews: 219, categories: ["Nails","Lashes"] },
    { slug: "vera-beauty-leederville", businessName: "Vera Beauty", city: "Leederville", averageRating: 4.8, totalReviews: 49, categories: ["Brows","Skin"] },
  ],
  "applecross": [
    { slug: "muse-studio-collective-applecross", businessName: "Muse Studio Collective", city: "Applecross", averageRating: 4.9, totalReviews: 171, categories: ["Brows","Lashes"] },
    { slug: "rokk-lab-applecross", businessName: "Rokk Lab", city: "Applecross", averageRating: 5, totalReviews: 129, categories: ["Brows","Lashes"] },
    { slug: "mane-soci-t-applecross", businessName: "Mane Société", city: "Applecross", averageRating: 5, totalReviews: 113, categories: ["Nails","Skin"] },
  ],
  "bayswater": [
    { slug: "eclectic-styles-hair-studio-bayswater", businessName: "Eclectic Styles Hair Studio", city: "Bayswater", averageRating: 4.9, totalReviews: 128, categories: ["Brows","Lashes"] },
    { slug: "hair-art-bayswater", businessName: "Hair Art", city: "Bayswater", averageRating: 4.8, totalReviews: 103, categories: ["Nails","Skin"] },
    { slug: "just-for-me-beauty-salon-bayswater", businessName: "Just for Me Beauty Salon", city: "Bayswater", averageRating: 4.9, totalReviews: 49, categories: ["Lashes","Nails"] },
  ],
  "cockburn": [
    { slug: "bang-on-brows-cockburn", businessName: "Bang on Brows", city: "Cockburn", averageRating: 4.9, totalReviews: 923, categories: ["Skin","Nails"] },
    { slug: "essential-beauty-piercing-cockburn-gateway-cockburn", businessName: "Essential Beauty & Piercing Cockburn Gateway", city: "Cockburn", averageRating: 4.6, totalReviews: 358, categories: ["Lashes","Nails"] },
    { slug: "k3g-hair-salon-cockburn", businessName: "K3G Hair Salon", city: "Cockburn", averageRating: 4.4, totalReviews: 250, categories: ["Brows","Skin"] },
  ],
  "hillarys": [
    { slug: "hillarys-nails-beauty-hillarys", businessName: "Hillarys Nails & Beauty", city: "Hillarys", averageRating: 4.8, totalReviews: 698, categories: ["Brows","Lashes"] },
    { slug: "bare-skin-and-beauty-salon-hillarys-hillarys", businessName: "Bare Skin and Beauty Salon Hillarys", city: "Hillarys", averageRating: 4.9, totalReviews: 243, categories: ["Skin","Nails"] },
    { slug: "hillarys-nail-lounge-hillarys", businessName: "Hillarys Nail Lounge", city: "Hillarys", averageRating: 4.9, totalReviews: 74, categories: ["Skin","Nails"] },
  ],
  "bentley": [
    { slug: "hussein-hair-dresser-bentley", businessName: "Hussein Hair Dresser", city: "Bentley", averageRating: 4.7, totalReviews: 1328, categories: ["Skin","Brows"] },
    { slug: "hair-sg-bentley", businessName: "Hair SG", city: "Bentley", averageRating: 4, totalReviews: 299, categories: ["Skin","Nails"] },
    { slug: "latinos-hair-studio-bentley", businessName: "Latinos Hair Studio", city: "Bentley", averageRating: 4.7, totalReviews: 120, categories: ["Skin","Nails"] },
  ],
  "madeley": [
    { slug: "minu-threading-and-beauty-madeley", businessName: "Minu Threading and Beauty", city: "Madeley", averageRating: 3.9, totalReviews: 946, categories: ["Nails","Skin"] },
    { slug: "citrine-beauty-and-day-spa-madeley", businessName: "Citrine Beauty and Day Spa", city: "Madeley", averageRating: 4.9, totalReviews: 65, categories: ["Skin","Nails"] },
    { slug: "jessica-s-beauty-therapy-madeley", businessName: "Jessica's Beauty Therapy", city: "Madeley", averageRating: 5, totalReviews: 8, categories: ["Skin","Nails"] },
  ],
  "beeliar": [
    { slug: "arch-beauty-bar-beeliar", businessName: "Arch Beauty Bar", city: "Beeliar", averageRating: 4.7, totalReviews: 747, categories: ["Skin","Nails"] },
    { slug: "sleek-styles-beeliar", businessName: "Sleek Styles", city: "Beeliar", averageRating: 5, totalReviews: 176, categories: ["Skin","Nails"] },
    { slug: "hair-dare-you-beeliar", businessName: "Hair Dare You", city: "Beeliar", averageRating: 4.6, totalReviews: 75, categories: ["Nails","Brows"] },
  ],
};

/** Get fallback providers for a suburb, or general featured ones */
export function getFallbackProviders(suburbSlug?: string): FallbackProvider[] {
  if (suburbSlug && FALLBACK_SUBURB_PROVIDERS[suburbSlug]) {
    return FALLBACK_SUBURB_PROVIDERS[suburbSlug];
  }
  return FALLBACK_FEATURED_PROVIDERS.slice(0, 6);
}
