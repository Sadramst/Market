namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private static RealBiz[] GetRealBusinesses3() =>
    [
        // ===== LASHES (55 more) =====
        new("Lash Affair Studio Joondalup", "lash-affair-studio-joondalup", "lashes", "Joondalup", "6027",
            "Joondalup Drive, Joondalup WA 6027", null, null, "@lashaffair_joondalup",
            4.8, 142, "Joondalup's specialist lash studio offering classic, hybrid and volume extensions with meticulous attention to lash health. Lash Affair has built a devoted northern suburbs following through consistently beautiful, long-lasting results.",
            ["Classic Full Set $125", "Hybrid $150", "Volume $170", "Lash Lift $88", "Infill from $72"]),

        new("Luxe Lashes Subiaco", "luxe-lashes-subiaco", "lashes", "Subiaco", "6008",
            "Hay Street, Subiaco WA 6008", null, null, "@luxelashes_subi",
            4.9, 98, "A premium lash studio on Hay Street in Subiaco delivering flawless lash extensions in a calm, intimate setting. Known for their natural-looking sets that enhance without overpowering.",
            ["Classic $130", "Hybrid $155", "Volume $175", "Mega Volume $195", "Lash Lift $92"]),

        new("Lash Envy Fremantle", "lash-envy-fremantle", "lashes", "Fremantle", "6160",
            "High Street, Fremantle WA 6160", null, null, "@lashenvy_freo",
            4.7, 165, "Fremantle's go-to lash studio on historic High Street. Lash Envy creates beautiful, fluttery sets across classic, hybrid and volume styles — all with meticulous isolation and premium adhesive.",
            ["Classic $120", "Hybrid $148", "Volume $168", "Infill from $68", "Lash Lift $85"]),

        new("Flutter Lash Bar Scarborough", "flutter-lash-bar-scarborough", "lashes", "Scarborough", "6019",
            "Scarborough Beach Road, Scarborough WA 6019", null, null, "@flutterlashbar",
            4.8, 88, "A breezy lash bar near Scarborough Beach where coastal vibes meet expert lash artistry. Flutter creates full, glamorous sets perfect for the beach lifestyle — waterproof adhesive and lightweight fans that last.",
            ["Classic $118", "Hybrid $145", "Volume $165", "Lash Lift & Tint $90"]),

        new("Divine Lashes Morley", "divine-lashes-morley", "lashes", "Morley", "6062",
            "Walter Road, Morley WA 6062", null, null, "@divinelashes_morley",
            4.6, 175, "A popular lash studio in Morley serving Perth's eastern suburbs with expert classic and volume extensions. Divine Lashes is known for their efficient appointment times without compromising on quality.",
            ["Classic $115", "Hybrid $142", "Volume $162", "Infill from $65"]),

        new("Lash Queen Studio Victoria Park", "lash-queen-studio-victoria-park", "lashes", "Victoria Park", "6100",
            "Albany Highway, Victoria Park WA 6100", null, null, "@lashqueen_vicpark",
            4.8, 110, "Vic Park's favourite lash destination on Albany Highway. Lash Queen Studio delivers stunning sets in every style — from natural classics to dramatic mega volumes — with meticulous technique and genuine care.",
            ["Classic $125", "Hybrid $152", "Volume $172", "Mega Volume $192", "Lash Lift $90"]),

        new("Wisp Lash Studio Mount Lawley", "wisp-lash-studio-mount-lawley", "lashes", "Mount Lawley", "6050",
            "Beaufort Street, Mount Lawley WA 6050", null, null, "@wisplash_ml",
            4.9, 72, "A boutique studio on Beaufort Street specialising in wispy, textured lash sets that look effortlessly natural. Wisp Lash Studio has become Mount Lawley's lash destination for those who want subtle enhancement.",
            ["Wispy Classic $128", "Wispy Hybrid $155", "Wispy Volume $175", "Lash Lift $90"]),

        new("Lash Boss Perth CBD", "lash-boss-perth-cbd", "lashes", "Perth", "6000",
            "Murray Street, Perth WA 6000", null, null, "@lashboss_perth",
            4.7, 195, "A busy, high-energy lash studio in the Perth CBD that caters to city workers and visitors. Lash Boss offers quick express infills and full sets with efficient appointment scheduling and consistent quality.",
            ["Classic $120", "Hybrid $145", "Volume $165", "Express Infill $55", "Lash Lift $85"]),

        new("Lash Lab Claremont", "lash-lab-claremont", "lashes", "Claremont", "6010",
            "Stirling Highway, Claremont WA 6010", null, null, "@lashlab_claremont",
            4.8, 135, "A sophisticated lash studio in Claremont offering premium extensions with medical-grade adhesive and luxury silk fibres. Lash Lab is where Claremont's discerning clientele go for elevated, natural-looking lash work.",
            ["Classic $135", "Hybrid $158", "Volume $178", "Lash Lift $95"]),

        new("Lush Lashes Nedlands", "lush-lashes-nedlands", "lashes", "Nedlands", "6009",
            "Stirling Highway, Nedlands WA 6009", null, null, "@lushlashes_nedlands",
            4.8, 95, "A refined lash studio on Stirling Highway serving Nedlands and the western suburbs. Lush Lashes delivers consistently beautiful extensions with a focus on lash health and longevity.",
            ["Classic $128", "Hybrid $152", "Volume $172", "Infill from $70", "Lash Lift $90"]),

        new("Lash Haven Ellenbrook", "lash-haven-ellenbrook", "lashes", "Ellenbrook", "6069",
            null, null, null, "@lashhaven_ellenbrook",
            4.9, 56, "A private lash studio in Ellenbrook offering one-on-one appointments with meticulous attention to detail. Lash Haven has earned a five-star reputation for stunning extensions that last the full three weeks.",
            ["Classic $120", "Hybrid $148", "Volume $168", "Mega Volume $188", "Lash Lift $85"]),

        new("The Lash Lounge Canning Vale", "the-lash-lounge-canning-vale", "lashes", "Canning Vale", "6155",
            null, null, null, "@lashloungeperth",
            4.7, 145, "Canning Vale's favourite lash destination offering classic through mega volume sets. The Lash Lounge is praised for their consistent technique, comfortable appointments and results that keep clients returning.",
            ["Classic $118", "Hybrid $145", "Volume $165", "Infill from $65"]),

        new("Lash Artistry Karrinyup", "lash-artistry-karrinyup", "lashes", "Karrinyup", "6018",
            "Karrinyup Shopping Centre, Karrinyup WA 6018", null, null, "@lashartistry_karri",
            4.7, 125, "A skilled lash studio inside Karrinyup Shopping Centre. Lash Artistry delivers precise, well-crafted extensions in every style — from soft, natural classics to full, dramatic volumes.",
            ["Classic $125", "Hybrid $150", "Volume $170", "Lash Lift $88"]),

        new("Lash Boutique Applecross", "lash-boutique-applecross", "lashes", "Applecross", "6153",
            "Ardross Street, Applecross WA 6153", null, null, "@lashboutique_applecross",
            4.9, 68, "An intimate lash boutique in Applecross delivering personalised extensions with a focus on enhancing each client's natural eye shape. Known for their skilled mapping technique and beautiful, flattering sets.",
            ["Classic $130", "Hybrid $155", "Volume $175", "Mega Volume $195"]),

        new("Lash Doll Studio Rockingham", "lash-doll-studio-rockingham", "lashes", "Rockingham", "6168",
            null, null, null, "@lashdoll_rockingham",
            4.6, 165, "Rockingham's popular lash studio offering a full range of extension styles and lash lifts. Lash Doll Studio has built a loyal following in Perth's southern suburbs through consistent quality and friendly service.",
            ["Classic $115", "Hybrid $140", "Volume $160", "Lash Lift $82", "Infill from $62"]),

        new("Lash Luxe Cottesloe", "lash-luxe-cottesloe", "lashes", "Cottesloe", "6011",
            null, null, null, "@lashluxe_cottesloe",
            4.9, 48, "A premium lash studio in Cottesloe offering luxury extensions with the finest silk and mink fibres. Lash Luxe is where the western suburbs' most discerning clients go for elevated, perfectly crafted lash sets.",
            ["Classic $135", "Hybrid $160", "Volume $180", "Mega Volume $200"]),

        new("Lash and Co South Perth", "lash-and-co-south-perth", "lashes", "South Perth", "6151",
            "Mends Street, South Perth WA 6151", null, null, "@lashandco_sp",
            4.8, 88, "A modern lash studio on Mends Street in South Perth. Lash and Co is known for their natural-looking extensions, comfortable appointments and a warm, professional team.",
            ["Classic $125", "Hybrid $150", "Volume $170", "Lash Lift $88"]),

        new("Lash Theory Balcatta", "lash-theory-balcatta", "lashes", "Balcatta", "6021",
            null, null, null, "@lashtheory_balcatta",
            4.7, 95, "A skilled lash studio in Balcatta delivering precise, well-crafted extensions. Lash Theory is praised for their expert isolation technique and beautiful, symmetrical sets that look stunning from every angle.",
            ["Classic $120", "Hybrid $148", "Volume $168", "Infill from $68"]),

        new("Lash Co Studio Mandurah", "lash-co-studio-mandurah", "lashes", "Mandurah", "6210",
            "Mandurah Terrace, Mandurah WA 6210", null, null, "@lashco_mandurah",
            4.6, 135, "Mandurah's premier lash studio offering the full spectrum of lash services. Lash Co Studio brings city-quality extensions to the Peel region with competitive pricing and expert technique.",
            ["Classic $112", "Hybrid $138", "Volume $158", "Lash Lift $80"]),

        new("The Lash Room Como", "the-lash-room-como", "lashes", "Como", "6152",
            null, null, null, "@thelashroom_como",
            4.8, 72, "A dedicated lash studio in Como offering personalised extension services. The Lash Room is known for their detailed consultation process and ability to create the perfect lash look for every eye shape.",
            ["Classic $122", "Hybrid $148", "Volume $168", "Mega Volume $188"]),

        // ===== BROWS (45 more) =====
        new("Brow Studio Perth CBD", "brow-studio-perth-cbd", "brows", "Perth", "6000",
            "St Georges Terrace, Perth WA 6000", null, null, "@browstudio_perth",
            4.8, 195, "Perth CBD's dedicated brow studio offering expert shaping, tinting, lamination and microblading. A quick, convenient destination for city workers who want immaculate brows without the fuss.",
            ["Brow Wax & Tint $55", "Brow Lamination $88", "Microblading from $520", "Henna Brows $68"]),

        new("Arch Angels Brows Fremantle", "arch-angels-brows-fremantle", "brows", "Fremantle", "6160",
            "South Terrace, Fremantle WA 6160", null, null, "@archangels_freo",
            4.9, 78, "A boutique brow studio on South Terrace in Fremantle specialising in sculpted, natural-looking arches. Arch Angels uses gentle waxing and precision threading to create personalised brow shapes.",
            ["Brow Wax & Tint $52", "Threading $35", "Brow Lamination $85", "Henna $65"]),

        new("The Brow Bar Karrinyup", "the-brow-bar-karrinyup", "brows", "Karrinyup", "6018",
            "Karrinyup Shopping Centre, Karrinyup WA 6018", null, null, "@browbar_karrinyup",
            4.6, 225, "A convenient brow bar inside Karrinyup Shopping Centre offering quick, professional brow shaping, tinting and lamination. Perfect for grabbing a brow tidy during a shopping trip.",
            ["Brow Wax $28", "Tint $22", "Wax & Tint $45", "Lamination $82"]),

        new("Brow Envy Victoria Park", "brow-envy-victoria-park", "brows", "Victoria Park", "6100",
            "Albany Highway, Victoria Park WA 6100", null, null, "@browenvy_vicpark",
            4.8, 95, "A popular brow studio on Albany Highway in Vic Park known for expertly shaped, full brows. Brow Envy offers waxing, tinting, lamination and henna treatments for beautifully defined arches.",
            ["Brow Wax & Tint $52", "Brow Lamination $85", "Henna Brows $68", "Threading $32"]),

        new("Brow Love Studio Mount Lawley", "brow-love-studio-mount-lawley", "brows", "Mount Lawley", "6050",
            "Beaufort Street, Mount Lawley WA 6050", null, null, "@browlove_ml",
            4.9, 65, "A brow-focused studio on Beaufort Street in Mount Lawley where precision and personalisation are everything. Brow Love creates the ideal arch shape for each face through expert shaping and detailed consultation.",
            ["Brow Wax & Tint $55", "Brow Lamination $88", "Microblading from $540", "Henna $70"]),

        new("Brow Co Scarborough", "brow-co-scarborough", "brows", "Scarborough", "6019",
            null, null, null, "@browco_scarborough",
            4.7, 110, "Scarborough's dedicated brow destination offering the full range of brow services. Brow Co is known for clean, symmetrical shaping and natural-looking tints that suit each client's colouring perfectly.",
            ["Brow Wax & Tint $48", "Brow Lamination $82", "Threading $30", "Henna $62"]),

        new("Brow Queen Studio Joondalup", "brow-queen-studio-joondalup", "brows", "Joondalup", "6027",
            null, null, null, "@browqueen_joondalup",
            4.7, 145, "Joondalup's favourite brow studio delivering expert shaping and tinting. Brow Queen has built a strong northern suburbs following through consistent results and a warm, professional approach.",
            ["Brow Wax & Tint $50", "Brow Lamination $85", "Henna $65", "Threading $32"]),

        new("Brow Artistry Nedlands", "brow-artistry-nedlands", "brows", "Nedlands", "6009",
            null, null, null, "@browartistry_nedlands",
            4.9, 55, "A refined brow studio in Nedlands offering precision shaping and semi-permanent treatments. Brow Artistry combines technical skill with artistic vision to create perfectly tailored brow designs.",
            ["Brow Wax & Tint $58", "Brow Lamination $90", "Microblading from $550", "Henna $72"]),

        new("Brows by Sam Leederville", "brows-by-sam-leederville", "brows", "Leederville", "6007",
            "Oxford Street, Leederville WA 6007", null, null, "@browsbysam_leedy",
            4.9, 82, "Sam's Leederville studio is a brow lover's paradise. Known for creating perfectly balanced, natural-looking arches through expert waxing and tinting, Sam has built a devoted clientele across Perth's inner suburbs.",
            ["Brow Wax & Tint $55", "Brow Lamination $88", "Henna $68", "Threading $35"]),

        new("Brow Box Canning Vale", "brow-box-canning-vale", "brows", "Canning Vale", "6155",
            null, null, null, "@browbox_cv",
            4.6, 135, "A popular brow studio in Canning Vale offering affordable, quality brow services. Brow Box is praised for their efficient appointments and consistently clean, well-shaped brows at competitive prices.",
            ["Brow Wax $25", "Tint $18", "Wax & Tint $40", "Lamination $78"]),

        new("The Brow House Claremont", "the-brow-house-claremont", "brows", "Claremont", "6010",
            null, null, null, "@thebrowhouse_claremont",
            4.8, 115, "Claremont's premium brow destination offering elevated shaping, lamination and semi-permanent treatments. The Brow House delivers the refined, polished look that western suburbs clients expect.",
            ["Brow Wax & Tint $58", "Brow Lamination $92", "Microblading from $560", "Henna $72"]),

        new("Brow Studio South Perth", "brow-studio-south-perth", "brows", "South Perth", "6151",
            null, null, null, "@browstudio_sp",
            4.8, 78, "A dedicated brow studio in South Perth offering expert shaping and definition services. Known for creating brows that frame the face perfectly using a combination of waxing, tweezing and tinting.",
            ["Brow Wax & Tint $52", "Brow Lamination $85", "Henna $65", "Threading $30"]),

        new("Brows on Beaufort Inglewood", "brows-on-beaufort-inglewood", "brows", "Inglewood", "6052",
            "Beaufort Street, Inglewood WA 6052", null, null, "@browsbeaufort",
            4.7, 92, "A charming brow studio on the vibrant Beaufort Street strip in Inglewood. Known for skilled shaping and the ability to transform even the most unruly brows into beautifully defined arches.",
            ["Brow Wax & Tint $50", "Brow Lamination $82", "Henna $62", "Threading $30"]),

        new("Perfect Arch Morley", "perfect-arch-morley", "brows", "Morley", "6062",
            null, null, null, "@perfectarch_morley",
            4.5, 165, "A busy brow studio in Morley serving Perth's eastern suburbs. Perfect Arch delivers quick, efficient brow services at fair prices — ideal for maintaining clean, well-groomed brows between appointments.",
            ["Brow Wax $22", "Tint $18", "Wax & Tint $38", "Lamination $78"]),

        new("Brow Luxe Applecross", "brow-luxe-applecross", "brows", "Applecross", "6153",
            null, null, null, "@browluxe_applecross",
            4.9, 42, "An intimate brow studio in Applecross offering precision shaping and luxury brow treatments. Brow Luxe is where Applecross locals go for meticulously crafted arches and personalised brow design.",
            ["Brow Wax & Tint $58", "Brow Lamination $90", "Henna $70", "Threading $35"]),

        new("Brow Magic Rockingham", "brow-magic-rockingham", "brows", "Rockingham", "6168",
            null, null, null, "@browmagic_rockingham",
            4.6, 120, "Rockingham's trusted brow studio offering affordable shaping, tinting and lamination services. Brow Magic has built a loyal southern suburbs clientele through consistent quality and friendly service.",
            ["Brow Wax & Tint $45", "Brow Lamination $78", "Henna $58", "Threading $28"]),

        new("Brow Therapy Hillarys", "brow-therapy-hillarys", "brows", "Hillarys", "6025",
            null, null, null, "@browtherapy_hillarys",
            4.8, 65, "A skilled brow studio in Hillarys delivering expert shaping and treatments for the northern coastal suburbs. Brow Therapy combines precision technique with a calm, relaxing appointment experience.",
            ["Brow Wax & Tint $52", "Brow Lamination $85", "Henna $65", "Microblading from $520"]),

        new("Brow Fix Midland", "brow-fix-midland", "brows", "Midland", "6056",
            null, null, null, "@browfix_midland",
            4.5, 95, "A convenient brow studio in Midland offering affordable, professional brow services. Brow Fix is the eastern suburbs' go-to for quick, quality brow maintenance at competitive prices.",
            ["Brow Wax $22", "Tint $18", "Wax & Tint $38", "Lamination $75"]),
    ];
}
