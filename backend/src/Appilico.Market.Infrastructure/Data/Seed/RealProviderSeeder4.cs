namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private static RealBiz[] GetRealBusinesses4() =>
    [
        // ===== SKIN CARE (55 more) =====
        new("Glow Skin Clinic Subiaco", "glow-skin-clinic-subiaco", "skin-care", "Subiaco", "6008",
            "Rokeby Road, Subiaco WA 6008", null, null, "@glowskinclinic_subi",
            4.9, 155, "A results-driven skin clinic on Rokeby Road in Subiaco specialising in advanced facials, chemical peels and LED therapy. Glow Skin Clinic is known for their thorough skin analysis and personalised treatment plans.",
            ["Advanced Facial $150", "Chemical Peel $180", "LED Therapy $95", "Microdermabrasion $120"]),

        new("Derma Edge Perth CBD", "derma-edge-perth-cbd", "skin-care", "Perth", "6000",
            "St Georges Terrace, Perth WA 6000", null, null, "@dermaedge_perth",
            4.8, 210, "A clinical skin treatment centre in the Perth CBD offering medical-grade peels, skin needling and advanced laser treatments. Derma Edge brings hospital-grade technology to aesthetic skincare.",
            ["Clinical Peel $190", "Skin Needling $290", "Laser from $150", "Consultation $85"]),

        new("Pure Skin Studio Cottesloe", "pure-skin-studio-cottesloe", "skin-care", "Cottesloe", "6011",
            "Napoleon Street, Cottesloe WA 6011", null, null, "@pureskin_cottesloe",
            4.9, 88, "A luxury skin studio in Cottesloe offering Biologique Recherche facials, advanced peels and skin rejuvenation treatments. Pure Skin is the western suburbs' sanctuary for those seeking transformative skin results.",
            ["BR Facial from $165", "Clinical Peel $185", "Skin Boosters from $380", "LED from $90"]),

        new("Radiant Skin Clinic Claremont", "radiant-skin-clinic-claremont", "skin-care", "Claremont", "6010",
            "Stirling Highway, Claremont WA 6010", null, null, "@radiantskin_claremont",
            4.8, 175, "Claremont's trusted skin clinic offering comprehensive facial treatments, chemical peels, microneedling and IPL. Radiant Skin delivers measurable results through evidence-based treatments and premium products.",
            ["Signature Facial $145", "Clinical Peel $175", "Microneedling $275", "IPL from $130"]),

        new("Skin Temple Mount Lawley", "skin-temple-mount-lawley", "skin-care", "Mount Lawley", "6050",
            "Walcott Street, Mount Lawley WA 6050", null, null, "@skintemple_ml",
            4.8, 135, "A holistic skin treatment centre on Walcott Street in Mount Lawley. Skin Temple combines clinical expertise with a calming, spa-like environment to deliver transformative facial treatments and skin health programmes.",
            ["Facial from $120", "Chemical Peel $165", "LED Therapy $85", "Skin Consultation $65"]),

        new("Skin Lab Fremantle", "skin-lab-fremantle", "skin-care", "Fremantle", "6160",
            "High Street, Fremantle WA 6160", null, null, "@skinlab_freo",
            4.7, 165, "An innovative skin clinic on High Street in Fremantle offering cutting-edge treatments including plasma skin tightening, radiofrequency and medical-grade peels. Skin Lab brings technology-driven skincare to the port city.",
            ["Advanced Facial $140", "RF Treatment from $250", "Clinical Peel $170", "Plasma from $300"]),

        new("Skin Bliss Joondalup", "skin-bliss-joondalup", "skin-care", "Joondalup", "6027",
            "Joondalup Drive, Joondalup WA 6027", null, null, "@skinbliss_joondalup",
            4.7, 195, "Joondalup's leading skin clinic offering professional facials, peels and advanced skin treatments. Skin Bliss has earned a strong reputation across the northern suburbs for delivering visible results and expert skin advice.",
            ["Facial from $110", "Chemical Peel $155", "Microdermabrasion $115", "LED $80"]),

        new("Luminous Skin Studio Leederville", "luminous-skin-studio-leederville", "skin-care", "Leederville", "6007",
            "Oxford Street, Leederville WA 6007", null, null, "@luminousskin_leedy",
            4.9, 72, "A boutique skin studio on Oxford Street in Leederville offering personalised facial treatments and skin health consultations. Luminous is praised for their honest approach and ability to create tailored skin programmes.",
            ["Signature Facial $135", "Hydrafacial $155", "LED Therapy $85", "Skin Programme from $500"]),

        new("Clear Skin Perth South Perth", "clear-skin-perth-south-perth", "skin-care", "South Perth", "6151",
            "Angelo Street, South Perth WA 6151", null, null, "@clearskin_sp",
            4.8, 110, "A modern skin clinic on Angelo Street in South Perth specialising in acne treatment, pigmentation correction and anti-ageing. Clear Skin Perth uses evidence-based protocols and pharmaceutical-grade products.",
            ["Acne Facial $130", "Pigmentation Peel $170", "Anti-Ageing Facial $155", "Consultation $60"]),

        new("Skin Sanctuary Nedlands", "skin-sanctuary-nedlands", "skin-care", "Nedlands", "6009",
            "Stirling Highway, Nedlands WA 6009", null, null, "@skinsanctuary_nedlands",
            4.9, 85, "A luxury skin sanctuary on Stirling Highway in Nedlands offering premium facials, advanced treatments and holistic skin health programmes. Known for their calming environment and transformative results.",
            ["Luxury Facial $170", "Clinical Peel $190", "Microneedling $290", "Skin Booster from $370"]),

        new("Fresh Face Clinic Scarborough", "fresh-face-clinic-scarborough", "skin-care", "Scarborough", "6019",
            null, null, null, "@freshface_scarborough",
            4.7, 145, "A results-oriented skin clinic near Scarborough Beach. Fresh Face specialises in post-sun skin recovery, hydration treatments and protective facial protocols for Perth's beach-going community.",
            ["Hydrating Facial $120", "Sun Recovery Treatment $140", "Clinical Peel $160", "LED $80"]),

        new("Skin Therapy Centre Morley", "skin-therapy-centre-morley", "skin-care", "Morley", "6062",
            "Walter Road, Morley WA 6062", null, null, "@skintherapy_morley",
            4.6, 185, "A comprehensive skin therapy centre in Morley offering affordable facial treatments and advanced skincare. Skin Therapy is a trusted choice for Perth's eastern suburbs residents seeking professional skin management.",
            ["Express Facial $75", "Signature Facial $115", "Chemical Peel $145", "Microdermabrasion $100"]),

        new("Derma Luxe Applecross", "derma-luxe-applecross", "skin-care", "Applecross", "6153",
            null, null, null, "@dermaluxe_applecross",
            4.9, 62, "A premium dermal therapy clinic in Applecross offering advanced facial treatments, skin needling and LED phototherapy. Derma Luxe is the go-to for Applecross locals seeking clinical-grade skincare.",
            ["Dermal Facial $155", "Skin Needling $280", "LED from $90", "Consultation $70"]),

        new("Skin Revive Canning Vale", "skin-revive-canning-vale", "skin-care", "Canning Vale", "6155",
            null, null, null, "@skinrevive_cv",
            4.6, 130, "A professional skin clinic in Canning Vale offering facials, peels and skin rejuvenation at accessible prices. Skin Revive makes advanced skincare available to Perth's southern suburbs community.",
            ["Facial from $85", "Chemical Peel $130", "Microdermabrasion $95", "LED $70"]),

        new("Skin Boutique Floreat", "skin-boutique-floreat", "skin-care", "Floreat", "6014",
            "Floreat Forum, Floreat WA 6014", null, null, "@skinboutique_floreat",
            4.8, 98, "A sophisticated skin treatment boutique inside Floreat Forum. Skin Boutique combines premium products with expert technique to deliver facials, peels and advanced treatments in a luxurious setting.",
            ["Premium Facial $145", "Hydrafacial $165", "Chemical Peel $175", "Microneedling $265"]),

        new("Skin Haven Ellenbrook", "skin-haven-ellenbrook", "skin-care", "Ellenbrook", "6069",
            null, null, null, "@skinhaven_ellenbrook",
            4.7, 75, "A warm, welcoming skin clinic in Ellenbrook bringing professional facial treatments and skin advice to the outer northern suburbs. Skin Haven is known for honest consultations and visible results.",
            ["Facial from $90", "Chemical Peel $135", "LED Therapy $75", "Skin Programme from $400"]),

        new("Glow Up Skin Studio Victoria Park", "glow-up-skin-studio-victoria-park", "skin-care", "Victoria Park", "6100",
            "Albany Highway, Victoria Park WA 6100", null, null, "@glowup_vicpark",
            4.8, 88, "A trendy skin studio on Albany Highway in Vic Park. Glow Up offers Instagram-worthy facials, hydrating treatments and skin health education for a young, beauty-savvy clientele.",
            ["Glow Facial $115", "Hydrating Treatment $100", "Clinical Peel $155", "LED $78"]),

        // ===== MAKEUP (40 more) =====
        new("Glam Squad Perth Mobile", "glam-squad-perth-mobile", "makeup", "Perth", "6000",
            null, "0421 555 789", "https://www.glamsquadperth.com.au", "@glamsquad_perth",
            4.9, 165, "Perth's premier mobile makeup team serving weddings, events and photoshoots across the greater metro area. Glam Squad brings a full team of makeup artists and hairstylists directly to the venue or home.",
            ["Bridal Makeup from $250", "Bridesmaid from $130", "Event Makeup $140", "Trial $160"]),

        new("Ivory Rose Makeup Subiaco", "ivory-rose-makeup-subiaco", "makeup", "Subiaco", "6008",
            null, null, null, "@ivoryroseperth",
            4.9, 88, "A bridal makeup specialist based in Subiaco creating timeless, elegant looks that photograph beautifully. Ivory Rose is known for flawless skin prep, gentle enhancement and a calm, reassuring presence on wedding mornings.",
            ["Bridal Makeup from $245", "Bridesmaid from $125", "Trial from $155"]),

        new("Face Forward Makeup Perth", "face-forward-makeup-perth", "makeup", "Perth", "6000",
            null, null, null, "@faceforward_perth",
            4.8, 130, "A professional makeup artistry service covering Perth metro and beyond. Face Forward specialises in bridal, editorial and corporate event makeup with a focus on skin-first application techniques.",
            ["Bridal Makeup from $240", "Corporate Event from $120", "Editorial from $200"]),

        new("Flawless Faces Joondalup", "flawless-faces-joondalup", "makeup", "Joondalup", "6027",
            null, null, null, "@flawlessfaces_joondalup",
            4.7, 145, "Joondalup's go-to makeup artist for weddings, formals and special occasions. Flawless Faces creates polished, photo-ready looks that last all day and night without touch-ups.",
            ["Bridal Makeup from $220", "Formal Makeup from $100", "Trial from $130"]),

        new("Brushed Beauty Fremantle", "brushed-beauty-fremantle", "makeup", "Fremantle", "6160",
            null, null, null, "@brushedbeauty_freo",
            4.8, 95, "A creative makeup artist based in Fremantle with a portfolio spanning bridal, editorial and high-fashion looks. Brushed Beauty brings artistic vision and technical skill to every appointment.",
            ["Bridal from $235", "Editorial from $180", "Event from $125", "Spray Tan $50"]),

        new("The Makeup Room Claremont", "the-makeup-room-claremont", "makeup", "Claremont", "6010",
            null, null, null, "@themakeuproom_claremont",
            4.9, 72, "A refined makeup studio in Claremont offering premium bridal and event makeup services. The Makeup Room uses luxury products and meticulous technique to create elegant, sophisticated looks.",
            ["Bridal from $260", "Event from $140", "Lesson from $180"]),

        new("Blush and Glow Makeup Perth", "blush-and-glow-makeup-perth", "makeup", "Perth", "6000",
            null, null, null, "@blushandglow_perth",
            4.8, 110, "A mobile makeup service covering all Perth suburbs. Blush and Glow specialises in soft-glam bridal looks and dewy, natural finishes that enhance without overpowering.",
            ["Bridal from $230", "Bridesmaid from $120", "Spray Tan $52"]),

        new("Artistry by Kate Mount Lawley", "artistry-by-kate-mount-lawley", "makeup", "Mount Lawley", "6050",
            null, null, null, "@artistrybykate_ml",
            4.9, 55, "Kate's Mount Lawley studio is the destination for editorial-quality makeup. With a background in fashion and film, Kate brings a creative edge to every bridal, event and photoshoot booking.",
            ["Bridal from $255", "Editorial from $200", "Event from $135"]),

        new("Pretty Made Up Scarborough", "pretty-made-up-scarborough", "makeup", "Scarborough", "6019",
            null, null, null, "@prettymadeup_scarborough",
            4.7, 85, "A popular mobile makeup artist based in Scarborough. Pretty Made Up creates sun-kissed, beach-ready looks for Scarborough brides and events — dewy skin, soft eyes and effortless glamour.",
            ["Bridal from $220", "Formal from $110", "Trial from $130"]),

        new("Makeup by Sophie Nedlands", "makeup-by-sophie-nedlands", "makeup", "Nedlands", "6009",
            null, null, null, "@makeupbysophie_perth",
            4.9, 48, "Sophie is one of Perth's most sought-after makeup artists, based in Nedlands. Her signature approach is fresh, luminous skin with sophisticated, timeless styling that clients love.",
            ["Bridal from $260", "Event from $140", "Makeup Lesson $190"]),

        new("Glow Getter Makeup Canning Vale", "glow-getter-makeup-canning-vale", "makeup", "Canning Vale", "6155",
            null, null, null, "@glowgetter_cv",
            4.6, 120, "A reliable, skilled mobile makeup artist based in Canning Vale. Glow Getter offers affordable bridal, event and formal makeup services across Perth's southern suburbs.",
            ["Bridal from $200", "Formal from $95", "Bridesmaid from $110"]),

        new("Dolled Up Perth Mobile", "dolled-up-perth-mobile", "makeup", "Perth", "6000",
            null, null, null, "@dolledup_perth",
            4.7, 95, "A fun, energetic mobile makeup team that brings full-glam to any venue across Perth. Dolled Up specialises in bold, dramatic looks for nights out, formals and events.",
            ["Event Makeup $120", "Formal $100", "Bridal from $230"]),

        new("Silk Makeup Studio South Perth", "silk-makeup-studio-south-perth", "makeup", "South Perth", "6151",
            null, null, null, "@silkmakeup_sp",
            4.8, 68, "A sophisticated makeup studio in South Perth offering premium makeup services. Silk creates elegant, long-lasting looks using luxury brands and meticulous application technique.",
            ["Bridal from $250", "Event from $135", "Corporate from $110"]),

        new("Beauty Mark Makeup Applecross", "beauty-mark-makeup-applecross", "makeup", "Applecross", "6153",
            null, null, null, "@beautymark_applecross",
            4.8, 52, "A talented makeup artist based in Applecross specialising in understated, elegant looks. Beauty Mark's signature is flawless, barely-there foundation that enhances natural beauty without masking it.",
            ["Bridal from $240", "Event from $130", "Trial from $150"]),

        new("Glam by Grace Ellenbrook", "glam-by-grace-ellenbrook", "makeup", "Ellenbrook", "6069",
            null, null, null, "@glambygrace_ellenbrook",
            4.7, 78, "A popular mobile makeup artist serving Ellenbrook and the outer northern suburbs. Grace creates gorgeous bridal, event and formal looks with professional products and a warm, calming presence.",
            ["Bridal from $210", "Formal from $95", "Bridesmaid from $105"]),

        new("Lush Lips Makeup Cottesloe", "lush-lips-makeup-cottesloe", "makeup", "Cottesloe", "6011",
            null, null, null, "@lushlips_cottesloe",
            4.9, 42, "A premium makeup artist based in Cottesloe creating luxury makeup looks for the western suburbs' most discerning brides and event-goers. Known for long-lasting, transfer-proof application.",
            ["Bridal from $265", "Event from $145", "Makeup Lesson $200"]),
    ];
}
