namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    /// <summary>
    /// Programmatically generates ~700 additional beauty providers by combining
    /// business name templates with Perth suburbs, ensuring broad coverage.
    /// </summary>
    private static RealBiz[] GenerateBulkProviders()
    {
        var templates = new (string Category, string[] NameTemplates, string[][] ServiceSets, string DescTemplate)[]
        {
            ("nails", [
                "{0} Nail Studio", "{0} Nails & Beauty", "Polished Nails {0}", "The Nail Room {0}",
                "Nail Art Studio {0}", "{0} Gel Nails", "Pretty Nails {0}", "Nail Parlour {0}",
                "Luxe Nails {0}", "{0} Nail Lounge", "Nail Haven {0}", "{0} Nails Co"
            ], [
                ["Gel Manicure $55", "Pedicure $60", "Full Set $85", "Shellac $48"],
                ["BIAB $75", "Gel Manicure $58", "Spa Pedicure $68", "Nail Art $72"],
                ["Gel Full Set $88", "Manicure $50", "Pedicure $58", "Acrylic Full Set $78"],
                ["Express Manicure $38", "Gel Manicure $52", "Pedicure $55", "Shellac $45"],
                ["SNS Dip $62", "Gel Manicure $55", "Builder Gel $72", "Pedicure $58"],
            ], "A professional nail studio in {0} offering gel manicures, pedicures and nail art. Known for quality work, clean hygiene standards and a welcoming atmosphere."),

            ("hair", [
                "{0} Hair Studio", "Hair by {0}", "{0} Hair Co", "The Hair Lounge {0}",
                "{0} Hairdressing", "Hair Lab {0}", "{0} Hair Room", "Salon {0}",
                "Hair Society {0}", "{0} Hair Design", "Style Studio {0}", "{0} Hair Bar"
            ], [
                ["Cut & Style from $78", "Colour from $120", "Balayage from $210", "Treatment from $55"],
                ["Women's Cut $82", "Men's Cut $35", "Colour from $125", "Highlights from $145"],
                ["Cut & Blow Dry from $75", "Full Colour from $130", "Half Head Foils from $155", "Keratin $250"],
                ["Cut from $72", "Root Touch Up $95", "Balayage from $200", "Toner from $45"],
                ["Restyle from $85", "Colour Correction from $280", "Hair Extensions from $350", "Treatment $62"],
            ], "A welcoming hair salon in {0} offering cuts, colour and styling for all hair types. Known for their skilled team and consistently beautiful results."),

            ("lashes", [
                "Lash Studio {0}", "{0} Lashes", "Lash Addict {0}", "The Lash Bar {0}",
                "{0} Lash Lounge", "Luxe Lashes {0}", "Lash Queen {0}", "Lash Co {0}",
                "{0} Lash Room", "Lash Beauty {0}", "{0} Eyelash Studio", "Lash Envy {0}"
            ], [
                ["Classic Lashes $118", "Hybrid Lashes $142", "Volume Lashes $165", "Lash Lift $82"],
                ["Classic Full Set $125", "Russian Volume $172", "Mega Volume $195", "Infill $68"],
                ["Natural Classic $115", "Hybrid $148", "Volume $168", "Express Infill $55"],
                ["Classic $120", "Cat Eye Hybrid $150", "Volume Full Set $170", "Lash Tint $28"],
            ], "A dedicated lash studio in {0} specialising in classic, hybrid and volume lash extensions. Known for lightweight, comfortable sets that look beautiful for weeks."),

            ("brows", [
                "Brow Studio {0}", "{0} Brows", "Brow Bar {0}", "The Brow Room {0}",
                "{0} Brow Lounge", "Brow Artistry {0}", "Arch {0}", "Brow Co {0}",
                "{0} Brow Lab", "Brow Perfection {0}", "{0} Brow House", "Brow Beauty {0}"
            ], [
                ["Brow Wax & Tint $45", "Brow Lamination $78", "Henna Brows $58", "Threading $25"],
                ["Brow Shape $28", "Brow Tint $20", "Brow Lamination $80", "Brow Wax & Tint $48"],
                ["Brow Design $35", "Lamination & Tint $85", "Henna $55", "Maintenance $22"],
                ["Threading $22", "Wax & Tint $42", "Brow Lamination $75", "Microblading from $450"],
            ], "A specialist brow studio in {0} offering expert shaping, tinting and lamination. Known for creating perfectly defined, natural-looking brows."),

            ("skin-care", [
                "{0} Skin Clinic", "Skin Studio {0}", "The Skin Bar {0}", "{0} Skin Care",
                "Glow Skin {0}", "{0} Facial Studio", "Skin Health {0}", "Radiance Skin {0}",
                "{0} Skincare Clinic", "Skin Therapy {0}", "{0} Skin Room", "Derma Studio {0}"
            ], [
                ["Express Facial $72", "Signature Facial $115", "Chemical Peel $140", "LED Therapy $68"],
                ["Hydrafacial $150", "Clinical Facial $125", "Microdermabrasion $95", "Skin Consultation $55"],
                ["Glow Facial $95", "Anti-Ageing Facial $130", "Enzyme Peel $110", "LED $65"],
                ["Basic Facial $68", "Advanced Facial $120", "Peel $105", "Microneedling from $250"],
            ], "A results-oriented skin clinic in {0} offering professional facials, peels and skin treatments. Known for honest consultations and visible improvements in skin health."),

            ("makeup", [
                "{0} Makeup Studio", "Glam Studio {0}", "Beauty Bar {0}", "{0} Makeup Artist",
                "Makeup Room {0}", "{0} Glam Bar", "Face Studio {0}", "{0} MUA Studio"
            ], [
                ["Event Makeup $95", "Bridal Makeup from $150", "Express Makeup $65", "Lesson $120"],
                ["Special Occasion $110", "Bridal from $165", "Trial $85", "Group from $80pp"],
                ["Party Makeup $85", "Bridal from $145", "Formal $95", "Makeup Lesson $110"],
            ], "A professional makeup studio in {0} offering event, bridal and special occasion makeup. Known for flawless application and making every client feel confident and beautiful."),

            ("body", [
                "{0} Massage Centre", "Body Therapy {0}", "{0} Spa", "The Body Room {0}",
                "Massage Studio {0}", "{0} Body Clinic", "Relax Massage {0}", "{0} Day Spa",
                "Wellness Massage {0}", "{0} Body & Soul", "Healing Hands {0}", "Body Bliss {0}"
            ], [
                ["Remedial Massage 60min $90", "Relaxation 60min $78", "Deep Tissue 60min $95", "30min Express $48"],
                ["Swedish Massage 60min $82", "Hot Stone 60min $95", "Couples 60min $160", "Prenatal $88"],
                ["Sports Massage 60min $92", "Lymphatic Drainage $95", "Remedial 90min $128", "Relaxation $75"],
                ["Spray Tan $48", "Body Scrub $78", "Body Wrap $95", "Massage 60min $85"],
            ], "A professional body therapy clinic in {0} offering massage, body treatments and relaxation services. Known for their skilled therapists and tranquil environment."),

            ("cosmetic", [
                "{0} Cosmetic Clinic", "Cosmetic Studio {0}", "{0} Aesthetics", "The Cosmetic Room {0}",
                "{0} Skin & Cosmetic", "Aesthetic Studio {0}", "{0} Injectable Clinic", "Beauty Medica {0}"
            ], [
                ["Anti-Wrinkle from $11/unit", "Lip Filler from $520", "Dermal Filler from $580", "Skin Booster from $350"],
                ["Anti-Wrinkle from $12/unit", "Filler from $550", "Profhilo from $700", "Bio-Remodelling from $650"],
                ["Anti-Wrinkle from $10/unit", "Lip Enhancement from $490", "Cheek Filler from $600", "PRP from $450"],
            ], "A professional cosmetic clinic in {0} offering anti-wrinkle treatments, dermal fillers and skin rejuvenation. Known for natural-looking results and thorough consultations."),

            ("wellness", [
                "{0} Wellness Centre", "Wellness Studio {0}", "{0} Holistic", "The Wellness Room {0}",
                "{0} Yoga & Wellness", "Mindful {0}", "Zen Studio {0}", "{0} Healing Centre"
            ], [
                ["Yoga Class $20", "Meditation $15", "Sound Bath $28", "Wellness Package from $95"],
                ["Pilates Class $22", "Yoga $20", "Infrared Sauna $35", "Float Therapy $65"],
                ["Reiki 60min $85", "Crystal Healing $75", "Yoga Class $18", "Meditation $12"],
            ], "A welcoming wellness centre in {0} offering yoga, meditation and holistic wellness services. Known for their inclusive atmosphere and focus on mind-body balance."),
        };

        // Perth suburbs with postcodes for generation
        var suburbs = new (string Name, string PostCode)[]
        {
            ("Perth", "6000"), ("Northbridge", "6003"), ("West Perth", "6005"),
            ("East Perth", "6004"), ("South Perth", "6151"), ("Subiaco", "6008"),
            ("Leederville", "6007"), ("Mount Lawley", "6050"), ("Highgate", "6003"),
            ("Inglewood", "6052"), ("Maylands", "6051"), ("Bayswater", "6053"),
            ("Morley", "6062"), ("Dianella", "6059"), ("Scarborough", "6019"),
            ("Innaloo", "6018"), ("Karrinyup", "6018"), ("Stirling", "6021"),
            ("Balcatta", "6021"), ("Osborne Park", "6017"), ("Claremont", "6010"),
            ("Cottesloe", "6011"), ("Nedlands", "6009"), ("Mosman Park", "6012"),
            ("Peppermint Grove", "6011"), ("Fremantle", "6160"), ("North Fremantle", "6159"),
            ("East Fremantle", "6158"), ("Victoria Park", "6100"), ("Cannington", "6107"),
            ("Canning Vale", "6155"), ("Joondalup", "6027"), ("Ellenbrook", "6069"),
            ("Midland", "6056"), ("Rockingham", "6168"), ("Mandurah", "6210"),
            ("Armadale", "6112"), ("Clarkson", "6030"), ("Butler", "6036"),
            ("Currambine", "6028"), ("Wanneroo", "6065"), ("Hillarys", "6025"),
            ("Applecross", "6153"), ("Como", "6152"), ("Belmont", "6104"),
            ("Bassendean", "6054"), ("Bentley", "6102"), ("Kalamunda", "6076"),
            ("Mundaring", "6073"), ("Floreat", "6014"), ("Mount Hawthorn", "6016"),
            ("Wembley", "6014"), ("Baldivis", "6171"), ("Cockburn Central", "6164"),
            ("Willetton", "6155"), ("Bibra Lake", "6163"), ("Spearwood", "6163"),
            ("Forrestfield", "6058"), ("Mirrabooka", "6061"),
            ("North Perth", "6006"), ("West Leederville", "6007"),
            ("Swanbourne", "6010"), ("Hamilton Hill", "6163"),
            ("Palmyra", "6157"), ("Bicton", "6157"),
            ("Beeliar", "6164"), ("Yangebup", "6164"),
            ("Waikiki", "6169"), ("Bertram", "6167"),
            ("Shenton Park", "6008"), ("Carlisle", "6101"),
            ("East Victoria Park", "6101"), ("Malaga", "6090"),
            ("Swan View", "6056"), ("Eglinton", "6034"),
            ("Aubin Grove", "6164"),
        };

        var result = new List<RealBiz>();
        var usedSlugs = new HashSet<string>();
        var ratingBase = new[] { 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0 };

        foreach (var (category, nameTemplates, serviceSets, descTemplate) in templates)
        {
            // Each category gets distributed across many suburbs
            for (int si = 0; si < suburbs.Length; si++)
            {
                var (suburbName, postCode) = suburbs[si];
                // Pick a name template using suburb index to distribute evenly
                var templateIdx = si % nameTemplates.Length;
                var nameTemplate = nameTemplates[templateIdx];
                var name = string.Format(nameTemplate, suburbName);
                var slug = name.ToLower().Replace(" ", "-").Replace("'", "").Replace("&", "and");

                if (!usedSlugs.Add(slug)) continue; // skip duplicates

                var services = serviceSets[si % serviceSets.Length];
                var rating = ratingBase[(si + category.Length) % ratingBase.Length];
                var reviewCount = 25 + ((si * 17 + category.Length * 13) % 200);
                var desc = string.Format(descTemplate, suburbName);

                result.Add(new RealBiz(
                    name, slug, category, suburbName, postCode,
                    null, null, null, null,
                    rating, reviewCount, desc, services));
            }
        }

        return result.ToArray();
    }
}
