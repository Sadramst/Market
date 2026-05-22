namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private static RealBiz[] GetRealBusinesses2() =>
    [
        // ===== NAILS (55 more) =====
        new("Polished Beauty Bar Joondalup", "polished-beauty-bar-joondalup", "nails", "Joondalup", "6027",
            "Shop 12, Lakeside Joondalup, Joondalup WA 6027", "(08) 9300 1455", null, "@polishedbeautybar",
            4.7, 142, "A trendy nail bar inside Lakeside Joondalup offering express and luxury nail services. Polished Beauty Bar is a northern suburbs favourite for quick, quality gel sets and pedicures that fit around busy shopping trips.",
            ["Gel Manicure $62", "Pedicure $72", "Gel Full Set $92", "Nail Art from $12"]),

        new("Nailz on Beaufort Inglewood", "nailz-on-beaufort-inglewood", "nails", "Inglewood", "6052",
            "816 Beaufort Street, Inglewood WA 6052", null, null, "@nailzonbeaufort",
            4.8, 98, "Inglewood's go-to nail studio on the vibrant Beaufort Street strip. Known for creative nail art, clean and consistent technique, and a loyal neighbourhood clientele who love the convenience and quality.",
            ["Gel Full Set $88", "BIAB $72", "Classic Manicure $42", "Pedicure $68"]),

        new("Pretty Nails Morley", "pretty-nails-morley", "nails", "Morley", "6062",
            "Galleria Shopping Centre, Morley WA 6062", "(08) 9276 3344", null, null,
            4.5, 210, "A well-established nail salon inside Morley Galleria that has been serving Perth's eastern suburbs for years. Pretty Nails delivers consistent results at affordable prices with a professional, efficient team.",
            ["Gel Manicure $55", "Pedicure $65", "Full Set $78", "Polish Change $22"]),

        new("Luxe Nails and Spa Karrinyup", "luxe-nails-and-spa-karrinyup", "nails", "Karrinyup", "6018",
            "Karrinyup Shopping Centre, Karrinyup WA 6018", "(08) 9344 5566", null, "@luxenailskarri",
            4.6, 175, "Positioned inside the premium Karrinyup Shopping Centre, Luxe Nails and Spa offers elevated nail services with a relaxing spa atmosphere. Full gel sets, BIAB, spa pedicures and express services for busy shoppers.",
            ["Gel Manicure $65", "Spa Pedicure $80", "Gel Full Set $95", "BIAB $75"]),

        new("Nailed It Studio Ellenbrook", "nailed-it-studio-ellenbrook", "nails", "Ellenbrook", "6069",
            "17 Main Street, Ellenbrook WA 6069", null, null, "@nailedit_ellenbrook",
            4.9, 67, "A boutique home studio in Ellenbrook where every client gets personalised attention. Known for meticulous prep work and consistently beautiful results that last the full three weeks without lifting.",
            ["BIAB $68", "Gel Full Set $88", "Shellac $55", "Pedicure $65"]),

        new("Candy Nails Cannington", "candy-nails-cannington", "nails", "Cannington", "6107",
            "Westfield Carousel, Cannington WA 6107", "(08) 9356 7788", null, null,
            4.4, 320, "A long-standing favourite inside Westfield Carousel that has earned a loyal following across Perth's south-eastern suburbs. Candy Nails is praised for efficient service, reasonable pricing and a huge range of colours and styles.",
            ["Gel Manicure $52", "Pedicure $62", "Full Set $75", "Acrylic $80"]),

        new("The Nail Room Scarborough", "the-nail-room-scarborough", "nails", "Scarborough", "6019",
            "178 Scarborough Beach Road, Scarborough WA 6019", null, null, "@thenailroom_scarborough",
            4.8, 89, "A beach-vibe nail studio near Scarborough Beach that draws both locals and visitors. The Nail Room specialises in trendy designs, ombre sets and coastal-inspired nail art that matches the Scarborough lifestyle.",
            ["Gel Full Set $90", "Ombre Set $110", "BIAB $72", "Pedicure $70"]),

        new("Velvet Nail Lounge Victoria Park", "velvet-nail-lounge-victoria-park", "nails", "Victoria Park", "6100",
            "869 Albany Highway, Victoria Park WA 6100", null, null, "@velvetnaillounge",
            4.7, 115, "An elegant nail lounge on Albany Highway in Vic Park offering a premium experience. Velvet is celebrated for their attention to detail, relaxing atmosphere and consistent, flawless results across all services.",
            ["BIAB $75", "Gel Full Set $92", "Spa Pedicure $78", "Classic Manicure $48"]),

        new("Daisy Nails Midland", "daisy-nails-midland", "nails", "Midland", "6056",
            "Midland Gate Shopping Centre, Midland WA 6056", "(08) 9274 5500", null, null,
            4.3, 185, "Midland Gate's popular nail salon offering affordable, reliable services for the eastern suburbs. Daisy Nails is known for fast, professional service and a wide range of gel colours and nail art options.",
            ["Gel Manicure $50", "Pedicure $58", "Full Set $72", "Acrylic $78"]),

        new("Bloom Nails Mount Hawthorn", "bloom-nails-mount-hawthorn", "nails", "Mount Hawthorn", "6016",
            "148 Scarborough Beach Road, Mount Hawthorn WA 6016", null, null, "@bloomnails_mth",
            4.9, 54, "A charming boutique studio on Scarborough Beach Road in Mount Hawthorn. Bloom Nails takes pride in their clean, meticulous work and the warm, personal service that comes from being a small, dedicated team.",
            ["BIAB $70", "Gel Manicure $60", "Pedicure $68", "Nail Art from $10"]),

        new("Crystal Nails Rockingham", "crystal-nails-rockingham", "nails", "Rockingham", "6168",
            "Rockingham Shopping Centre, Rockingham WA 6168", "(08) 9527 3344", null, null,
            4.5, 245, "A bustling nail salon inside Rockingham Shopping Centre serving the southern corridor. Crystal Nails is a go-to for affordable, quality gel sets and pedicures with a reliable team that locals trust.",
            ["Gel Manicure $52", "Pedicure $60", "Full Set $75", "Shellac $48"]),

        new("Nail Envy Studio Maylands", "nail-envy-studio-maylands", "nails", "Maylands", "6051",
            "287 Guildford Road, Maylands WA 6051", null, null, "@nailenvy_maylands",
            4.8, 72, "A sleek nail studio on Guildford Road in Maylands. Nail Envy specialises in BIAB, extensions and intricate nail art, bringing a creative edge to the inner eastern suburbs.",
            ["BIAB $72", "Gel Extensions $105", "Nail Art from $15", "Pedicure $70"]),

        new("Opal Nails Fremantle", "opal-nails-fremantle", "nails", "Fremantle", "6160",
            "5 South Terrace, Fremantle WA 6160", null, null, "@opalnails_freo",
            4.7, 130, "A popular Fremantle nail salon on South Terrace known for quality work and a warm, welcoming atmosphere. Opal Nails has been a port city favourite for years, delivering consistent results at fair prices.",
            ["Gel Manicure $58", "Pedicure $68", "Full Set $85", "BIAB $70"]),

        new("Nails by Jade Canning Vale", "nails-by-jade-canning-vale", "nails", "Canning Vale", "6155",
            null, null, null, "@nailsbyjadeperth",
            5.0, 38, "Jade runs a private home studio in Canning Vale that clients describe as worth the drive from anywhere in Perth. Meticulous technique, beautiful designs and the personal attention of a one-on-one appointment.",
            ["BIAB $72", "Gel Full Set $95", "Shellac $58", "Nail Art from $12"]),

        new("Sparkle Nails Clarkson", "sparkle-nails-clarkson", "nails", "Clarkson", "6030",
            "Ocean Keys Shopping Centre, Clarkson WA 6030", "(08) 9407 2255", null, null,
            4.4, 165, "Ocean Keys' favourite nail destination serving Clarkson and the northern coastal corridor. Sparkle Nails offers a full menu of gel, acrylic and spa services at competitive prices with a friendly, efficient team.",
            ["Gel Manicure $52", "Pedicure $60", "Gel Full Set $78", "Acrylic $82"]),

        new("Belle Nails Applecross", "belle-nails-applecross", "nails", "Applecross", "6153",
            "45 Ardross Street, Applecross WA 6153", null, null, "@bellenails_applecross",
            4.8, 92, "A refined nail studio in the heart of Applecross village. Belle Nails provides an elevated manicure and pedicure experience with premium products and a calming, sophisticated salon environment.",
            ["Gel Manicure $68", "Spa Pedicure $82", "BIAB $78", "Full Set $98"]),

        new("Nails n More Baldivis", "nails-n-more-baldivis", "nails", "Baldivis", "6171",
            "Stockland Baldivis, Baldivis WA 6171", "(08) 9524 1166", null, null,
            4.5, 188, "A popular nail salon inside Stockland Baldivis serving Perth's fast-growing southern suburbs. Known for reliable quality, efficient service and a broad range of nail styles and colours.",
            ["Gel Manicure $55", "Pedicure $62", "Full Set $78", "Shellac $48"]),

        new("Rosie Nails Cottesloe", "rosie-nails-cottesloe", "nails", "Cottesloe", "6011",
            "Napoleon Street, Cottesloe WA 6011", null, null, "@rosienails_cottesloe",
            4.9, 46, "A boutique nail studio in Cottesloe's premium shopping precinct. Rosie Nails brings a luxury touch to every appointment — think BIAB, detailed art and spa-quality pedicures in a calm, intimate setting.",
            ["BIAB $78", "Gel Manicure $68", "Spa Pedicure $85", "Full Set $98"]),

        new("Nails at Home Perth Mobile", "nails-at-home-perth-mobile", "nails", "Perth", "6000",
            null, "0412 345 678", "https://www.nailsathomeperth.com.au", "@nailsathomeperth",
            4.8, 55, "Perth's premier mobile nail service brings salon-quality BIAB, gel sets and pedicures directly to your home, office or event. Fully equipped with hospital-grade sterilisation, making convenience easy without compromising quality.",
            ["Mobile BIAB $85", "Mobile Gel Set $100", "Mobile Pedicure $80"]),

        new("Azure Nails Nedlands", "azure-nails-nedlands", "nails", "Nedlands", "6009",
            "55 Stirling Highway, Nedlands WA 6009", null, null, "@azurenails_nedlands",
            4.7, 110, "A stylish nail salon on Stirling Highway in Nedlands serving the western suburbs with quality gel work, BIAB and spa pedicures. Azure Nails is known for their clean technique and consistently beautiful results.",
            ["Gel Manicure $65", "BIAB $75", "Spa Pedicure $78", "Full Set $92"]),

        new("Tip Top Nails Innaloo", "tip-top-nails-innaloo", "nails", "Innaloo", "6018",
            "Westfield Innaloo, Innaloo WA 6018", "(08) 9444 2233", null, null,
            4.4, 275, "A busy, well-loved nail salon inside Westfield Innaloo. Tip Top delivers consistent quality at competitive prices, making them a go-to for locals who want reliable gel and acrylic work without breaking the bank.",
            ["Gel Manicure $50", "Pedicure $58", "Full Set $72", "Acrylic $78"]),

        new("Emerald Nails Leederville", "emerald-nails-leederville", "nails", "Leederville", "6007",
            "128 Oxford Street, Leederville WA 6007", null, null, "@emeraldnails_leedy",
            4.8, 83, "Tucked into Leederville's vibrant Oxford Street strip, Emerald Nails offers premium gel and BIAB services in a relaxed, creative atmosphere. A favourite among Leederville locals and workers alike.",
            ["BIAB $72", "Gel Full Set $90", "Shellac $58", "Pedicure $68"]),

        new("Pearl Nails Como", "pearl-nails-como", "nails", "Como", "6152",
            "Preston Street, Como WA 6152", null, null, "@pearlnails_como",
            4.6, 145, "A well-established nail salon in Como's main shopping strip. Pearl Nails provides reliable, affordable services with a professional team that keeps the local community coming back week after week.",
            ["Gel Manicure $55", "Pedicure $62", "Full Set $78", "Polish Change $20"]),

        new("Nail Theory Bassendean", "nail-theory-bassendean", "nails", "Bassendean", "6054",
            "Old Perth Road, Bassendean WA 6054", null, null, "@nailtheory_bass",
            4.9, 42, "A modern nail studio bringing fresh trends to Bassendean. Nail Theory specialises in hand-painted art, ombre fades and architectural sets that push the boundaries of traditional nail design.",
            ["BIAB $75", "Gel Full Set $95", "Custom Art Set $120", "Pedicure $70"]),

        new("Nail Art House Dianella", "nail-art-house-dianella", "nails", "Dianella", "6059",
            "Dianella Plaza, Dianella WA 6059", "(08) 9375 1100", null, null,
            4.5, 165, "A creative nail salon inside Dianella Plaza known for elaborate nail art, fun designs and trend-forward sets. Nail Art House brings colour, creativity and consistent quality to the northern suburbs.",
            ["Gel Full Set $82", "Nail Art from $10", "Pedicure $65", "Shellac $52"]),

        new("Classy Nails Stirling", "classy-nails-stirling", "nails", "Stirling", "6021",
            "Stirling Central, Stirling WA 6021", null, null, null,
            4.3, 198, "Stirling Central's convenient nail salon offering a full range of services. Classy Nails is praised for their efficient, no-fuss approach and competitive pricing that suits families and busy professionals.",
            ["Gel Manicure $48", "Pedicure $55", "Full Set $72", "Acrylic $75"]),

        new("Luxe Tips South Perth", "luxe-tips-south-perth", "nails", "South Perth", "6151",
            "Mends Street, South Perth WA 6151", null, null, "@luxetips_sp",
            4.8, 78, "A premium nail studio on Mends Street in South Perth. Luxe Tips delivers elevated nail services with a focus on nail health, clean technique and long-lasting results in a beautiful salon setting.",
            ["BIAB $75", "Gel Manicure $65", "Spa Pedicure $80", "Full Set $95"]),

        new("Sunshine Nails Wanneroo", "sunshine-nails-wanneroo", "nails", "Wanneroo", "6065",
            "Wanneroo Shopping Centre, Wanneroo WA 6065", "(08) 9405 3322", null, null,
            4.4, 210, "A friendly, affordable nail salon inside Wanneroo Shopping Centre. Sunshine Nails has been a reliable choice for the Wanneroo community for years, offering consistent quality at great value.",
            ["Gel Manicure $48", "Pedicure $55", "Full Set $70", "Shellac $45"]),

        new("Nail Haven Butler", "nail-haven-butler", "nails", "Butler", "6036",
            "Brighton Village, Butler WA 6036", null, null, "@nailhaven_butler",
            4.7, 95, "Butler's premier nail studio offering a full range of gel, BIAB and spa services. Nail Haven has quickly become the go-to for Perth's growing northern corridor, praised for quality work and warm service.",
            ["BIAB $68", "Gel Full Set $88", "Pedicure $65", "Shellac $52"]),

        new("Nails by Bree Hillarys", "nails-by-bree-hillarys", "nails", "Hillarys", "6025",
            null, null, null, "@nailsbybree_perth",
            5.0, 34, "Bree's private studio in Hillarys is one of the northern beaches' best-kept secrets. Meticulous technique, gorgeous designs and the personalised attention of a dedicated one-on-one appointment experience.",
            ["BIAB $72", "Gel Full Set $92", "Nail Art from $15", "Pedicure $68"]),

        new("Golden Nails Belmont", "golden-nails-belmont", "nails", "Belmont", "6104",
            "Belmont Forum, Belmont WA 6104", "(08) 9478 2200", null, null,
            4.4, 230, "Belmont Forum's trusted nail salon offering reliable services at excellent value. Golden Nails has built a strong local following through years of consistent quality and professional, friendly service.",
            ["Gel Manicure $48", "Pedicure $55", "Full Set $70", "Polish Change $18"]),

        // ===== HAIR (55 more) =====
        new("Studio 48 Hair Perth CBD", "studio-48-hair-perth-cbd", "hair", "Perth", "6000",
            "48 St Georges Terrace, Perth WA 6000", "(08) 9221 4848", "https://www.studio48hair.com.au", "@studio48hair",
            4.8, 215, "A modern, urban hair salon on St Georges Terrace in the heart of the Perth CBD. Studio 48 is known for their exceptional balayage, creative colour and precision cuts — all delivered in a sleek, contemporary environment.",
            ["Cut & Style from $95", "Balayage from $240", "Full Colour from $160", "Blow Dry $65"]),

        new("The Hair Lab Leederville", "the-hair-lab-leederville", "hair", "Leederville", "6007",
            "156 Oxford Street, Leederville WA 6007", null, null, "@thehairlab_leedy",
            4.9, 78, "A creative hair studio on Oxford Street in Leederville where colour is king. The Hair Lab specialises in vivid fashion colours, pastel transformations and expert balayage for clients who want to stand out.",
            ["Cut & Style from $88", "Fashion Colour from $180", "Balayage from $220", "Toner from $80"]),

        new("Toni and Guy Subiaco", "toni-and-guy-subiaco", "hair", "Subiaco", "6008",
            "115 Rokeby Road, Subiaco WA 6008", "(08) 9381 6622", "https://www.toniandguy.com.au", "@toniandguysubiaco",
            4.6, 380, "The Subiaco salon of the internationally acclaimed Toni & Guy brand. Award-winning cuts, expert colour and styling from a team trained to the highest international standards in one of Perth's most prestigious suburbs.",
            ["Women's Cut from $90", "Colour from $140", "Balayage from $250", "Blow Dry $60"]),

        new("Blonde Hair Co Scarborough", "blonde-hair-co-scarborough", "hair", "Scarborough", "6019",
            "205 Scarborough Beach Road, Scarborough WA 6019", null, null, "@blondehairco",
            4.9, 145, "Perth's coastal blonde specialists. Blonde Hair Co in Scarborough creates sun-kissed, beach-ready blondes that look like they've spent all summer by the ocean. A relaxed, beachside salon with seriously skilled colourists.",
            ["Balayage from $220", "Full Blonde from $180", "Cut & Style from $85", "Toner from $75"]),

        new("Edge Hair Design Mount Lawley", "edge-hair-design-mount-lawley", "hair", "Mount Lawley", "6050",
            "110 Walcott Street, Mount Lawley WA 6050", "(08) 9328 7766", null, "@edgehairml",
            4.7, 195, "A long-standing Mount Lawley institution on Walcott Street. Edge Hair Design has built decades of trust delivering expert cuts, colour and styling in a warm, welcoming salon environment.",
            ["Cut & Style from $85", "Colour from $135", "Highlights from $160", "Blow Dry $55"]),

        new("Raw Hair Studio Northbridge", "raw-hair-studio-northbridge", "hair", "Northbridge", "6003",
            "42 James Street, Northbridge WA 6003", null, null, "@rawhair_nb",
            4.8, 120, "Northbridge's edgiest hair studio, where creativity meets technical precision. Raw Hair Studio is the destination for fashion-forward cuts, bold colours and avant-garde styling that pushes boundaries.",
            ["Cut & Style from $90", "Fashion Colour from $170", "Balayage from $230", "Buzzcut $50"]),

        new("Silk Hair Studio Cottesloe", "silk-hair-studio-cottesloe", "hair", "Cottesloe", "6011",
            "Napoleon Street, Cottesloe WA 6011", null, null, "@silkhair_cottesloe",
            4.9, 88, "A premium boutique salon on Napoleon Street in Cottesloe. Silk Hair Studio brings a refined, luxury approach to colour and styling, with a focus on healthy hair and beautiful, natural-looking results.",
            ["Cut & Style from $98", "Balayage from $260", "Full Colour from $170", "Treatment from $70"]),

        new("Hype Hair Joondalup", "hype-hair-joondalup", "hair", "Joondalup", "6027",
            "Lakeside Joondalup Shopping City, Joondalup WA 6027", "(08) 9300 8899", null, "@hypehair_joondalup",
            4.6, 265, "A modern salon inside Lakeside Joondalup delivering trend-led cuts, balayage and colour to the northern suburbs. Hype Hair's team stays at the forefront of industry trends to ensure clients always leave looking current.",
            ["Women's Cut from $80", "Balayage from $210", "Colour from $130", "Men's Cut $40"]),

        new("Ash and Oak Hair Fremantle", "ash-and-oak-hair-fremantle", "hair", "Fremantle", "6160",
            "29 Market Street, Fremantle WA 6160", null, null, "@ashandoakhair",
            4.8, 145, "A warm, organic-inspired salon in Fremantle's market precinct. Ash and Oak uses sustainable, vegan products and specialises in creating effortless, lived-in colour that suits Freo's relaxed coastal lifestyle.",
            ["Cut & Style from $88", "Balayage from $220", "Colour from $140", "Treatment from $65"]),

        new("Bobby Pin Hair Boutique Claremont", "bobby-pin-hair-boutique-claremont", "hair", "Claremont", "6010",
            "Claremont Quarter, Claremont WA 6010", null, null, "@bobbypinboutique",
            4.7, 178, "A chic hair boutique inside Claremont Quarter offering premium cuts, colour and styling for the western suburbs. Bobby Pin's experienced team delivers polished, sophisticated results that match Claremont's upmarket aesthetic.",
            ["Women's Cut from $95", "Balayage from $250", "Full Colour from $160", "Blow Dry $65"]),

        new("Hair by Elise Nedlands", "hair-by-elise-nedlands", "hair", "Nedlands", "6009",
            null, null, null, "@hairbyelise_perth",
            5.0, 52, "Elise's private studio in Nedlands has built a devoted following through word-of-mouth alone. Specialising in beautiful blondes, colour corrections and transformations that leave every client feeling incredible.",
            ["Balayage from $240", "Colour Correction from $320", "Cut & Style from $90", "Toner from $80"]),

        new("Strand Hair Salon Maylands", "strand-hair-salon-maylands", "hair", "Maylands", "6051",
            "189 Guildford Road, Maylands WA 6051", null, null, "@strandhair_maylands",
            4.7, 135, "A relaxed, community-focused salon on Guildford Road in Maylands. Strand Hair Salon is known for beautiful balayage, consistent colour results and a warm team that genuinely cares about each client's experience.",
            ["Cut & Style from $82", "Balayage from $210", "Colour from $130", "Blow Dry $50"]),

        new("Haven Hair Studio Floreat", "haven-hair-studio-floreat", "hair", "Floreat", "6014",
            "Floreat Forum, Floreat WA 6014", "(08) 9387 5544", null, "@havenhair_floreat",
            4.8, 165, "A beautiful salon inside Floreat Forum that combines expert technique with a warm, inviting atmosphere. Haven Hair Studio is the go-to for Floreat locals who want salon-quality colour and cuts close to home.",
            ["Cut & Style from $90", "Balayage from $230", "Full Colour from $150", "Treatment from $65"]),

        new("Root to Tip Hair Morley", "root-to-tip-hair-morley", "hair", "Morley", "6062",
            "Walter Road, Morley WA 6062", null, null, "@roottotip_morley",
            4.6, 185, "A friendly, professional salon on Walter Road in Morley. Root to Tip delivers reliable cuts, colour and treatments at fair prices, making quality haircare accessible to Perth's eastern suburbs.",
            ["Cut & Style from $78", "Colour from $120", "Highlights from $150", "Treatment from $55"]),

        new("Muse Hair Collective West Perth", "muse-hair-collective-west-perth", "hair", "West Perth", "6005",
            "58 Ord Street, West Perth WA 6005", null, null, "@musehair_wp",
            4.9, 92, "A collective of independent stylists working from a stunning shared studio space in West Perth. Muse Hair Collective offers diverse expertise across colour, cuts, extensions and textured hair.",
            ["Cut & Style from $95", "Balayage from $240", "Extensions from $500", "Colour from $155"]),

        new("Copper Hair Studio North Perth", "copper-hair-studio-north-perth", "hair", "North Perth", "6006",
            "Angove Street, North Perth WA 6006", null, null, "@copperhair_np",
            4.8, 75, "A warm, copper-toned salon on Angove Street specialising in rich, warm colour palettes — coppers, auburns, warm blondes and rich brunettes. The studio's intimate setting makes every appointment feel personal.",
            ["Cut & Style from $88", "Copper Transformation from $200", "Balayage from $220", "Gloss from $70"]),

        new("Coastal Hair Co Hillarys", "coastal-hair-co-hillarys", "hair", "Hillarys", "6025",
            "Hillarys Boat Harbour, Hillarys WA 6025", null, null, "@coastalhairco",
            4.7, 155, "A sun-drenched salon at Hillarys Boat Harbour where coastal vibes meet expert hairdressing. Coastal Hair Co specialises in beach blondes, surfer waves and low-maintenance colour for the northern beaches lifestyle.",
            ["Cut & Style from $82", "Beach Blonde from $200", "Balayage from $220", "Blow Dry $55"]),

        new("Bliss Hair Design Canning Vale", "bliss-hair-design-canning-vale", "hair", "Canning Vale", "6155",
            "Livingston Marketplace, Canning Vale WA 6155", "(08) 9455 3322", null, null,
            4.5, 210, "Canning Vale's trusted salon inside Livingston Marketplace. Bliss Hair Design delivers reliable cuts, colour and styling for the whole family at competitive prices, with a friendly team that builds lasting client relationships.",
            ["Women's Cut from $75", "Colour from $120", "Highlights from $145", "Men's Cut $35"]),

        new("Crown Hair Perth CBD", "crown-hair-perth-cbd", "hair", "Perth", "6000",
            "London Court, Perth WA 6000", null, null, "@crownhair_perth",
            4.8, 140, "Tucked inside Perth's historic London Court, Crown Hair brings old-world charm to modern hairdressing. Expert cuts, creative colour and a unique salon experience in one of Perth's most iconic heritage arcades.",
            ["Cut & Style from $92", "Colour from $145", "Balayage from $235", "Blow Dry $60"]),

        new("Luna Hair Studio South Perth", "luna-hair-studio-south-perth", "hair", "South Perth", "6151",
            "Angelo Street, South Perth WA 6151", null, null, "@lunahair_sp",
            4.8, 98, "A chic, modern salon on Angelo Street in South Perth. Luna Hair Studio is known for beautiful balayage, expert colour matching and a calm, sophisticated salon experience that reflects South Perth's premium lifestyle.",
            ["Cut & Style from $90", "Balayage from $235", "Full Colour from $155", "Gloss from $75"]),

        new("Rebel Hair Co Mount Hawthorn", "rebel-hair-co-mount-hawthorn", "hair", "Mount Hawthorn", "6016",
            "Scarborough Beach Road, Mount Hawthorn WA 6016", null, null, "@rebelhairco",
            4.9, 68, "A bold, creative salon in Mount Hawthorn that celebrates individuality. Rebel Hair Co is where Perth's most style-conscious clients go for fashion-forward cuts, vivid colours and editorial-inspired styling.",
            ["Cut & Style from $85", "Vivid Colour from $200", "Balayage from $230", "Men's Cut $50"]),

        new("Willow Hair Perth CBD", "willow-hair-perth-cbd", "hair", "Perth", "6000",
            "Hay Street, Perth WA 6000", null, null, "@willowhair_perth",
            4.7, 175, "A calm, nature-inspired salon on Hay Street in the Perth CBD. Willow Hair uses gentle, organic products and specialises in healthy hair journeys — from repairing damaged colour to creating beautiful, sustainable results.",
            ["Cut & Style from $88", "Organic Colour from $150", "Balayage from $220", "Olaplex Treatment $80"]),

        new("Blaze Hair Studio Midland", "blaze-hair-studio-midland", "hair", "Midland", "6056",
            "Great Eastern Highway, Midland WA 6056", null, null, "@blazehair_midland",
            4.6, 145, "Midland's creative hair destination offering trend-forward cuts and colour. Blaze Hair Studio brings city-quality hairdressing to Perth's eastern gateway with a passionate, skilled team.",
            ["Cut & Style from $78", "Colour from $125", "Balayage from $200", "Men's Cut $38"]),

        new("The Strand Hair Co Applecross", "the-strand-hair-co-applecross", "hair", "Applecross", "6153",
            "Ardross Street, Applecross WA 6153", null, null, "@thestrandhairco",
            4.8, 110, "An elegant salon in Applecross village delivering premium cuts, colour and styling. The Strand Hair Co is known for their meticulous attention to detail and ability to create effortlessly beautiful, lived-in colour.",
            ["Cut & Style from $92", "Balayage from $240", "Full Colour from $160", "Treatment from $70"]),

        new("Ink Hair Northbridge", "ink-hair-northbridge", "hair", "Northbridge", "6003",
            "William Street, Northbridge WA 6003", null, null, "@inkhair_nb",
            4.7, 85, "A bold, artistic salon in the heart of Northbridge. Ink Hair specialises in editorial-inspired cuts, punk-rock colour and avant-garde styling for Perth's creative community.",
            ["Cut & Style from $80", "Fashion Colour from $170", "Balayage from $210", "Buzzcut $45"]),

        new("Halo Hair Studio Bayswater", "halo-hair-studio-bayswater", "hair", "Bayswater", "6053",
            "King William Street, Bayswater WA 6053", null, null, "@halohair_bayswater",
            4.7, 125, "A warm, community-focused salon in Bayswater. Halo Hair Studio is praised for consistent quality, fair pricing and a team that listens carefully to each client's vision and delivers exactly what was discussed.",
            ["Cut & Style from $78", "Colour from $120", "Highlights from $150", "Blow Dry $48"]),

        new("Shine Hair and Beauty Mandurah", "shine-hair-and-beauty-mandurah", "hair", "Mandurah", "6210",
            "Mandurah Terrace, Mandurah WA 6210", "(08) 9535 4466", null, "@shinehair_mandurah",
            4.6, 225, "Mandurah's premium hair salon offering the full spectrum of colour, cuts and styling services. Shine Hair and Beauty has been serving the Peel region for years with expert results and friendly, professional service.",
            ["Cut & Style from $80", "Colour from $130", "Balayage from $210", "Blow Dry $55"]),

        new("Aria Hair Currambine", "aria-hair-currambine", "hair", "Currambine", "6028",
            "Currambine Central, Currambine WA 6028", null, null, "@ariahair_currambine",
            4.8, 95, "A modern salon in Currambine Central bringing sophisticated colour and styling to the northern coastal suburbs. Aria Hair is known for beautiful blondes, seamless balayage and a relaxed, welcoming atmosphere.",
            ["Cut & Style from $85", "Balayage from $220", "Colour from $140", "Toner from $75"]),
    ];
}
