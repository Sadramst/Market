namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private static RealBiz[] GetRealBusinesses6() =>
    [
        // ===== COSMETIC (45 more) =====
        new("Aesthetica Clinic Perth CBD", "aesthetica-clinic-perth-cbd", "cosmetic", "Perth", "6000",
            "St Georges Terrace, Perth WA 6000", "(08) 9221 8899", null, "@aesthetica_perth",
            4.9, 245, "A premier cosmetic clinic on St Georges Terrace offering anti-wrinkle, dermal fillers and skin rejuvenation treatments by experienced cosmetic nurses. Aesthetica is praised for natural-looking results and thorough consultations.",
            ["Anti-Wrinkle from $12/unit", "Lip Filler from $550", "Cheek Filler from $650", "Skin Booster from $400"]),

        new("Luxe Cosmetic Clinic Subiaco", "luxe-cosmetic-clinic-subiaco", "cosmetic", "Subiaco", "6008",
            "Rokeby Road, Subiaco WA 6008", null, null, "@luxecosmetic_subi",
            4.9, 175, "A high-end cosmetic clinic on Rokeby Road in Subiaco. Luxe delivers injectable treatments, skin boosters and advanced aesthetic services with a focus on subtle, elegant enhancement.",
            ["Anti-Wrinkle from $13/unit", "Filler from $580", "Profhilo from $750", "Skin Booster from $420"]),

        new("Perth Cosmetic Centre Claremont", "perth-cosmetic-centre-claremont", "cosmetic", "Claremont", "6010",
            "Stirling Highway, Claremont WA 6010", "(08) 9384 6633", null, "@perthcosmetic_claremont",
            4.8, 310, "One of Perth's most established cosmetic centres, offering comprehensive injectable treatments, laser therapy and non-surgical facelifts from their prestigious Claremont location.",
            ["Anti-Wrinkle from $12/unit", "Filler from $560", "Thread Lift from $1800", "Laser from $200"]),

        new("Cosmetic Solutions Fremantle", "cosmetic-solutions-fremantle", "cosmetic", "Fremantle", "6160",
            null, null, null, "@cosmeticsolutions_freo",
            4.7, 145, "A trusted cosmetic clinic in Fremantle offering anti-wrinkle treatments, dermal fillers and skin rejuvenation. Known for their honest approach and natural-looking results that enhance without altering.",
            ["Anti-Wrinkle from $11/unit", "Lip Filler from $520", "Skin Booster from $380"]),

        new("Enhance Aesthetics Mount Lawley", "enhance-aesthetics-mount-lawley", "cosmetic", "Mount Lawley", "6050",
            "Beaufort Street, Mount Lawley WA 6050", null, null, "@enhance_ml",
            4.8, 125, "A boutique aesthetic clinic on Beaufort Street in Mount Lawley. Enhance offers personalised cosmetic treatments with thorough consultations and a commitment to natural-looking enhancement.",
            ["Anti-Wrinkle from $12/unit", "Filler from $550", "Profhilo from $720", "Consultation $50"]),

        new("Rejuvenate Clinic Cottesloe", "rejuvenate-clinic-cottesloe", "cosmetic", "Cottesloe", "6011",
            null, null, null, "@rejuvenate_cottesloe",
            4.9, 88, "A premium cosmetic clinic in Cottesloe delivering anti-ageing treatments in a luxury, private setting. Rejuvenate is the western suburbs' destination for subtle, expertly administered cosmetic enhancements.",
            ["Anti-Wrinkle from $13/unit", "Filler from $580", "Skin Booster from $420", "LED from $90"]),

        new("Cosmetic Edge Nedlands", "cosmetic-edge-nedlands", "cosmetic", "Nedlands", "6009",
            null, null, null, "@cosmetic_edge_nedlands",
            4.8, 165, "A trusted cosmetic clinic in Nedlands offering the full spectrum of injectable treatments and non-surgical aesthetic services. Known for their experienced team and consistently natural results.",
            ["Anti-Wrinkle from $12/unit", "Filler from $560", "Thread Lift from $1600"]),

        new("Glow Cosmetic Clinic Scarborough", "glow-cosmetic-clinic-scarborough", "cosmetic", "Scarborough", "6019",
            null, null, null, "@glowcosmetic_scarborough",
            4.7, 110, "A modern cosmetic clinic near Scarborough Beach offering anti-wrinkle, fillers and skin treatments. Glow Cosmetic brings professional aesthetic services to Perth's beachside northern suburbs.",
            ["Anti-Wrinkle from $11/unit", "Lip Filler from $530", "Skin Booster from $380"]),

        new("Prestige Aesthetics South Perth", "prestige-aesthetics-south-perth", "cosmetic", "South Perth", "6151",
            null, null, null, "@prestige_sp",
            4.9, 72, "A refined aesthetic clinic in South Perth offering premium injectable treatments and non-surgical face lifting. Prestige is known for their conservative approach and beautifully subtle results.",
            ["Anti-Wrinkle from $13/unit", "Filler from $580", "Bio-Remodelling from $780"]),

        new("The Cosmetic Lounge Morley", "the-cosmetic-lounge-morley", "cosmetic", "Morley", "6062",
            null, null, null, "@cosmeticlounge_morley",
            4.6, 155, "An accessible cosmetic treatment clinic in Morley offering anti-wrinkle, fillers and skin rejuvenation at competitive prices. The Cosmetic Lounge makes aesthetic treatments accessible to Perth's eastern suburbs.",
            ["Anti-Wrinkle from $10/unit", "Lip Filler from $490", "Skin Booster from $350"]),

        new("Visage Aesthetics Leederville", "visage-aesthetics-leederville", "cosmetic", "Leederville", "6007",
            null, null, null, "@visage_leedy",
            4.8, 95, "A boutique aesthetic clinic in Leederville offering personalised cosmetic treatments. Visage is known for their artistic approach to facial enhancement and commitment to natural, harmonious results.",
            ["Anti-Wrinkle from $12/unit", "Filler from $560", "Profhilo from $740"]),

        new("Cosmetic Nurse Perth Mobile", "cosmetic-nurse-perth-mobile", "cosmetic", "Perth", "6000",
            null, null, null, "@cosmeticnurse_perth",
            4.7, 130, "Perth's premium mobile cosmetic nurse offering anti-wrinkle, fillers and skin boosters in the comfort of home, office or event venue. Fully insured with hospital-grade products and protocols.",
            ["Anti-Wrinkle from $12/unit", "Lip Filler from $540", "Skin Booster from $390"]),

        new("Face Clinic Applecross", "face-clinic-applecross", "cosmetic", "Applecross", "6153",
            null, null, null, "@faceclinic_applecross",
            4.9, 62, "An intimate aesthetic clinic in Applecross offering expert injectable treatments in a private, calming setting. Face Clinic is praised for their detailed consultations and meticulous technique.",
            ["Anti-Wrinkle from $13/unit", "Filler from $570", "Bio-Remodelling from $760"]),

        new("InjectAbility Clinic Victoria Park", "injectability-clinic-victoria-park", "cosmetic", "Victoria Park", "6100",
            null, null, null, "@injectability_vicpark",
            4.7, 145, "A professional cosmetic injectable clinic in Vic Park. InjectAbility offers anti-wrinkle, dermal fillers and skin treatments with transparent pricing and honest consultations.",
            ["Anti-Wrinkle from $11/unit", "Lip Filler from $520", "Cheek Filler from $600"]),

        new("Cosmetic Haven Ellenbrook", "cosmetic-haven-ellenbrook", "cosmetic", "Ellenbrook", "6069",
            null, null, null, "@cosmetichaven_ellenbrook",
            4.7, 75, "A convenient cosmetic clinic in Ellenbrook bringing professional injectable treatments to Perth's growing outer northern suburbs. Cosmetic Haven offers quality treatments at accessible prices.",
            ["Anti-Wrinkle from $10/unit", "Lip Filler from $480", "Skin Booster from $350"]),

        new("Elite Aesthetics Canning Vale", "elite-aesthetics-canning-vale", "cosmetic", "Canning Vale", "6155",
            null, null, null, "@elite_cv",
            4.6, 110, "A professional cosmetic clinic in Canning Vale offering anti-wrinkle, fillers and skin rejuvenation treatments. Elite Aesthetics brings expert cosmetic care to Perth's southern suburbs.",
            ["Anti-Wrinkle from $11/unit", "Filler from $530", "Skin Booster from $370"]),

        new("Refresh Cosmetics Karrinyup", "refresh-cosmetics-karrinyup", "cosmetic", "Karrinyup", "6018",
            null, null, null, "@refresh_karrinyup",
            4.7, 135, "A modern cosmetic clinic near Karrinyup Shopping Centre. Refresh offers anti-wrinkle, dermal fillers and advanced skin treatments with a focus on refreshed, natural-looking results.",
            ["Anti-Wrinkle from $12/unit", "Filler from $550", "Profhilo from $720"]),

        new("Skin and Cosmetic Clinic Rockingham", "skin-cosmetic-clinic-rockingham", "cosmetic", "Rockingham", "6168",
            null, null, null, "@skincosmetic_rockingham",
            4.5, 165, "A comprehensive skin and cosmetic clinic in Rockingham serving Perth's southern corridor. Offering injectable treatments, laser therapy and advanced skin rejuvenation at competitive prices.",
            ["Anti-Wrinkle from $10/unit", "Lip Filler from $490", "Laser from $120"]),

        new("The Aesthetic Room Floreat", "the-aesthetic-room-floreat", "cosmetic", "Floreat", "6014",
            null, null, null, "@aestheticroom_floreat",
            4.8, 78, "A sophisticated aesthetic treatment room in Floreat offering premium injectable treatments and advanced skincare. Known for their conservative approach and beautiful, age-appropriate results.",
            ["Anti-Wrinkle from $13/unit", "Filler from $580", "Bio-Remodelling from $760"]),

        // ===== WELLNESS (45 more) =====
        new("Bodhi Day Spa Subiaco", "bodhi-day-spa-subiaco", "wellness", "Subiaco", "6008",
            "Rokeby Road, Subiaco WA 6008", null, null, "@bodhidayspa_subi",
            4.9, 185, "A beautiful day spa on Rokeby Road in Subiaco offering signature spa packages, massage, facials and body treatments. Bodhi is Subiaco's ultimate wellness escape — a place to truly unwind and restore.",
            ["Day Spa Package from $195", "Signature Massage 90min $135", "Facial & Massage $180"]),

        new("The Wellness Room Claremont", "the-wellness-room-claremont", "wellness", "Claremont", "6010",
            null, null, null, "@wellnessroom_claremont",
            4.8, 155, "A holistic wellness studio in Claremont offering naturopathy, acupuncture, yoga and meditation alongside traditional spa treatments. The Wellness Room takes a whole-person approach to beauty and health.",
            ["Acupuncture $95", "Naturopathy Consult $120", "Meditation Class $25", "Wellness Package from $180"]),

        new("Restore Wellness Perth CBD", "restore-wellness-perth-cbd", "wellness", "Perth", "6000",
            null, null, null, "@restore_perth",
            4.8, 210, "A modern wellness centre in the Perth CBD offering infrared sauna, cold plunge, IV drip therapy and guided meditation. Restore brings biohacking-inspired wellness to Perth's professionals.",
            ["Infrared Sauna $45", "Cold Plunge $35", "IV Drip from $195", "Sauna + Plunge $65"]),

        new("Soul Sanctuary Fremantle", "soul-sanctuary-fremantle", "wellness", "Fremantle", "6160",
            null, null, null, "@soulsanctuary_freo",
            4.9, 95, "A peaceful wellness retreat in Fremantle offering yoga, sound healing, meditation and holistic therapy. Soul Sanctuary embodies Freo's creative, spiritual community at its most welcoming.",
            ["Yoga Class $25", "Sound Healing $40", "Meditation Session $20", "Wellness Package from $120"]),

        new("Bliss Wellness Centre Joondalup", "bliss-wellness-centre-joondalup", "wellness", "Joondalup", "6027",
            null, null, null, "@blisswellness_joondalup",
            4.7, 145, "Joondalup's comprehensive wellness centre offering day spa services, infrared sauna and relaxation therapy. Bliss brings full wellness experiences to Perth's northern suburbs.",
            ["Day Spa Package from $160", "Infrared Sauna $40", "Relaxation Massage 60min $85"]),

        new("Calm Waters Wellness Cottesloe", "calm-waters-wellness-cottesloe", "wellness", "Cottesloe", "6011",
            null, null, null, "@calmwaters_cottesloe",
            4.9, 65, "A premium coastal wellness studio in Cottesloe. Calm Waters offers ocean-inspired treatments, float therapy, massage and meditation in a light-filled space steps from the Indian Ocean.",
            ["Float Therapy $70", "Ocean Ritual Massage $130", "Meditation Session $25"]),

        new("Wellness Hub Nedlands", "wellness-hub-nedlands", "wellness", "Nedlands", "6009",
            null, null, null, "@wellnesshub_nedlands",
            4.8, 110, "A comprehensive wellness hub in Nedlands offering yoga, pilates, acupuncture and holistic health consultations. A one-stop wellness destination for the western suburbs.",
            ["Acupuncture $90", "Yoga Class $22", "Pilates $25", "Wellness Consult $110"]),

        new("Radiant Wellness Mount Lawley", "radiant-wellness-mount-lawley", "wellness", "Mount Lawley", "6050",
            null, null, null, "@radiant_ml",
            4.8, 82, "A holistic wellness studio on Beaufort Street in Mount Lawley offering naturopathy, kinesiology and wellness coaching. Radiant takes a whole-person approach to health, beauty and vitality.",
            ["Naturopathy $115", "Kinesiology $95", "Wellness Coaching $85", "Package from $250"]),

        new("The Float Centre Osborne Park", "the-float-centre-osborne-park", "wellness", "Osborne Park", "6017",
            null, null, null, "@floatcentre_op",
            4.9, 175, "Perth's original float therapy centre in Osborne Park. The Float Centre offers sensory deprivation float tanks for deep relaxation, pain relief and mental clarity — a truly unique wellness experience.",
            ["Single Float $65", "Double Float $55pp", "Float + Massage $135", "5-Float Pack $275"]),

        new("Harmony Wellness Morley", "harmony-wellness-morley", "wellness", "Morley", "6062",
            null, null, null, "@harmony_morley",
            4.6, 125, "A community wellness centre in Morley offering affordable yoga, meditation and wellness services. Harmony is praised for their inclusive, welcoming atmosphere and diverse class schedule.",
            ["Yoga Class $20", "Meditation $15", "Sound Bath $30", "Wellness Package from $100"]),

        new("Pure Wellness South Perth", "pure-wellness-south-perth", "wellness", "South Perth", "6151",
            null, null, null, "@purewellness_sp",
            4.8, 68, "A refined wellness studio in South Perth offering bespoke wellness programmes, infrared sauna and holistic therapy. Pure Wellness caters to South Perth's health-conscious community.",
            ["Infrared Sauna $42", "Wellness Programme from $350", "Holistic Massage 60min $105"]),

        new("Balance Wellness Studio Victoria Park", "balance-wellness-studio-victoria-park", "wellness", "Victoria Park", "6100",
            null, null, null, "@balance_vicpark",
            4.7, 95, "A vibrant wellness studio in Vic Park offering yoga, pilates, breathwork and wellness workshops. Balance is the go-to for Albany Highway's health and fitness community.",
            ["Yoga Class $22", "Pilates $25", "Breathwork $30", "Workshop from $55"]),

        new("Tranquil Day Spa Mandurah", "tranquil-day-spa-mandurah", "wellness", "Mandurah", "6210",
            null, null, null, "@tranquil_mandurah",
            4.7, 135, "Mandurah's favourite day spa offering signature spa packages, massage and relaxation treatments. Tranquil brings the full day spa experience to the Peel region.",
            ["Day Spa Package from $150", "Massage 60min $85", "Facial from $90"]),

        new("Zenith Wellness Ellenbrook", "zenith-wellness-ellenbrook", "wellness", "Ellenbrook", "6069",
            null, null, null, "@zenith_ellenbrook",
            4.7, 55, "A growing wellness destination in Ellenbrook offering yoga, meditation and holistic wellness services. Zenith brings inner-city wellness experiences to Perth's outer northern suburbs.",
            ["Yoga Class $20", "Meditation $15", "Holistic Massage $90", "Package from $120"]),

        new("Oasis Wellness Rockingham", "oasis-wellness-rockingham", "wellness", "Rockingham", "6168",
            null, null, null, "@oasis_rockingham",
            4.6, 110, "A full-service wellness centre in Rockingham offering day spa treatments, sauna, massage and relaxation therapy. Oasis provides a haven of calm for Perth's southern suburbs.",
            ["Day Spa Package from $140", "Infrared Sauna $38", "Massage 60min $82"]),

        new("The Healing Space Leederville", "the-healing-space-leederville", "wellness", "Leederville", "6007",
            null, null, null, "@healingspace_leedy",
            4.9, 72, "A peaceful healing sanctuary on Oxford Street in Leederville. The Healing Space offers Reiki, crystal healing, sound therapy and energy work for those seeking alternative approaches to wellness.",
            ["Reiki Session $90", "Crystal Healing $85", "Sound Therapy $45", "Energy Work $95"]),

        new("Waves Wellness Hillarys", "waves-wellness-hillarys", "wellness", "Hillarys", "6025",
            null, null, null, "@waves_hillarys",
            4.7, 85, "A coastal wellness studio in Hillarys offering ocean-inspired treatments, meditation and yoga. Waves channels the calming energy of the northern beaches into holistic wellness experiences.",
            ["Ocean Meditation $25", "Yoga Class $22", "Massage 60min $90", "Package from $130"]),
    ];
}
