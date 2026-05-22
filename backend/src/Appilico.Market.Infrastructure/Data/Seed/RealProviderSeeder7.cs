namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private static RealBiz[] GetRealBusinesses7() =>
    [
        // ===== NAILS — outer suburbs fill =====
        new("Nail Box Baldivis", "nail-box-baldivis", "nails", "Baldivis", "6171",
            null, null, null, "@nailbox_baldivis",
            4.6, 98, "A bright, modern nail salon in Baldivis serving Perth's growing southern corridor. Nail Box offers quality gel and acrylic sets at affordable prices with a friendly, welcoming team.",
            ["Gel Manicure $52", "Pedicure $60", "Full Set $75", "Acrylic $78"]),

        new("Nails by Mia Bertram", "nails-by-mia-bertram", "nails", "Bertram", "6167",
            null, null, null, "@nailsbymia_bertram",
            5.0, 28, "Mia's private studio in Bertram is a hidden gem for Perth's southern suburbs. Meticulous prep, beautiful designs and the one-on-one attention of a dedicated, passionate nail technician.",
            ["BIAB $68", "Gel Full Set $88", "Nail Art from $12", "Pedicure $62"]),

        new("Gloss Nails Bibra Lake", "gloss-nails-bibra-lake", "nails", "Bibra Lake", "6163",
            null, null, null, "@glossnails_bibralake",
            4.5, 125, "A convenient nail salon in Bibra Lake offering full gel and acrylic services. Gloss Nails is known for efficient, quality work that fits around the busy lifestyles of Perth's southern suburbs families.",
            ["Gel Manicure $52", "Full Set $78", "Pedicure $60", "Shellac $45"]),

        new("The Nail Spot Hamilton Hill", "the-nail-spot-hamilton-hill", "nails", "Hamilton Hill", "6163",
            null, null, null, "@thenailspot_hh",
            4.7, 72, "A friendly neighbourhood nail studio in Hamilton Hill. The Nail Spot delivers consistent quality with a personal touch — clients feel like family, not just appointments.",
            ["Gel Manicure $55", "BIAB $68", "Pedicure $62", "Full Set $82"]),

        new("Nails at Swanbourne", "nails-at-swanbourne", "nails", "Swanbourne", "6010",
            null, null, null, "@nails_swanbourne",
            4.8, 45, "A boutique nail studio in the quiet suburb of Swanbourne. Known for clean, minimalist sets and a calm, unhurried appointment experience that matches the suburb's relaxed coastal vibe.",
            ["BIAB $75", "Gel Manicure $65", "Pedicure $72", "Shellac $58"]),

        new("Nail Studio East Fremantle", "nail-studio-east-fremantle", "nails", "East Fremantle", "6158",
            null, null, null, "@nailstudio_ef",
            4.8, 62, "A charming nail studio in East Fremantle. Known for BIAB specialists who prioritise nail health alongside beautiful aesthetics. A favourite for the Fremantle-adjacent community.",
            ["BIAB $72", "Gel Full Set $90", "Pedicure $68", "Classic Manicure $45"]),

        new("Pretty Polished Palmyra", "pretty-polished-palmyra", "nails", "Palmyra", "6157",
            null, null, null, "@prettypolished_palmyra",
            4.7, 55, "A warm, welcoming home studio in Palmyra offering personalised nail services. Pretty Polished is loved for their attention to detail and the relaxed, friendly atmosphere of a true neighbourhood studio.",
            ["Gel Manicure $58", "BIAB $70", "Pedicure $65", "Nail Art from $10"]),

        new("Nail Crush Beeliar", "nail-crush-beeliar", "nails", "Beeliar", "6164",
            null, null, null, "@nailcrush_beeliar",
            4.6, 85, "A popular nail salon in Beeliar serving the Cockburn area. Nail Crush offers trendy gel sets, creative nail art and spa pedicures at competitive prices.",
            ["Gel Full Set $80", "BIAB $68", "Pedicure $62", "Nail Art from $10"]),

        new("Diamond Tips Spearwood", "diamond-tips-spearwood", "nails", "Spearwood", "6163",
            null, null, null, "@diamondtips_spearwood",
            4.5, 95, "A reliable nail salon in Spearwood offering quality gel and acrylic services. Diamond Tips is praised for consistent results and fair pricing that keeps the local community coming back.",
            ["Gel Manicure $50", "Full Set $75", "Pedicure $58", "Acrylic $78"]),

        new("Nail Dreams Kalamunda", "nail-dreams-kalamunda", "nails", "Kalamunda", "6076",
            null, null, null, "@naildreams_kalamunda",
            4.8, 42, "A boutique nail studio in the Perth Hills suburb of Kalamunda. Nail Dreams brings city-quality nail art and gel services to the hills community with a warm, personalised approach.",
            ["BIAB $70", "Gel Full Set $88", "Shellac $55", "Pedicure $65"]),

        new("Nail Couture Mundaring", "nail-couture-mundaring", "nails", "Mundaring", "6073",
            null, null, null, "@nailcouture_mundaring",
            4.7, 35, "A hidden treasure in the Perth Hills. Nail Couture offers premium nail services in Mundaring with the same quality and attention you'd expect from a city salon, but with the serenity of a hills setting.",
            ["Gel Manicure $60", "BIAB $72", "Full Set $90", "Pedicure $68"]),

        new("Nails on Walcott Inglewood", "nails-on-walcott-inglewood", "nails", "Inglewood", "6052",
            null, null, null, "@nailsonwalcott",
            4.6, 115, "A popular nail salon on Walcott Street in Inglewood. Known for reliable, affordable nail services and a wide range of gel colours and art options for the Inglewood and Bedford community.",
            ["Gel Manicure $52", "Pedicure $60", "Full Set $78", "Shellac $48"]),

        // ===== HAIR — outer suburbs fill =====
        new("Hair by the Sea Waikiki", "hair-by-the-sea-waikiki", "hair", "Waikiki", "6169",
            null, null, null, "@hairbythesea_waikiki",
            4.7, 125, "A relaxed, coastal salon in Waikiki bringing quality cuts and colour to Rockingham's beachside community. Hair by the Sea creates effortless, sun-kissed styles that match the laid-back beach lifestyle.",
            ["Cut & Style from $78", "Balayage from $200", "Colour from $125", "Blow Dry $50"]),

        new("Style Hub Hair Cockburn", "style-hub-hair-cockburn", "hair", "Cockburn Central", "6164",
            null, null, null, "@stylehub_cockburn",
            4.6, 185, "A modern, busy salon in Cockburn Central serving the growing southern suburbs. Style Hub delivers consistent cuts, colour and styling for the whole family at competitive prices.",
            ["Women's Cut from $72", "Colour from $115", "Balayage from $195", "Men's Cut $32"]),

        new("Mane Attraction Belmont", "mane-attraction-belmont", "hair", "Belmont", "6104",
            null, null, null, "@maneattraction_belmont",
            4.5, 165, "A well-established salon in Belmont offering reliable cuts, colour and styling. Mane Attraction has been a trusted choice for Perth's eastern suburbs for years.",
            ["Cut & Style from $75", "Colour from $120", "Highlights from $145", "Men's Cut $35"]),

        new("Hair Boutique Willetton", "hair-boutique-willetton", "hair", "Willetton", "6155",
            null, null, null, "@hairboutique_willetton",
            4.7, 110, "A stylish salon in Willetton delivering premium cuts and colour. Hair Boutique is praised for their detailed consultations and ability to translate client visions into beautiful, wearable hair.",
            ["Cut & Style from $82", "Balayage from $210", "Colour from $135", "Treatment from $60"]),

        new("Roots Hair Studio Dianella", "roots-hair-studio-dianella", "hair", "Dianella", "6059",
            null, null, null, "@roots_dianella",
            4.6, 145, "A creative salon in Dianella offering trend-forward cuts and colour. Roots Hair Studio brings inner-city style to the northern suburbs with a passionate, skilled team.",
            ["Cut & Style from $78", "Colour from $125", "Balayage from $200", "Men's Cut $38"]),

        new("Waves Hair Salon Mandurah", "waves-hair-salon-mandurah", "hair", "Mandurah", "6210",
            null, null, null, "@waves_mandurah",
            4.7, 175, "Mandurah's premier hair salon offering everything from precision cuts to creative colour. Waves has earned a strong Peel region following through consistent quality and warm service.",
            ["Cut & Style from $78", "Balayage from $200", "Colour from $125", "Blow Dry $48"]),

        new("Locks and Co Hair Mosman Park", "locks-and-co-hair-mosman-park", "hair", "Mosman Park", "6012",
            null, null, null, "@locksandco_mp",
            4.8, 72, "A refined salon in the leafy suburb of Mosman Park. Locks and Co delivers premium cuts, colour and styling in a calm, elegant setting that reflects the suburb's sophisticated character.",
            ["Cut & Style from $95", "Balayage from $245", "Full Colour from $165", "Treatment from $70"]),

        new("Fringe Benefits Hair Cannington", "fringe-benefits-hair-cannington", "hair", "Cannington", "6107",
            null, null, null, "@fringebenefits_cannington",
            4.5, 195, "A popular salon in Cannington serving the south-eastern suburbs. Fringe Benefits offers quality cuts, colour and styling at fair prices with a reliable, experienced team.",
            ["Cut & Style from $72", "Colour from $115", "Highlights from $140", "Men's Cut $32"]),

        new("Salon Noir West Perth", "salon-noir-west-perth", "hair", "West Perth", "6005",
            null, null, null, "@salonnoir_wp",
            4.8, 88, "A dark, moody salon in West Perth with a creative, editorial vibe. Salon Noir specialises in precision cuts, rich colour and styling that makes a statement.",
            ["Cut & Style from $92", "Colour from $150", "Balayage from $235", "Editorial Styling from $120"]),

        new("Hair House Mirrabooka", "hair-house-mirrabooka", "hair", "Mirrabooka", "6061",
            null, null, null, "@hairhouse_mirrabooka",
            4.4, 210, "A diverse, inclusive salon in Mirrabooka offering cuts, colour, braiding and textured hair services. Hair House celebrates all hair types and textures with skilled, experienced stylists.",
            ["Cut & Style from $65", "Braiding from $80", "Colour from $110", "Relaxer from $95"]),

        new("Tress Hair Studio Bassendean", "tress-hair-studio-bassendean", "hair", "Bassendean", "6054",
            null, null, null, "@tress_bassendean",
            4.7, 85, "A warm, community-focused salon in Bassendean. Tress Hair Studio is praised for their friendly team, consistent quality and fair pricing that makes great hair accessible to everyone.",
            ["Cut & Style from $75", "Colour from $118", "Highlights from $140", "Blow Dry $45"]),

        new("Hair at Home Perth Mobile", "hair-at-home-perth-mobile", "hair", "Perth", "6000",
            null, "0423 567 890", null, "@hairathome_perth",
            4.8, 65, "Perth's premier mobile hairdressing service. Hair at Home brings salon-quality cuts, colour and styling directly to clients' homes — perfect for busy parents, elderly clients and those with mobility needs.",
            ["Mobile Cut from $85", "Mobile Colour from $140", "Mobile Balayage from $230"]),
    ];
}
