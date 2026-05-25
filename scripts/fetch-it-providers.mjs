#!/usr/bin/env node
// Fetch IT service providers in Perth from Google Places API (New)
const API_KEY = process.env.GOOGLE_PLACES_KEY || 'AIzaSyAQoysDNxhid_TMsHCPkJdN4fYQBqt9WKo';

const QUERIES = [
  // Core IT services
  "IT support Perth WA", "computer repair Perth WA", "web developer Perth WA",
  "web development agency Perth WA", "app developer Perth WA", "mobile app development Perth",
  "cloud services Perth WA", "cybersecurity Perth WA", "managed IT services Perth",
  "IT consulting Perth WA", "software development Perth WA", "data analytics Perth WA",
  "SEO agency Perth WA", "digital marketing agency Perth WA", "UI UX design Perth WA",
  "network services Perth WA", "IT helpdesk Perth WA", "ecommerce developer Perth WA",
  // Suburb-specific
  "IT services Joondalup WA", "IT support Fremantle WA", "web developer Subiaco WA",
  "computer repair Midland WA", "IT support Rockingham WA", "web development Osborne Park WA",
  "IT services Cannington WA", "managed IT Morley WA", "tech support Armadale WA",
  "IT company Balcatta WA", "computer services Belmont WA", "IT support Mandurah WA",
  "web agency Leederville WA", "software company West Perth WA",
  // Niche
  "AI machine learning Perth WA", "database administration Perth WA",
  "WordPress developer Perth WA", "Shopify developer Perth WA",
  "Microsoft 365 support Perth WA", "Google Workspace Perth WA",
];

const CATEGORY_MAP = {
  "web developer": "web-development",
  "web development": "web-development",
  "web design": "web-development",
  "wordpress": "web-development",
  "shopify": "ecommerce",
  "ecommerce": "ecommerce",
  "e-commerce": "ecommerce",
  "app developer": "mobile-apps",
  "mobile app": "mobile-apps",
  "cloud": "cloud-devops",
  "devops": "cloud-devops",
  "microsoft 365": "it-support",
  "google workspace": "it-support",
  "cybersecurity": "cybersecurity",
  "security": "cybersecurity",
  "data analytics": "data-analytics",
  "data": "data-analytics",
  "it support": "it-support",
  "it helpdesk": "it-support",
  "computer repair": "it-support",
  "computer services": "it-support",
  "tech support": "it-support",
  "managed it": "it-support",
  "it services": "it-support",
  "it company": "it-support",
  "ai": "ai-ml",
  "machine learning": "ai-ml",
  "database": "database-administration",
  "ui ux": "ui-ux-design",
  "ux design": "ui-ux-design",
  "it consulting": "consulting",
  "consulting": "consulting",
  "software development": "software-development",
  "software company": "software-development",
  "seo": "digital-marketing",
  "digital marketing": "digital-marketing",
  "network": "networking",
  "web agency": "web-development",
};

function guessCategory(query, types) {
  const q = query.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (q.includes(key)) return val;
  }
  if (types) {
    if (types.some(t => t.includes("computer"))) return "it-support";
    if (types.some(t => t.includes("software"))) return "software-development";
  }
  return "it-support";
}

function slugify(name, suburb) {
  const base = `${name} ${suburb}`.toLowerCase()
    .replace(/['']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
  return base;
}

function extractSuburb(address) {
  if (!address) return "Perth";
  const match = address.match(/,\s*([A-Za-z\s]+?)\s+WA\s+\d{4}/);
  return match ? match[1].trim() : "Perth";
}

function generateDescription(name, category, suburb) {
  const descs = {
    "web-development": `${name} provides professional web development services in ${suburb}. Specialising in modern websites, web applications, and digital solutions for Perth businesses.`,
    "mobile-apps": `${name} is a mobile app development company based in ${suburb}, building iOS and Android applications for Perth businesses.`,
    "cloud-devops": `${name} delivers cloud infrastructure and DevOps services in ${suburb}, helping Perth businesses with scalable, reliable technology solutions.`,
    "cybersecurity": `${name} offers cybersecurity services in ${suburb}, providing security assessments, penetration testing, and compliance solutions.`,
    "data-analytics": `${name} specialises in data analytics and business intelligence in ${suburb}, turning data into actionable insights for Perth organisations.`,
    "it-support": `${name} provides reliable IT support and managed services in ${suburb}. Offering helpdesk, device management, and network support for Perth businesses.`,
    "ai-ml": `${name} delivers AI and machine learning solutions in ${suburb}, helping Perth businesses automate processes and leverage intelligent systems.`,
    "ui-ux-design": `${name} is a UI/UX design studio in ${suburb}, creating intuitive digital experiences and product designs for Perth clients.`,
    "consulting": `${name} offers IT consulting and technology advisory services in ${suburb}, guiding Perth businesses through digital transformation.`,
    "networking": `${name} provides network infrastructure services in ${suburb}, including Wi-Fi, cabling, and connectivity solutions for Perth businesses.`,
    "ecommerce": `${name} builds e-commerce solutions in ${suburb}, creating online stores and marketplace platforms for Perth retailers.`,
    "digital-marketing": `${name} is a digital marketing agency in ${suburb}, offering SEO, PPC, and online growth strategies for Perth businesses.`,
    "software-development": `${name} is a software development company in ${suburb}, building custom software solutions for Perth businesses and organisations.`,
    "database-administration": `${name} provides database administration services in ${suburb}, managing and optimising database systems for Perth organisations.`,
  };
  return descs[category] || `${name} provides professional IT services in ${suburb}, serving businesses across the Perth metropolitan area.`;
}

async function searchPlaces(query) {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.types,places.id'
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 20 })
  });
  return res.json();
}

async function main() {
  const seen = new Set();
  const results = [];

  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i];
    const data = await searchPlaces(q);
    const places = data.places || [];
    let newCount = 0;
    for (const p of places) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      newCount++;
      const name = p.displayName?.text || "Unknown";
      const suburb = extractSuburb(p.formattedAddress);
      const cat = guessCategory(q, p.types);
      results.push({
        businessName: name,
        slug: slugify(name, suburb),
        description: generateDescription(name, cat, suburb),
        averageRating: p.rating || 0,
        totalReviews: p.userRatingCount || 0,
        phoneNumber: p.nationalPhoneNumber || null,
        website: p.websiteUri || null,
        address: p.formattedAddress || null,
        suburb,
        categories: [cat],
      });
    }
    console.error(`[${i+1}/${QUERIES.length}] Fetching: ${q}... ${places.length} results, ${newCount} new`);
    if (i < QUERIES.length - 1) await new Promise(r => setTimeout(r, 300));
  }

  console.error(`\nTotal unique IT providers: ${results.length}`);
  process.stdout.write(JSON.stringify(results, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
