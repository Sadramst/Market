#!/usr/bin/env node
// Fetch massage providers across all Perth suburbs from Google Places API (New)
// This fills gaps in the existing massage_providers.json
const API_KEY = process.env.GOOGLE_PLACES_KEY || 'AIzaSyAQoysDNxhid_TMsHCPkJdN4fYQBqt9WKo';

// Perth suburbs — all major ones
const SUBURBS = [
  "Perth", "Subiaco", "Claremont", "Nedlands", "Cottesloe", "Fremantle", "South Perth",
  "Victoria Park", "East Perth", "West Perth", "Northbridge", "Leederville", "Mount Lawley",
  "Inglewood", "Bayswater", "Morley", "Dianella", "Yokine", "Tuart Hill", "Osborne Park",
  "Innaloo", "Scarborough", "Doubleview", "Karrinyup", "Stirling", "Balcatta", "Westminster",
  "Mirrabooka", "Nollamara", "Joondanna", "Mount Hawthorn", "North Perth", "Highgate",
  "Maylands", "Rivervale", "Belmont", "Redcliffe", "Ascot", "Bassendean", "Guildford",
  "Midland", "Kalamunda", "Mundaring", "Darlington", "Glen Forrest", "Parkerville",
  "Canning Vale", "Willetton", "Riverton", "Rossmoyne", "Shelley", "Bull Creek",
  "Leeming", "Murdoch", "Melville", "Booragoon", "Applecross", "Como", "Manning",
  "Kensington", "South Lake", "Cockburn Central", "Jandakot", "Bibra Lake", "Hamilton Hill",
  "Spearwood", "Coolbellup", "Kardinya", "Winthrop", "Bateman", "Myaree", "Palmyra",
  "East Fremantle", "Mosman Park", "Peppermint Grove", "Dalkeith", "Crawley", "Shenton Park",
  "Floreat", "City Beach", "Wembley", "Jolimont", "Daglish", "Swanbourne", "Mount Claremont",
  "Churchlands", "Woodlands", "Hamersley", "Warwick", "Greenwood", "Kingsley", "Padbury",
  "Duncraig", "Hillarys", "Sorrento", "Marmion", "Watermans Bay", "North Beach", "Trigg",
  "Joondalup", "Currambine", "Kinross", "Burns Beach", "Mindarie", "Clarkson", "Merriwa",
  "Butler", "Alkimos", "Yanchep", "Two Rocks", "Wanneroo", "Landsdale", "Madeley",
  "Wangara", "Pearsall", "Alexander Heights", "Marangaroo", "Girrawheen",
  "Ellenbrook", "The Vines", "Upper Swan", "Henley Brook", "Ballajura", "Malaga",
  "Noranda", "Beechboro", "Kiara", "Lockridge", "Eden Hill", "Embleton",
  "Cannington", "Bentley", "St James", "East Cannington", "Queens Park", "Welshpool",
  "Thornlie", "Gosnells", "Maddington", "Kenwick", "Langford", "Ferndale", "Lynwood",
  "Armadale", "Kelmscott", "Roleystone", "Byford", "Mundijong",
  "Rockingham", "Safety Bay", "Warnbro", "Port Kennedy", "Baldivis", "Secret Harbour",
  "Mandurah", "Halls Head", "Falcon", "Pinjarra", "Greenfields",
  "Waikiki", "Shoalwater", "Kwinana", "Wellard", "Bertram",
];

const QUERY_TEMPLATES = [
  "massage therapist {suburb} WA",
  "remedial massage {suburb} WA",
  "day spa massage {suburb} WA",
  "Thai massage {suburb} WA",
  "sports massage {suburb} WA",
];

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

function generateDescription(name, suburb) {
  const templates = [
    `${name} offers professional massage therapy in ${suburb}. Providing remedial, relaxation, and deep tissue massage services to clients across Perth.`,
    `Located in ${suburb}, ${name} specialises in therapeutic massage treatments. From sports massage to relaxation therapy, we cater to all your wellness needs.`,
    `${name} is a trusted massage therapy practice in ${suburb}, Perth. Our experienced therapists provide personalised treatments for pain relief and relaxation.`,
    `Visit ${name} in ${suburb} for expert massage therapy. We offer remedial, hot stone, and relaxation massage in a tranquil setting.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
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
  // Load existing to avoid duplicates
  const fs = await import('fs');
  const existingPath = '../backend/src/Appilico.Market.Infrastructure/Data/Seed/massage_providers.json';
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  } catch {}
  const existingSlugs = new Set(existing.map(p => p.slug));
  const seen = new Set();
  const results = [...existing]; // Start with existing

  let totalQueries = 0;
  let newTotal = 0;

  for (const suburb of SUBURBS) {
    // Cycle through query templates, 1 query per suburb to keep API usage reasonable
    const templateIdx = SUBURBS.indexOf(suburb) % QUERY_TEMPLATES.length;
    const query = QUERY_TEMPLATES[templateIdx].replace('{suburb}', suburb);
    totalQueries++;

    try {
      const data = await searchPlaces(query);
      const places = data.places || [];
      let newCount = 0;

      for (const p of places) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);

        const name = p.displayName?.text || "Unknown";
        const detectedSuburb = extractSuburb(p.formattedAddress);
        const slug = slugify(name, detectedSuburb);

        if (existingSlugs.has(slug)) continue;

        newCount++;
        results.push({
          businessName: name,
          slug,
          description: generateDescription(name, detectedSuburb),
          averageRating: p.rating || 0,
          totalReviews: p.userRatingCount || 0,
          phoneNumber: p.nationalPhoneNumber || null,
          website: p.websiteUri || null,
          address: p.formattedAddress || null,
          suburb: detectedSuburb,
          categories: ["massage"],
        });
      }
      newTotal += newCount;
      console.error(`[${totalQueries}/${SUBURBS.length}] ${query}... ${places.length} results, ${newCount} new (total: ${results.length})`);
    } catch (err) {
      console.error(`[${totalQueries}/${SUBURBS.length}] ERROR: ${query} — ${err.message}`);
    }

    // Rate limit: 300ms between requests
    if (totalQueries < SUBURBS.length) await new Promise(r => setTimeout(r, 300));
  }

  console.error(`\nDone. Existing: ${existing.length}, New: ${newTotal}, Total: ${results.length}`);

  // Write merged results
  fs.writeFileSync(existingPath, JSON.stringify(results, null, 2));
  console.error(`Written to ${existingPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
