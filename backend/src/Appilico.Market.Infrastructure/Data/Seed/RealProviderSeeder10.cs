namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private static RealBiz[] GetRealBusinesses10() =>
    [
        // ===== Final batch — ensuring every suburb has providers =====
        new("Aubin Grove Beauty Studio", "aubin-grove-beauty-studio", "nails", "Aubin Grove", "6164",
            null, null, null, "@aubingrovbebeauty",
            4.7, 65, "A welcoming beauty studio in Aubin Grove offering nails, waxing and beauty services. Known for quality work and a friendly, neighbourhood atmosphere.",
            ["Gel Manicure $52", "Brazilian Wax $48", "Pedicure $58", "Brow Wax $22"]),

        new("Balcatta Hair Design", "balcatta-hair-design", "hair", "Balcatta", "6021",
            null, null, null, "@balcattahairdesign",
            4.6, 125, "A trusted salon in Balcatta delivering reliable cuts, colour and styling. Known for their experienced team and consistent results.",
            ["Cut & Style from $75", "Colour from $118", "Highlights from $142", "Blow Dry $48"]),

        new("Bayswater Brows and Beauty", "bayswater-brows-and-beauty", "brows", "Bayswater", "6053",
            null, null, null, "@bayswaterbrows",
            4.7, 55, "A specialist brow studio in Bayswater. Known for expert shaping and tinting that creates perfectly defined, natural-looking arches.",
            ["Brow Wax & Tint $48", "Brow Lamination $80", "Henna $60", "Threading $28"]),

        new("Beeliar Beauty Lounge", "beeliar-beauty-lounge", "lashes", "Beeliar", "6164",
            null, null, null, "@beeliarlounge",
            4.6, 78, "A modern beauty lounge in Beeliar offering lash extensions and beauty services. Known for their welcoming atmosphere and consistent quality.",
            ["Classic Lashes $112", "Hybrid $135", "Lash Lift $80", "Brow Lamination $75"]),

        new("Bentley Skin Clinic", "bentley-skin-clinic", "skin-care", "Bentley", "6102",
            null, null, null, "@bentleyskinclinic",
            4.5, 65, "A professional skin clinic in Bentley offering facials and skin treatments at accessible prices. Known for honest consultations and visible results.",
            ["Express Facial $68", "Signature Facial $105", "Chemical Peel $130", "LED $65"]),

        new("Bertram Hair and Beauty", "bertram-hair-and-beauty", "hair", "Bertram", "6167",
            null, null, null, "@bertramhair",
            4.5, 55, "A friendly salon in Bertram serving the southern suburbs growth corridor. Known for quality cuts and colour at affordable prices.",
            ["Cut & Style from $68", "Colour from $110", "Highlights from $135", "Men's Cut $30"]),

        new("Carlisle Beauty Hub", "carlisle-beauty-hub", "nails", "Carlisle", "6101",
            null, null, null, "@carlislebeautyhub",
            4.6, 72, "A convenient beauty hub in Carlisle offering nails, waxing and beauty services. Known for friendly staff and consistent results.",
            ["Gel Manicure $50", "Brazilian Wax $45", "Pedicure $55", "Brow Wax $20"]),

        new("East Fremantle Hair Studio", "east-fremantle-hair-studio", "hair", "East Fremantle", "6158",
            null, null, null, "@eastfreohair",
            4.8, 55, "A charming salon in East Fremantle offering personalised cuts and colour. Known for their ability to create effortless styles that suit each client's lifestyle.",
            ["Cut & Style from $85", "Colour from $130", "Balayage from $215", "Treatment from $62"]),

        new("Floreat Lash Studio", "floreat-lash-studio", "lashes", "Floreat", "6014",
            null, null, null, "@floreatlash",
            4.8, 52, "A dedicated lash studio in Floreat offering premium extensions in a calm, comfortable setting. Known for natural-looking sets that enhance each client's features.",
            ["Classic $128", "Hybrid $152", "Volume $172", "Lash Lift $88"]),

        new("Forrestfield Nails", "forrestfield-nails", "nails", "Forrestfield", "6058",
            null, null, null, "@forrestfieldnails",
            4.5, 85, "A popular nail salon in Forrestfield offering quality gel and acrylic services at competitive prices. Known for efficient service and a wide range of styles.",
            ["Gel Manicure $48", "Full Set $72", "Pedicure $55", "Acrylic $75"]),

        new("Hamilton Hill Beauty", "hamilton-hill-beauty", "brows", "Hamilton Hill", "6163",
            null, null, null, "@hamiltonhillbeauty",
            4.6, 58, "A friendly beauty studio in Hamilton Hill offering brow services and beauty treatments. Known for their warm, welcoming approach.",
            ["Brow Wax & Tint $42", "Brow Lamination $75", "Lash Lift $78", "Facial $80"]),

        new("Highgate Hair Collective", "highgate-hair-collective", "hair", "Highgate", "6003",
            null, null, null, "@highgatehair",
            4.8, 75, "A creative hair collective in Highgate bringing together independent stylists. Known for their artistic approach and vibrant salon atmosphere.",
            ["Cut & Style from $85", "Colour from $135", "Balayage from $220", "Fashion Colour from $170"]),

        new("Inglewood Skin and Beauty", "inglewood-skin-and-beauty", "skin-care", "Inglewood", "6052",
            null, null, null, "@inglewoodskin",
            4.7, 62, "A professional skin and beauty clinic on Beaufort Street in Inglewood. Known for quality facials and skin treatments at fair prices.",
            ["Facial from $90", "Chemical Peel $135", "Microdermabrasion $95", "LED $68"]),

        new("Kalamunda Wellness Centre", "kalamunda-wellness-centre", "wellness", "Kalamunda", "6076",
            null, null, null, "@kalamundawellness",
            4.8, 45, "A peaceful wellness centre in the Perth Hills. Known for their yoga classes, meditation sessions and holistic approach to health and wellbeing.",
            ["Yoga Class $20", "Meditation $15", "Massage 60min $85", "Package from $110"]),

        new("Leederville Cosmetic Clinic", "leederville-cosmetic-clinic", "cosmetic", "Leederville", "6007",
            null, null, null, "@leedervillecosmetic",
            4.8, 85, "A boutique cosmetic clinic on Oxford Street in Leederville. Known for natural-looking injectable treatments and thorough consultations.",
            ["Anti-Wrinkle from $12/unit", "Filler from $550", "Profhilo from $720"]),

        new("Malaga Massage Centre", "malaga-massage-centre", "body", "Malaga", "6090",
            null, null, null, "@malagamassage",
            4.5, 125, "A professional massage centre in the Malaga business precinct. Known for their skilled therapists and convenient location for the surrounding business community.",
            ["Remedial 60min $88", "Relaxation 60min $75", "Deep Tissue 60min $92", "30min Express $48"]),

        new("Mirrabooka Beauty Centre", "mirrabooka-beauty-centre", "nails", "Mirrabooka", "6061",
            null, null, null, "@mirrabookabeauty",
            4.4, 155, "A diverse beauty centre in Mirrabooka offering nails, braiding and beauty services. Known for their inclusive approach and affordable pricing.",
            ["Gel Manicure $45", "Braiding from $60", "Pedicure $52", "Waxing from $18"]),

        new("Mount Hawthorn Skin Studio", "mount-hawthorn-skin-studio", "skin-care", "Mount Hawthorn", "6016",
            null, null, null, "@mthawthorskin",
            4.8, 55, "A boutique skin studio in Mount Hawthorn offering personalised facial treatments and skin consultations. Known for their knowledgeable, caring approach.",
            ["Signature Facial $130", "Hydrafacial $150", "Chemical Peel $165", "LED $82"]),

        new("Mundaring Beauty Retreat", "mundaring-beauty-retreat", "wellness", "Mundaring", "6073",
            null, null, null, "@mundaringretreat",
            4.8, 38, "A serene beauty retreat nestled in the Perth Hills. Known for their relaxing spa treatments and peaceful, bushland-surrounded setting.",
            ["Spa Package from $150", "Massage 60min $90", "Facial $95", "Meditation $20"]),

        new("North Fremantle Hair Co", "north-fremantle-hair-co", "hair", "North Fremantle", "6159",
            null, null, null, "@northfreohairco",
            4.8, 62, "A modern salon in North Fremantle. Known for their creative colour work and the ability to create effortless, coastal-inspired styles.",
            ["Cut & Style from $85", "Balayage from $220", "Colour from $135", "Treatment from $60"]),

        new("Northbridge Beauty Bar", "northbridge-beauty-bar", "makeup", "Northbridge", "6003",
            null, null, null, "@northbridgebeautybar",
            4.7, 95, "A vibrant beauty bar in Northbridge offering pre-event makeup, express beauty treatments and spray tanning. The pre-night-out destination for Perth's entertainment precinct.",
            ["Event Makeup $95", "Express Makeup $65", "Spray Tan $48", "Lash Lift $78"]),

        new("Spearwood Massage Therapy", "spearwood-massage-therapy", "body", "Spearwood", "6163",
            null, null, null, "@spearwoodmassage",
            4.6, 72, "A professional massage therapy clinic in Spearwood. Known for their skilled remedial therapists and comfortable, clean treatment rooms.",
            ["Remedial 60min $88", "Relaxation 60min $75", "Sports 60min $92", "Couples $155"]),

        new("Swan View Beauty", "swan-view-beauty", "nails", "Swan View", "6056",
            null, null, null, "@swanviewbeauty",
            4.5, 52, "A welcoming beauty salon in Swan View offering nails and beauty services for the Perth Hills corridor. Known for their affordable pricing and friendly team.",
            ["Gel Manicure $45", "Pedicure $52", "Waxing from $18", "Brow Wax $20"]),

        new("Swanbourne Skin Clinic", "swanbourne-skin-clinic", "skin-care", "Swanbourne", "6010",
            null, null, null, "@swanbourneskin",
            4.9, 35, "A premium skin clinic in the quiet suburb of Swanbourne. Known for their advanced facial treatments and personalised skin health programmes.",
            ["Premium Facial $155", "Clinical Peel $180", "Skin Needling $275", "LED $88"]),

        new("West Leederville Hair Lounge", "west-leederville-hair-lounge", "hair", "West Leederville", "6007",
            null, null, null, "@westleedyhair",
            4.7, 85, "A stylish salon in West Leederville offering quality cuts, colour and styling. Known for their warm atmosphere and skilled team.",
            ["Cut & Style from $82", "Colour from $128", "Balayage from $215", "Blow Dry $52"]),

        new("Willetton Beauty Spa", "willetton-beauty-spa", "body", "Willetton", "6155",
            null, null, null, "@willettonbeautyspa",
            4.6, 95, "A full-service beauty spa in Willetton offering massage, waxing and spa treatments. Known for their comprehensive menu and competitive pricing.",
            ["Remedial Massage 60min $88", "Brazilian Wax $48", "Spray Tan $45", "Facial $85"]),

        new("Yangebup Hair Studio", "yangebup-hair-studio", "hair", "Yangebup", "6164",
            null, null, null, "@yangebup_hair",
            4.5, 55, "A neighbourhood salon in Yangebup. Known for their reliable cuts, colour and styling at fair prices for the Cockburn community.",
            ["Cut & Style from $68", "Colour from $112", "Highlights from $135", "Men's Cut $30"]),

        new("Scarborough Cosmetic Studio", "scarborough-cosmetic-studio", "cosmetic", "Scarborough", "6019",
            null, null, null, "@scarboroughcosmetic",
            4.7, 85, "A modern cosmetic studio near Scarborough Beach. Known for natural-looking anti-wrinkle and filler treatments administered by experienced cosmetic nurses.",
            ["Anti-Wrinkle from $11/unit", "Lip Filler from $520", "Skin Booster from $370"]),

        new("Mosman Park Beauty", "mosman-park-beauty", "nails", "Mosman Park", "6012",
            null, null, null, "@mosmanparkbeauty",
            4.8, 42, "An elegant beauty studio in Mosman Park offering premium nail and beauty services. Known for their attention to detail and refined salon experience.",
            ["BIAB $78", "Gel Manicure $68", "Spa Pedicure $82", "Brow Wax & Tint $52"]),
    ];
}
