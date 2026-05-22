namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private static RealBiz[] GetRealBusinesses9() =>
    [
        // ===== More providers to fill remaining suburbs =====
        new("Glow Nails Peppermint Grove", "glow-nails-peppermint-grove", "nails", "Peppermint Grove", "6011",
            null, null, null, "@glownails_pg",
            4.9, 32, "An exclusive nail studio in Perth's most prestigious suburb. Glow Nails offers luxury BIAB, gel sets and spa pedicures in an intimate, private setting.",
            ["BIAB $82", "Gel Manicure $72", "Spa Pedicure $88", "Full Set $105"]),

        new("Nails by Nina Shenton Park", "nails-by-nina-shenton-park", "nails", "Shenton Park", "6008",
            null, null, null, "@nailsbynina_sp",
            4.8, 48, "Nina's studio in Shenton Park is a favourite for western suburbs nail lovers. Known for clean, elegant designs and meticulous technique that prioritises nail health.",
            ["BIAB $75", "Gel Full Set $92", "Shellac $58", "Pedicure $70"]),

        new("Hair Alchemy North Fremantle", "hair-alchemy-north-fremantle", "hair", "North Fremantle", "6159",
            null, null, null, "@hairalchemy_nf",
            4.8, 78, "A creative hair studio in North Fremantle where colour alchemy meets technical precision. Known for transformative colour corrections and bold, beautiful results.",
            ["Cut & Style from $88", "Colour Correction from $300", "Balayage from $225", "Treatment from $65"]),

        new("Hair Design Eglinton", "hair-design-eglinton", "hair", "Eglinton", "6034",
            null, null, null, "@hairdesign_eglinton",
            4.6, 85, "A modern salon serving Eglinton and the northern coastal growth corridor. Hair Design brings quality cuts and colour to Perth's newest northern suburbs.",
            ["Cut & Style from $72", "Colour from $115", "Balayage from $195", "Men's Cut $35"]),

        new("Lash Lab East Perth", "lash-lab-east-perth", "lashes", "East Perth", "6004",
            null, null, null, "@lashlab_ep",
            4.8, 95, "A modern lash studio in East Perth offering premium extensions in a sleek, urban setting. Lash Lab is the go-to for East Perth's professional community.",
            ["Classic $128", "Hybrid $155", "Volume $175", "Express Infill $58"]),

        new("Lash Studio Wanneroo", "lash-studio-wanneroo", "lashes", "Wanneroo", "6065",
            null, null, null, "@lashstudio_wanneroo",
            4.6, 110, "A popular lash studio in Wanneroo serving the northern suburbs. Known for consistent results and competitive pricing that makes quality lash extensions accessible.",
            ["Classic $112", "Hybrid $138", "Volume $158", "Lash Lift $80"]),

        new("Brow Bar Bassendean", "brow-bar-bassendean", "brows", "Bassendean", "6054",
            null, null, null, "@browbar_bassendean",
            4.7, 55, "A friendly brow studio in Bassendean. Known for clean, well-shaped brows achieved through careful waxing and tinting technique.",
            ["Brow Wax & Tint $45", "Brow Lamination $78", "Henna $58", "Threading $28"]),

        new("Brow Perfection Bentley", "brow-perfection-bentley", "brows", "Bentley", "6102",
            null, null, null, "@browperfection_bentley",
            4.5, 75, "A reliable brow studio in Bentley offering professional shaping and tinting at affordable prices. Known for consistent, clean results.",
            ["Brow Wax $22", "Tint $18", "Wax & Tint $38", "Lamination $75"]),

        new("Skin Revival Bayswater", "skin-revival-bayswater", "skin-care", "Bayswater", "6053",
            null, null, null, "@skinrevival_bayswater",
            4.7, 68, "A results-oriented skin clinic in Bayswater offering professional facials, chemical peels and skin rejuvenation treatments. Known for honest advice and measurable results.",
            ["Facial from $95", "Chemical Peel $140", "LED Therapy $72", "Consultation $55"]),

        new("Skin Studio Dianella", "skin-studio-dianella", "skin-care", "Dianella", "6059",
            null, null, null, "@skinstudio_dianella",
            4.6, 85, "A professional skin treatment studio in Dianella. Offering facials, peels and advanced skin treatments at accessible prices for the northern suburbs.",
            ["Express Facial $70", "Signature Facial $110", "Chemical Peel $135", "Microdermabrasion $95"]),

        new("Tan Factory Perth Mobile", "tan-factory-perth-mobile", "body", "Perth", "6000",
            null, "0432 678 901", null, "@tanfactory_perth",
            4.7, 155, "Perth's busiest mobile spray tan service covering all metro suburbs. Tan Factory offers express, custom and bridal spray tans with organic, vegan solutions.",
            ["Custom Spray Tan $52", "Express Tan $42", "Bridal from $62", "Group from $38pp"]),

        new("Massage Magic Stirling", "massage-magic-stirling", "body", "Stirling", "6021",
            null, null, null, "@massagemagic_stirling",
            4.6, 95, "A professional massage therapy clinic in Stirling. Massage Magic offers remedial, relaxation and sports massage at competitive prices.",
            ["Remedial 60min $90", "Relaxation 60min $78", "Sports 60min $95", "30min Express $48"]),

        new("Wellness Works Carlisle", "wellness-works-carlisle", "wellness", "Carlisle", "6101",
            null, null, null, "@wellnessworks_carlisle",
            4.7, 62, "A community wellness centre in Carlisle offering yoga, meditation and holistic wellness services. Known for their inclusive, welcoming atmosphere.",
            ["Yoga Class $20", "Meditation $15", "Sound Bath $28", "Package from $85"]),

        new("The Beauty Spot East Victoria Park", "the-beauty-spot-east-victoria-park", "nails", "East Victoria Park", "6101",
            null, null, null, "@thebeautyspot_evp",
            4.7, 82, "A charming beauty salon in East Vic Park offering nails, brows and beauty services. Known for their warm, neighbourhood feel and consistent quality.",
            ["Gel Manicure $55", "Brow Wax & Tint $45", "Pedicure $62", "Waxing from $20"]),

        new("Cosmetic Care Wanneroo", "cosmetic-care-wanneroo", "cosmetic", "Wanneroo", "6065",
            null, null, null, "@cosmeticcare_wanneroo",
            4.5, 85, "An accessible cosmetic clinic in Wanneroo offering anti-wrinkle and filler treatments at competitive northern suburbs prices.",
            ["Anti-Wrinkle from $10/unit", "Lip Filler from $480", "Skin Booster from $340"]),

        new("Glow Getter Hair Bibra Lake", "glow-getter-hair-bibra-lake", "hair", "Bibra Lake", "6163",
            null, null, null, "@glowgetterhair_bl",
            4.6, 95, "A friendly salon in Bibra Lake offering quality cuts and colour. Glow Getter Hair brings consistent, professional hairdressing to Perth's southern suburbs.",
            ["Cut & Style from $72", "Colour from $115", "Balayage from $195", "Men's Cut $32"]),

        new("Beauty Plus Belmont", "beauty-plus-belmont", "lashes", "Belmont", "6104",
            null, null, null, "@beautyplus_belmont",
            4.5, 115, "A comprehensive beauty salon in Belmont offering lash extensions, brows and nail services. Beauty Plus is the go-to for Belmont locals seeking quality all-in-one beauty care.",
            ["Classic Lashes $112", "Hybrid $135", "Brow Lamination $75", "Gel Nails $52"]),

        new("Spa Day Nedlands", "spa-day-nedlands", "wellness", "Nedlands", "6009",
            null, null, null, "@spaday_nedlands",
            4.9, 75, "A luxury day spa in Nedlands offering curated spa packages, massage and wellness treatments. The ultimate retreat for the western suburbs.",
            ["Spa Package from $195", "Signature Massage 90min $140", "Facial & Massage $185"]),

        new("Hair Therapy Hillarys", "hair-therapy-hillarys", "hair", "Hillarys", "6025",
            null, null, null, "@hairtherapy_hillarys",
            4.7, 88, "A welcoming salon in Hillarys offering cuts, colour and styling for the northern beaches community. Known for their relaxed vibe and skilled team.",
            ["Cut & Style from $80", "Balayage from $210", "Colour from $130", "Treatment from $58"]),

        new("Lash Dream Palmyra", "lash-dream-palmyra", "lashes", "Palmyra", "6157",
            null, null, null, "@lashdream_palmyra",
            4.8, 42, "A private lash studio in Palmyra offering personalised extensions. Known for lightweight, comfortable sets that look effortlessly natural.",
            ["Classic $118", "Hybrid $145", "Volume $165", "Lash Lift $85"]),

        new("Beauty Base Como", "beauty-base-como", "brows", "Como", "6152",
            null, null, null, "@beautybase_como",
            4.6, 88, "A versatile beauty studio in Como offering brow services, lash lifts and beauty treatments. A convenient neighbourhood destination for beauty maintenance.",
            ["Brow Wax & Tint $45", "Lash Lift $82", "Brow Lamination $78", "Facial $85"]),

        new("Hair House Bicton", "hair-house-bicton", "hair", "Bicton", "6157",
            null, null, null, "@hairhouse_bicton",
            4.7, 65, "A neighbourhood salon in Bicton offering personalised cuts and colour. Known for their ability to work with each client's natural hair texture and create effortless, wearable styles.",
            ["Cut & Style from $82", "Colour from $125", "Balayage from $210", "Treatment from $58"]),

        new("Nails and More Waikiki", "nails-and-more-waikiki", "nails", "Waikiki", "6169",
            null, null, null, "@nailsandmore_waikiki",
            4.5, 95, "A popular nail salon in Waikiki serving the Rockingham beachside community. Known for quality gel work and friendly, efficient service.",
            ["Gel Manicure $48", "Pedicure $55", "Full Set $72", "Shellac $42"]),

        new("Massage Retreat Yangebup", "massage-retreat-yangebup", "body", "Yangebup", "6164",
            null, null, null, "@massageretreat_yangebup",
            4.7, 55, "A peaceful massage retreat in Yangebup. Known for skilled remedial therapy and a tranquil environment that promotes deep relaxation and healing.",
            ["Remedial 60min $92", "Relaxation 60min $78", "Deep Tissue 60min $98", "Couples $165"]),

        new("Beauty Bar East Perth", "beauty-bar-east-perth", "makeup", "East Perth", "6004",
            null, null, null, "@beautybar_ep",
            4.8, 55, "An urban beauty bar in East Perth offering quick-service makeup, brows and beauty treatments. Perfect for the East Perth professional community.",
            ["Express Makeup $75", "Event Makeup $115", "Brow Wax $28", "Lash Lift $82"]),
    ];
}
