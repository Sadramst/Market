import fs from 'fs';
import https from 'https';

const API_KEY = 'AIzaSyAQoysDNxhid_TMsHCPkJdN4fYQBqt9WKo';

const SUBURBS = [
  "Applecross", "Armadale", "Atwell", "Aubin Grove", "Balcatta", "Baldivis", "Bassendean", "Bayswater", 
  "Beechboro", "Beeliar", "Belmont", "Bentley", "Bertram", "Bibra Lake", "Bicton", "Bull Creek", "Butler", 
  "Byford", "Canning Vale", "Cannington", "Carlisle", "Churchlands", "Claremont", "Clarkson", "Cockburn", 
  "Cockburn Central", "Como", "Cottesloe", "Currambine", "Dianella", "East Fremantle", "East Perth", 
  "East Victoria Park", "Eglinton", "Ellenbrook", "Floreat", "Forrestfield", "Fremantle", "Girrawheen", 
  "Gosnells", "Greenwood", "Hamilton Hill", "Harrisdale", "Highgate", "Hillarys", "Huntingdale", 
  "Inglewood", "Innaloo", "Joondalup", "Kalamunda", "Karrinyup", "Kelmscott", "Kenwick", "Kingsley", 
  "Leederville", "Leeming", "Madeley", "Malaga", "Mandurah", "Manning", "Maylands", "Melville", "Midland", 
  "Mindarie", "Mirrabooka", "Morley", "Mosman Park", "Mount Hawthorn", "Mount Lawley", "Mount Pleasant", 
  "Mundaring", "Murdoch", "Myaree", "Nedlands", "North Fremantle", "North Perth", "Northbridge", 
  "Osborne Park", "Padbury", "Palmyra", "Peppermint Grove", "Perth", "Piara Waters", "Rivervale", 
  "Rockingham", "Scarborough", "Secret Harbour", "Shenton Park", "South Lake", "South Perth", 
  "Southern River", "Spearwood", "Stirling", "Subiaco", "Success", "Swan View", "Swanbourne", "Thornlie", 
  "Tuart Hill", "Victoria Park", "Waikiki", "Wanneroo", "Warwick", "Wembley", "West Leederville", 
  "West Perth", "Willetton", "Woodvale", "Yangebup", "Yokine"
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function run() {
  console.log(`Starting to scrape data for ${SUBURBS.length} suburbs...`);
  const allProviders = [];
  const MAX_PER_SUBURB = 5; // Get top 5 per suburb to keep API costs down

  for (const suburb of SUBURBS) {
    console.log(`Searching for beauty salons in ${suburb}...`);
    const query = encodeURIComponent(`beauty salon in ${suburb}, Perth WA`);
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`;
    
    try {
      const searchData = await fetchJson(searchUrl);
      
      if (!searchData.results) {
        console.error(`No results found or error for ${suburb}:`, searchData);
        continue;
      }

      const places = searchData.results.slice(0, MAX_PER_SUBURB);
      
      for (const place of places) {
        // Use Details API to get phone and website
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,user_ratings_total,formatted_phone_number,website,formatted_address&key=${API_KEY}`;
        const detailsData = await fetchJson(detailsUrl);
        
        if (detailsData.result) {
          const res = detailsData.result;
          allProviders.push({
            businessName: res.name || place.name,
            slug: slugify(res.name || place.name) + '-' + Math.floor(Math.random()*1000),
            description: `${res.name || place.name} is a highly rated beauty salon located at ${res.formatted_address || place.formatted_address}. Offering professional beauty services.`,
            averageRating: res.rating || place.rating || 4.5,
            totalReviews: res.user_ratings_total || place.user_ratings_total || 0,
            phoneNumber: res.formatted_phone_number || '',
            website: res.website || '',
            address: res.formatted_address || place.formatted_address || '',
            suburb: suburb,
            providerType: 'Beauty',
            categories: ['Skin', 'Nails', 'Lashes', 'Brows'].sort(() => 0.5 - Math.random()).slice(0, 2)
          });
        }
      }
    } catch (err) {
      console.error(`Failed on ${suburb}`, err);
    }
    
    // Quick sleep to avoid hitting Rate Limits
    await new Promise(r => setTimeout(r, 200));
  }

  // Save localized backup
  fs.writeFileSync('backend/src/Appilico.Market.Infrastructure/Data/Seed/google_providers.json', JSON.stringify(allProviders, null, 2));
  console.log(`\nFinished! Saved ${allProviders.length} real providers to google_providers.json!`);
}

run();
