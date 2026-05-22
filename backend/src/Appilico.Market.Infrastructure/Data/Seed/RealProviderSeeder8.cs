namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private static RealBiz[] GetRealBusinesses8() =>
    [
        // ===== Multi-service beauty salons (spread across suburbs) =====
        new("Glow Beauty Studio Armadale", "glow-beauty-studio-armadale", "nails", "Armadale", "6112",
            null, null, null, "@glowbeauty_armadale",
            4.6, 135, "Armadale's all-in-one beauty destination offering nails, waxing and tanning. Glow Beauty Studio has built a loyal local following through quality services at affordable prices.",
            ["Gel Manicure $50", "Brazilian Wax $48", "Spray Tan $45", "Pedicure $58"]),

        new("Beauty Collective Armadale", "beauty-collective-armadale", "hair", "Armadale", "6112",
            null, null, null, "@beautycollective_armadale",
            4.5, 145, "A vibrant beauty hub in Armadale bringing together hair, beauty and wellness services under one roof. A one-stop destination for the Armadale community.",
            ["Cut & Style from $70", "Colour from $110", "Waxing from $20", "Brows $35"]),

        new("Luxe Beauty Lounge Currambine", "luxe-beauty-lounge-currambine", "lashes", "Currambine", "6028",
            null, null, null, "@luxebeautylounge_currambine",
            4.8, 88, "A premium beauty lounge in Currambine offering lash extensions, brows and skin treatments. Known for their meticulous technique and relaxing studio atmosphere.",
            ["Classic Lashes $125", "Hybrid $150", "Brow Lamination $85", "Facial $110"]),

        new("Beauty on the Avenue Clarkson", "beauty-on-the-avenue-clarkson", "nails", "Clarkson", "6030",
            null, null, null, "@beautyontheavenue_clarkson",
            4.6, 115, "A friendly beauty salon in Clarkson offering nails, waxing and beauty services. Known for their warm atmosphere and consistent results at competitive prices.",
            ["Gel Manicure $52", "Brazilian Wax $48", "Pedicure $60", "Brow Wax $22"]),

        new("The Beauty Room Butler", "the-beauty-room-butler", "lashes", "Butler", "6036",
            null, null, null, "@thebeautyroom_butler",
            4.7, 95, "A popular beauty studio in Butler offering lash extensions, brow services and facials. The Beauty Room brings premium beauty services to Perth's rapidly growing northern suburbs.",
            ["Classic Lashes $118", "Hybrid $142", "Lash Lift $82", "Brow Lamination $78"]),

        new("Serenity Beauty Spa Mandurah", "serenity-beauty-spa-mandurah", "skin-care", "Mandurah", "6210",
            null, null, null, "@serenitybeautyspa_mandurah",
            4.7, 155, "A relaxing beauty spa in Mandurah offering facials, skin treatments and relaxation services. Serenity brings the day spa experience to the Peel region at accessible prices.",
            ["Signature Facial $110", "Express Facial $65", "Microdermabrasion $95", "LED $70"]),

        new("Perth Hills Beauty Kalamunda", "perth-hills-beauty-kalamunda", "brows", "Kalamunda", "6076",
            null, null, null, "@perthhillsbeauty",
            4.8, 52, "A charming beauty studio in the Perth Hills suburb of Kalamunda. Offering expert brow services, lash treatments and facials in a calm, scenic setting.",
            ["Brow Wax & Tint $48", "Brow Lamination $82", "Lash Lift $85", "Facial $95"]),

        new("Essence Beauty Bentley", "essence-beauty-bentley", "nails", "Bentley", "6102",
            null, null, null, "@essencebeauty_bentley",
            4.5, 110, "A reliable beauty salon in Bentley offering affordable nail and beauty services. Essence Beauty is praised for consistent quality and friendly, professional staff.",
            ["Gel Manicure $48", "Pedicure $55", "Waxing from $18", "Brow Tint $18"]),

        new("Beauty Hub Forrestfield", "beauty-hub-forrestfield", "hair", "Forrestfield", "6058",
            null, null, null, "@beautyhub_forrestfield",
            4.6, 95, "A comprehensive beauty hub in Forrestfield offering hair, beauty and body services. A convenient one-stop destination for the Forrestfield and High Wycombe community.",
            ["Cut & Style from $72", "Colour from $115", "Waxing from $20", "Spray Tan $45"]),

        new("Glamour Beauty Swan View", "glamour-beauty-swan-view", "nails", "Swan View", "6056",
            null, null, null, "@glamourbeauty_swanview",
            4.5, 75, "A welcoming beauty salon in Swan View offering nails, waxing and beauty services for the Perth Hills community. Known for friendly service and affordable pricing.",
            ["Gel Manicure $48", "Brazilian Wax $45", "Pedicure $55", "Brow Wax $20"]),

        new("Beauty Lab Balcatta", "beauty-lab-balcatta", "skin-care", "Balcatta", "6021",
            null, null, null, "@beautylab_balcatta",
            4.7, 82, "A results-driven skin and beauty clinic in Balcatta offering facials, peels and advanced skin treatments. Beauty Lab brings professional-grade skincare to the inner northern suburbs.",
            ["Signature Facial $120", "Chemical Peel $145", "LED Therapy $75", "Microdermabrasion $100"]),

        new("Aura Beauty Cockburn Central", "aura-beauty-cockburn-central", "lashes", "Cockburn Central", "6164",
            null, null, null, "@aurabeauty_cockburn",
            4.7, 105, "A modern beauty studio in Cockburn Central offering lash extensions, brows and beauty treatments. Aura Beauty serves the growing Cockburn community with consistent, quality results.",
            ["Classic Lashes $115", "Hybrid $140", "Lash Lift $82", "Brow Lamination $78"]),

        new("Blossom Beauty Wembley", "blossom-beauty-wembley", "brows", "Wembley", "6014",
            null, null, null, "@blossombeauty_wembley",
            4.8, 68, "A lovely beauty studio in Wembley offering expert brow shaping, tinting and lamination alongside lash and nail services. Known for their warm, welcoming atmosphere.",
            ["Brow Wax & Tint $52", "Brow Lamination $85", "Lash Lift $88", "Gel Nails $60"]),

        new("Radiance Beauty Bar Innaloo", "radiance-beauty-bar-innaloo", "makeup", "Innaloo", "6018",
            null, null, null, "@radiance_innaloo",
            4.6, 92, "A trendy beauty bar in Innaloo offering makeup services, spray tanning and beauty treatments. Radiance is the pre-event destination for the Innaloo and Scarborough community.",
            ["Event Makeup $110", "Spray Tan $48", "Brow Wax $25", "Lash Lift $82"]),

        new("Polished Beauty Malaga", "polished-beauty-malaga", "nails", "Malaga", "6090",
            null, null, null, "@polishedbeauty_malaga",
            4.5, 85, "A professional beauty salon in the Malaga business precinct. Polished Beauty offers nail, brow and beauty services that fit around the busy schedules of the surrounding business community.",
            ["Gel Manicure $52", "Brow Wax & Tint $42", "Pedicure $58", "Shellac $45"]),

        // ===== More spread across all categories to fill gaps =====
        new("Lash and Brow Co Baldivis", "lash-and-brow-co-baldivis", "lashes", "Baldivis", "6171",
            null, null, null, "@lashandbrowco_baldivis",
            4.7, 78, "A dedicated lash and brow studio in Baldivis. Known for precise lash extensions and expert brow shaping that enhances each client's natural features.",
            ["Classic Lashes $115", "Hybrid $138", "Brow Lamination $78", "Lash Lift $82"]),

        new("Skin and Soul Scarborough", "skin-and-soul-scarborough", "skin-care", "Scarborough", "6019",
            null, null, null, "@skinandsoul_scarborough",
            4.8, 72, "A holistic skin clinic near Scarborough Beach. Skin and Soul combines clinical skin treatments with relaxation facials for a complete skin health experience.",
            ["Clinical Facial $130", "Hydrating Facial $105", "Chemical Peel $155", "LED $78"]),

        new("Brow Authority Joondalup", "brow-authority-joondalup", "brows", "Joondalup", "6027",
            null, null, null, "@browauthority_joondalup",
            4.7, 95, "A specialist brow studio in Joondalup offering the full range of brow services. Known for their skilled shaping technique and ability to create the perfect arch for every face shape.",
            ["Brow Wax & Tint $48", "Brow Lamination $82", "Microblading from $500", "Henna $62"]),

        new("The Tan Bar Mount Lawley", "the-tan-bar-mount-lawley", "body", "Mount Lawley", "6050",
            null, null, null, "@thetanbar_ml",
            4.8, 88, "Mount Lawley's dedicated spray tan studio. The Tan Bar creates custom bronzes from sun-kissed glow to deep tan using premium organic solutions.",
            ["Custom Spray Tan $55", "Express Tan $42", "Bridal Tan $65", "Group from $38pp"]),

        new("Skin Clinic Ellenbrook", "skin-clinic-ellenbrook", "skin-care", "Ellenbrook", "6069",
            null, null, null, "@skinclinic_ellenbrook",
            4.6, 110, "A professional skin clinic bringing advanced facial treatments to Ellenbrook. Offering clinical peels, skin needling and LED therapy at accessible prices.",
            ["Clinical Facial $105", "Skin Needling $245", "Chemical Peel $135", "LED $68"]),

        new("Lash Love Studio Fremantle", "lash-love-studio-fremantle", "lashes", "Fremantle", "6160",
            null, null, null, "@lashlove_freo",
            4.8, 62, "A charming lash studio in Fremantle's eclectic beauty scene. Lash Love creates lightweight, natural-looking extensions that enhance without weighing down.",
            ["Classic $120", "Hybrid $145", "Volume $165", "Lash Lift & Tint $88"]),

        new("Cosmetic Glow Morley", "cosmetic-glow-morley", "cosmetic", "Morley", "6062",
            null, null, null, "@cosmeticglow_morley",
            4.6, 95, "An accessible cosmetic treatment clinic in Morley. Cosmetic Glow offers anti-wrinkle and filler treatments at competitive prices for Perth's eastern suburbs.",
            ["Anti-Wrinkle from $10/unit", "Lip Filler from $480", "Skin Booster from $340"]),

        new("Hair Therapy Canning Vale", "hair-therapy-canning-vale", "hair", "Canning Vale", "6155",
            null, null, null, "@hairtherapy_cv",
            4.6, 125, "A friendly salon in Canning Vale offering quality cuts, colour and hair treatments. Known for their nurturing approach to hair health and consistent results.",
            ["Cut & Style from $75", "Colour from $118", "Balayage from $198", "Treatment from $55"]),

        new("Nail Palace Cockburn", "nail-palace-cockburn", "nails", "Cockburn Central", "6164",
            null, null, null, "@nailpalace_cockburn",
            4.5, 155, "A bustling nail salon in Cockburn Central offering a full range of nail services. Nail Palace is known for efficient service and a huge selection of colours and styles.",
            ["Gel Manicure $50", "Full Set $75", "Pedicure $58", "Acrylic $78"]),

        new("Zen Brows Cottesloe", "zen-brows-cottesloe", "brows", "Cottesloe", "6011",
            null, null, null, "@zenbrows_cottesloe",
            4.9, 42, "A serene brow studio in Cottesloe offering gentle shaping, tinting and lamination. Zen Brows takes a mindful approach to brow design — no rushing, no pressure, just beautiful arches.",
            ["Brow Wax & Tint $58", "Brow Lamination $92", "Henna $70", "Threading $35"]),

        new("Body Balance Cannington", "body-balance-cannington", "body", "Cannington", "6107",
            null, null, null, "@bodybalance_cannington",
            4.6, 110, "A comprehensive body therapy centre in Cannington offering massage, waxing and spa treatments. Body Balance serves the south-eastern suburbs with professional, affordable body care.",
            ["Remedial Massage 60min $88", "Waxing from $20", "Spray Tan $45", "Relaxation 60min $75"]),

        new("Makeup Maven Claremont", "makeup-maven-claremont", "makeup", "Claremont", "6010",
            null, null, null, "@makeupmaven_claremont",
            4.9, 55, "A talented makeup artist based in Claremont. Maven's signature is sophisticated, editorial-quality makeup that photographs beautifully for weddings, events and corporate occasions.",
            ["Bridal from $255", "Event from $135", "Corporate from $115", "Lesson from $180"]),

        new("Wellness Warehouse Osborne Park", "wellness-warehouse-osborne-park", "wellness", "Osborne Park", "6017",
            null, null, null, "@wellnesswarehouse_op",
            4.7, 125, "A large wellness centre in Osborne Park offering yoga, meditation, sauna and holistic health services. A comprehensive wellness destination for Perth's inner northern suburbs.",
            ["Yoga Class $22", "Infrared Sauna $40", "Meditation $18", "Package from $100"]),
    ];
}
