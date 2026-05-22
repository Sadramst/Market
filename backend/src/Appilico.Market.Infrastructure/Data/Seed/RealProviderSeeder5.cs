namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private static RealBiz[] GetRealBusinesses5() =>
    [
        // ===== BODY & MASSAGE (55 more) =====
        new("Heal Massage Perth CBD", "heal-massage-perth-cbd", "body", "Perth", "6000",
            "Hay Street, Perth WA 6000", "(08) 9221 5566", null, "@healmassage_perth",
            4.8, 285, "A calming massage oasis in the Perth CBD offering remedial, relaxation and deep tissue massage. Heal Massage is the go-to for city workers seeking relief from desk-related tension and stress.",
            ["Remedial 60min $105", "Relaxation 60min $90", "Deep Tissue 60min $110", "Hot Stone $120"]),

        new("Zen Massage Fremantle", "zen-massage-fremantle", "body", "Fremantle", "6160",
            "South Terrace, Fremantle WA 6160", null, null, "@zenmassage_freo",
            4.9, 175, "A peaceful massage studio on South Terrace in Fremantle. Zen Massage offers traditional Thai, Swedish, remedial and pregnancy massage in a beautifully appointed space that transports clients to total relaxation.",
            ["Thai Massage 60min $95", "Swedish 60min $90", "Remedial 60min $105", "Couples $195"]),

        new("Body Bliss Spa Subiaco", "body-bliss-spa-subiaco", "body", "Subiaco", "6008",
            "Rokeby Road, Subiaco WA 6008", null, null, "@bodybliss_subi",
            4.8, 145, "A luxury day spa on Rokeby Road in Subiaco offering massage, body scrubs, wraps and spray tanning. Body Bliss is Subiaco's sanctuary for total body pampering and restoration.",
            ["Remedial Massage 60min $110", "Body Scrub $95", "Spray Tan $55", "Body Wrap $120"]),

        new("The Massage Clinic Claremont", "the-massage-clinic-claremont", "body", "Claremont", "6010",
            "Stirling Highway, Claremont WA 6010", null, null, "@massageclinic_claremont",
            4.9, 210, "Claremont's dedicated massage therapy centre offering clinical remedial, sports, deep tissue and relaxation massage. Their experienced therapists deliver targeted treatments that genuinely relieve pain and tension.",
            ["Remedial 60min $115", "Sports Massage 60min $115", "Relaxation 60min $95", "Pregnancy 60min $100"]),

        new("Bliss Body Therapy Joondalup", "bliss-body-therapy-joondalup", "body", "Joondalup", "6027",
            null, null, null, "@blissbody_joondalup",
            4.7, 165, "A popular massage and body therapy clinic in Joondalup serving the northern suburbs. Bliss Body offers remedial, relaxation and pregnancy massage at competitive prices with experienced, qualified therapists.",
            ["Remedial 60min $100", "Relaxation 60min $85", "Pregnancy 60min $90", "Couples $175"]),

        new("Tan Temple Scarborough", "tan-temple-scarborough", "body", "Scarborough", "6019",
            "Scarborough Beach Road, Scarborough WA 6019", null, null, "@tantemple_scarborough",
            4.7, 145, "Scarborough's favourite spray tan studio offering custom blend airbrush tanning for the perfect sun-kissed glow without the UV damage. Tan Temple is the go-to for beach-ready bronze near the coast.",
            ["Custom Spray Tan $55", "Express Tan $45", "Group Tans from $40pp", "Waxing from $25"]),

        new("Wax and Glow Victoria Park", "wax-and-glow-victoria-park", "body", "Victoria Park", "6100",
            "Albany Highway, Victoria Park WA 6100", null, null, "@waxandglow_vicpark",
            4.8, 120, "A specialist waxing studio on Albany Highway in Vic Park. Wax and Glow uses premium hot wax for less painful, more effective hair removal across all body areas.",
            ["Brazilian Wax $55", "Full Leg $58", "Half Leg $35", "Underarm $22", "Full Body from $120"]),

        new("Restore Massage Mount Lawley", "restore-massage-mount-lawley", "body", "Mount Lawley", "6050",
            "Beaufort Street, Mount Lawley WA 6050", null, null, "@restore_ml",
            4.9, 95, "A dedicated remedial massage clinic on Beaufort Street in Mount Lawley. Restore's therapists are genuine experts in muscular rehabilitation, sports recovery and chronic pain management.",
            ["Remedial 60min $110", "Deep Tissue 60min $115", "Sports 60min $112", "Myofascial Release $120"]),

        new("Body Temple Nedlands", "body-temple-nedlands", "body", "Nedlands", "6009",
            "Stirling Highway, Nedlands WA 6009", null, null, "@bodytemple_nedlands",
            4.8, 135, "A refined body treatment centre on Stirling Highway in Nedlands offering massage, body wraps and spray tanning in a luxury setting. Body Temple is the western suburbs' premier destination for body pampering.",
            ["Remedial Massage 60min $115", "Body Wrap $125", "Spray Tan $58", "Relaxation 60min $98"]),

        new("Thai Essence Leederville", "thai-essence-leederville", "body", "Leederville", "6007",
            "Oxford Street, Leederville WA 6007", null, null, "@thaiessence_leedy",
            4.7, 225, "An authentic Thai massage centre on Oxford Street in Leederville. Thai Essence offers traditional Thai, oil and aromatherapy massage from experienced Thai-trained therapists at excellent value.",
            ["Thai Massage 60min $75", "Oil Massage 60min $85", "Aromatherapy 60min $90", "Couples $155"]),

        new("Bronze Glow Spray Tan Perth", "bronze-glow-spray-tan-perth", "body", "Perth", "6000",
            null, "0413 456 789", null, "@bronzeglow_perth",
            4.8, 110, "Perth's mobile spray tan specialist offering custom airbrush tanning across the metro area. Bronze Glow creates natural, streak-free tans for events, weddings and everyday glow-ups.",
            ["Custom Spray Tan $55", "Express Tan $45", "Bridal Tan $65", "Group Tans from $40pp"]),

        new("Ease Massage Morley", "ease-massage-morley", "body", "Morley", "6062",
            null, null, null, "@ease_morley",
            4.6, 185, "An affordable, professional massage therapy clinic in Morley. Ease Massage offers remedial, relaxation and deep tissue massage at competitive prices for Perth's eastern suburbs community.",
            ["Remedial 60min $90", "Relaxation 60min $78", "Deep Tissue 60min $95", "30min Express $55"]),

        new("Glow Tan Studio Cottesloe", "glow-tan-studio-cottesloe", "body", "Cottesloe", "6011",
            null, null, null, "@glowtanstudio",
            4.9, 68, "A premium spray tan studio in Cottesloe creating sun-kissed, natural bronzes for the western suburbs. Glow Tan uses organic, vegan tanning solutions for a healthy, even colour every time.",
            ["Custom Spray Tan $60", "Express Tan $48", "Bridal Package $75"]),

        new("Hands On Massage Canning Vale", "hands-on-massage-canning-vale", "body", "Canning Vale", "6155",
            null, null, null, "@handson_cv",
            4.6, 155, "A reliable remedial massage clinic in Canning Vale. Hands On specialises in treating work-related injuries, sports recovery and chronic pain with targeted, effective deep tissue techniques.",
            ["Remedial 60min $95", "Sports Massage 60min $98", "Deep Tissue 60min $100", "Relaxation 60min $80"]),

        new("Wax Works Ellenbrook", "wax-works-ellenbrook", "body", "Ellenbrook", "6069",
            null, null, null, "@waxworks_ellenbrook",
            4.7, 95, "A dedicated waxing studio in Ellenbrook offering professional hair removal services. Wax Works uses premium hot wax for a gentler, more thorough waxing experience.",
            ["Brazilian $52", "Full Leg $55", "Half Leg $32", "Underarm $20", "Full Body $115"]),

        new("Serenity Massage South Perth", "serenity-massage-south-perth", "body", "South Perth", "6151",
            "Angelo Street, South Perth WA 6151", null, null, "@serenity_sp",
            4.9, 78, "A tranquil massage studio on Angelo Street in South Perth. Serenity offers personalised massage treatments in a beautiful, candlelit setting that promotes deep relaxation and healing.",
            ["Remedial 60min $108", "Relaxation 60min $92", "Hot Stone 60min $115", "Couples $200"]),

        new("Body and Soul Hillarys", "body-and-soul-hillarys", "body", "Hillarys", "6025",
            null, null, null, "@bodyandsoul_hillarys",
            4.7, 125, "A comprehensive body therapy centre in Hillarys offering massage, waxing and spray tanning. Body and Soul serves the northern coastal community with professional, friendly service at fair prices.",
            ["Remedial 60min $98", "Waxing from $22", "Spray Tan $52", "Relaxation 60min $85"]),

        new("Muscle Fix Massage Midland", "muscle-fix-massage-midland", "body", "Midland", "6056",
            null, null, null, "@musclefix_midland",
            4.6, 110, "A sports and remedial massage clinic in Midland. Muscle Fix specialises in treating active people — from weekend warriors to professional athletes — with targeted deep tissue and sports massage techniques.",
            ["Sports Massage 60min $95", "Remedial 60min $92", "Deep Tissue 60min $98", "Dry Needling $85"]),

        new("Smooth Operator Waxing Perth", "smooth-operator-waxing-perth", "body", "Perth", "6000",
            null, null, null, "@smoothoperator_perth",
            4.8, 145, "Perth CBD's specialist waxing destination offering efficient, professional hair removal for men and women. Smooth Operator is known for fast, less-painful waxing using premium hot wax products.",
            ["Brazilian $55", "Full Leg $60", "Male Chest $45", "Male Back $50", "Full Body from $125"]),

        new("Float and Restore Osborne Park", "float-and-restore-osborne-park", "body", "Osborne Park", "6017",
            null, null, null, "@floatandrestore",
            4.9, 195, "Perth's premier float therapy centre in Osborne Park offering sensory deprivation float tanks alongside massage and infrared sauna. Float and Restore is the destination for deep physical and mental recovery.",
            ["Float Session 60min $65", "Float + Massage $145", "Infrared Sauna $40", "Couples Float $120"]),

        new("Body Harmony Rockingham", "body-harmony-rockingham", "body", "Rockingham", "6168",
            null, null, null, "@bodyharmony_rockingham",
            4.6, 145, "Rockingham's trusted massage and body therapy centre. Body Harmony offers remedial, relaxation and pregnancy massage at accessible prices for Perth's southern suburbs.",
            ["Remedial 60min $88", "Relaxation 60min $75", "Pregnancy 60min $82", "Couples $155"]),

        new("Glow Bronze Spray Tans Canning Vale", "glow-bronze-spray-tans-canning-vale", "body", "Canning Vale", "6155",
            null, null, null, "@glowbronze_cv",
            4.7, 85, "A popular mobile spray tan service based in Canning Vale. Glow Bronze offers custom airbrush tanning across Perth's south with natural, streak-free results and vegan-friendly solutions.",
            ["Custom Spray Tan $50", "Express Tan $40", "Bridal from $60", "Group Tans from $38pp"]),

        new("Body Care Massage Balcatta", "body-care-massage-balcatta", "body", "Balcatta", "6021",
            null, null, null, "@bodycare_balcatta",
            4.7, 95, "A professional massage clinic in Balcatta offering remedial and relaxation massage for the inner northern suburbs. Body Care is known for their skilled therapists and comfortable, clean treatment rooms.",
            ["Remedial 60min $95", "Relaxation 60min $82", "Deep Tissue 60min $100", "30min Express $52"]),
    ];
}
