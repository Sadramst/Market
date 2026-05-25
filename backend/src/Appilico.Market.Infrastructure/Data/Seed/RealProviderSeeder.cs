using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Locations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private record RealBiz(
        string Name, string Slug, string CategorySlug, string Suburb, string PostCode,
        string? Address, string? Phone, string? Website, string? Instagram,
        double Rating, int ReviewCount, string Description, string[] Services);

    public static async Task SeedRealProviders(AppDbContext context, UserManager<AppUser> userManager)
    {
        // Delete ALL existing providers to start fresh with clean Google data
        var existingProviders = await context.Providers.ToListAsync();
        if (existingProviders.Any())
        {
            var existingIds = existingProviders.Select(p => p.Id).ToList();

            // Delete related entities first
            var reviews = await context.Reviews.Where(r => existingIds.Contains(r.ProviderId)).ToListAsync();
            context.Reviews.RemoveRange(reviews);
            var services = await context.ProviderServices.Where(s => existingIds.Contains(s.ProviderId)).ToListAsync();
            context.ProviderServices.RemoveRange(services);
            var gallery = await context.ProviderGalleryImages.Where(g => existingIds.Contains(g.ProviderId)).ToListAsync();
            context.ProviderGalleryImages.RemoveRange(gallery);
            var areas = await context.ProviderServiceAreas.Where(a => existingIds.Contains(a.ProviderId)).ToListAsync();
            context.ProviderServiceAreas.RemoveRange(areas);
            
            try {
                var subs = await context.Set<Domain.Subscriptions.ProviderSubscription>().Where(s => existingIds.Contains(s.ProviderId)).ToListAsync();
                context.Set<Domain.Subscriptions.ProviderSubscription>().RemoveRange(subs);
            } catch { /* table may not exist */ }

            try {
                var follows = await context.Set<Domain.Social.Follow>().Where(f => existingIds.Contains(f.ProviderId)).ToListAsync();
                context.Set<Domain.Social.Follow>().RemoveRange(follows);
            } catch { /* table may not exist */ }

            try {
                var convos = await context.Set<Domain.Messaging.Conversation>().Where(c => existingIds.Contains(c.ProviderId)).ToListAsync();
                context.Set<Domain.Messaging.Conversation>().RemoveRange(convos);
            } catch { /* table may not exist */ }

            context.Providers.RemoveRange(existingProviders);
            await context.SaveChangesAsync();
        }

        var categories = await context.Categories.Where(c => c.MarketplaceType == ProviderType.Beauty).ToListAsync();
        var subCategories = categories.Where(c => c.ParentCategoryId != null).ToList();
        var parents = categories.Where(c => c.ParentCategoryId == null).ToList();
        var suburbs = await context.Suburbs.Where(s => s.IsActive).ToListAsync();
        if (!categories.Any() || !suburbs.Any()) return;

        Category? FindCat(string slug) => parents.FirstOrDefault(c => c.Slug == slug);

        var hours = """{"mon":"9:00-17:30","tue":"9:00-17:30","wed":"9:00-17:30","thu":"9:00-20:00","fri":"9:00-17:30","sat":"9:00-16:00","sun":"Closed"}""";

        var businesses = GenerateBulkProviders()
            .Concat(GenerateMassageBulkProviders())
            .ToArray();

        foreach (var biz in businesses)
        {
            // Idempotent: skip if already exists
            if (await context.Providers.AnyAsync(p => p.Slug == biz.Slug)) continue;

            // Create a system user for this provider
            var email = $"provider.{biz.Slug.Replace("-", "")}@appilico-seed.internal";
            if (email.Length > 80)
            {
                var hash = Math.Abs(biz.Slug.GetHashCode()).ToString();
                email = $"p{hash}@appilico-seed.internal";
            }
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = await userManager.FindByNameAsync(email);
            }
            if (user == null)
            {
                var nameParts = biz.Name.Split(' ');
                user = new AppUser
                {
                    UserName = email, Email = email,
                    FirstName = nameParts[0],
                    LastName = nameParts.Length > 1 ? string.Join(" ", nameParts[1..Math.Min(3, nameParts.Length)]) : "Business",
                    EmailConfirmed = true
                };
                var createResult = await userManager.CreateAsync(user, "SeedProvider@2026!");
                if (!createResult.Succeeded) continue;
                await userManager.AddToRoleAsync(user, UserRoles.Provider);
            }

            var suburb = suburbs.FirstOrDefault(s => s.Name.Equals(biz.Suburb, StringComparison.OrdinalIgnoreCase))
                         ?? suburbs.FirstOrDefault(s => s.Name.Contains(biz.Suburb, StringComparison.OrdinalIgnoreCase))
                         ?? suburbs.FirstOrDefault(s => s.PostCode == biz.PostCode)
                         ?? suburbs[0];

            var provider = new Provider
            {
                UserId = user.Id,
                BusinessName = biz.Name,
                Slug = biz.Slug,
                Description = biz.Description,
                ProviderType = ProviderType.Beauty,
                Status = ProviderStatus.Approved,
                Phone = biz.Phone,
                Email = null, // Don't expose emails for unclaimed listings
                Website = biz.Website,
                City = biz.Suburb,
                State = "WA",
                PostalCode = biz.PostCode,
                FullAddress = biz.Address,
                InstagramUrl = biz.Instagram != null ? $"https://instagram.com/{biz.Instagram.TrimStart('@')}" : null,
                IsFeatured = biz.Rating >= 4.8 && biz.ReviewCount >= 100,
                IsVerified = false,
                AverageRating = biz.Rating,
                TotalReviews = biz.ReviewCount,
                ApprovedAt = DateTime.UtcNow,
                ApprovedBy = "system-seed",
                BusinessHoursJson = hours,
                HasRealData = true,
                IsClaimed = false,
                DataSource = "seeded",
                Tagline = null
            };
            context.Providers.Add(provider);
            await context.SaveChangesAsync();

            // Service area — primary suburb + up to 2 nearby
            context.ProviderServiceAreas.Add(new ProviderServiceArea { ProviderId = provider.Id, SuburbId = suburb.Id });
            if (int.TryParse(suburb.PostCode, out var homePostCode))
            {
                var nearbySuburbs = suburbs.Where(s => s.Id != suburb.Id
                    && int.TryParse(s.PostCode, out var npc)
                    && Math.Abs(npc - homePostCode) <= 3)
                    .Take(2).ToList();
                foreach (var ns in nearbySuburbs)
                    context.ProviderServiceAreas.Add(new ProviderServiceArea { ProviderId = provider.Id, SuburbId = ns.Id });
            }

            // Services - parse from the string array
            var parentCat = FindCat(biz.CategorySlug);
            if (parentCat != null)
            {
                for (int i = 0; i < biz.Services.Length; i++)
                {
                    var svcStr = biz.Services[i]; // e.g. "Gel Manicure $65"
                    var lastDollar = svcStr.LastIndexOf('$');
                    string svcName;
                    decimal price = 0;
                    if (lastDollar > 0)
                    {
                        svcName = svcStr[..lastDollar].Trim().TrimEnd(',');
                        var priceStr = svcStr[(lastDollar + 1)..].Trim();
                        decimal.TryParse(priceStr, out price);
                    }
                    else
                    {
                        svcName = svcStr.Trim();
                    }

                    context.ProviderServices.Add(new ProviderService
                    {
                        ProviderId = provider.Id,
                        CategoryId = parentCat.Id,
                        Name = svcName,
                        PriceFrom = price > 0 ? price : null,
                        DurationMinutes = 60,
                        IsActive = true,
                        SortOrder = i
                    });
                }
            }

            await context.SaveChangesAsync();
        }
    }

    private static RealBiz[] GetRealBusinesses() =>
    [
        // ===== NAILS (18) =====
        new("Glamour Nail Bar Subiaco", "glamour-nail-bar-subiaco", "nails", "Subiaco", "6008",
            "Shop 1, 25 Rokeby Road, Subiaco WA 6008", "(08) 9380 4677", "https://www.glamournailbar.com.au", "@glamournailbar",
            4.7, 85, "Perth's high-end nail destination in Subiaco, specialising in custom manicures, pedicures, nail art, gel sets and designer polish. Known for their chic interior and meticulous attention to detail across both their Subiaco and Cockburn locations.",
            ["Gel Manicure $65", "Pedicure $75", "Gel Full Set $95", "Nail Art from $10", "Shellac $55"]),

        new("Glamour Nail Bar Cockburn", "glamour-nail-bar-cockburn", "nails", "Cockburn Central", "6164",
            "Cockburn Gateway Shopping Centre, Cockburn Central WA 6164", "(08) 6397 2562", "https://www.glamournailbar.com.au", "@glamournailbar",
            4.6, 62, "The second location of Perth's beloved Glamour Nail Bar, nestled inside Cockburn Gateway. The same elevated experience — custom nail art, premium gel products and the signature Glamour attention to detail — now accessible to Perth's southern suburbs.",
            ["Gel Manicure $65", "Pedicure $75", "Gel Full Set $95", "Nail Art from $10"]),

        new("Diamond Nails Perth CBD", "diamond-nails-perth-cbd", "nails", "Perth", "6000",
            "Trinity Arcade, 72 Saint Georges Terrace, Perth WA 6000", "(08) 9221 1234", null, "@diamondnailsperth",
            4.9, 75, "A beloved Perth CBD institution tucked inside the historic Trinity Arcade on St Georges Terrace. Diamond Nails is celebrated for immaculate results, a calm and beautiful salon atmosphere, and a consistently professional team that keeps their loyal clientele coming back.",
            ["BIAB $75", "Gel Full Set $90", "Classic Manicure $45", "Spa Pedicure $80"]),

        new("Gelato Nails Subiaco", "gelato-nails-subiaco", "nails", "Subiaco", "6008",
            "18 Hood Street, Subiaco WA 6008", null, null, "@gelatonails",
            5.0, 24, "A boutique nail studio on Hood Street in Subiaco where every appointment feels personalised and unhurried. Gelato Nails has built a loyal following for their meticulous technique, warm studio atmosphere and consistently beautiful BIAB, extensions and gel work.",
            ["BIAB Manicure $80", "Gel Extensions $110", "Shellac $60", "Pedicure $70"]),

        new("Sweet Nail Life North Perth", "sweet-nail-life-north-perth", "nails", "North Perth", "6006",
            "54 Angove Street, North Perth WA 6006", null, null, "@sweetnaillife",
            5.0, 73, "A warmly reviewed home-based studio in North Perth where Tinnie has built a devoted clientele over years of consistent, meticulous nail work. Specialising in BIAB, extensions and shellac that genuinely lasts 3 to 4 weeks without lifting.",
            ["BIAB $70", "Shellac Manicure $55", "Gel Full Set $100", "Pedicure $65"]),

        new("Nails by Steph Osborne Park", "nails-by-steph-osborne-park", "nails", "Osborne Park", "6017",
            "45 Roberts Street, Osborne Park WA 6017", null, null, "@nailsbystephperth",
            5.0, 42, "Steph is celebrated throughout Perth for taking nail health seriously — no cutting corners on prep or product quality. A home-based studio in Osborne Park offering BIAB, gel extensions and pedicures in a calm, professional environment.",
            ["BIAB $72", "Gel Extensions $105", "Classic Manicure $45", "Spa Pedicure $72"]),

        new("Breathe Beauty Wembley", "breathe-beauty-wembley", "nails", "Wembley", "6014",
            "52 Grantham Street, Wembley WA 6014", null, null, "@breathebeautywembley",
            5.0, 483, "One of Perth's most-reviewed beauty salons, Breathe Beauty in Wembley has earned their extraordinary reputation through consistently excellent nail and beauty services. A wonderful family business that goes above and beyond for every client, every time.",
            ["Gel Manicure $65", "Pedicure $75", "BIAB $75", "Waxing from $20", "Lashes from $120"]),

        new("Langley Park Nails East Perth", "langley-park-nails-east-perth", "nails", "East Perth", "6004",
            "Shoppe on Langley Park, 30 Terrace Road, East Perth WA 6004", null, null, "@langleyparknails",
            4.9, 49, "Beautifully positioned inside the Shoppe on Langley Park overlooking Perth's iconic waterfront precinct. Known for a neat, professional finish and a relaxing salon experience that clients return to repeatedly.",
            ["Gel Full Set $90", "BIAB $75", "Pedicure $70", "Classic Manicure $45"]),

        new("Ador Nails Shenton Park", "ador-nails-shenton-park", "nails", "Shenton Park", "6008",
            "Shenton Village, 159 Onslow Road, Shop 9, Shenton Park WA 6008", null, null, "@adornailsperth",
            5.0, 10, "A fresh addition to Shenton Village's boutique shopping precinct, Ador Nails brings quality gel and BIAB nail services to the inner-western suburbs. Already earning five-star reviews from their growing local clientele.",
            ["BIAB $72", "Gel Manicure $62", "Pedicure $68"]),

        new("Le Pretty Little Squad Perth CBD", "le-pretty-little-squad-perth-cbd", "nails", "Perth", "6000",
            "534 Murray Street, Perth WA 6000", null, null, "@leprettylittlesquad",
            5.0, 46, "A standout nail salon on Murray Street in the Perth CBD, praised for their huge range of beautiful colour options, impeccably clean premises and a warm, welcoming team. An easy favourite for CBD workers and visitors alike.",
            ["Gel Full Set $88", "Classic Polish $35", "Gel Manicure $62", "Pedicure $72"]),

        new("Fountain of Youth Floreat", "fountain-of-youth-floreat", "nails", "Floreat", "6014",
            "Shop 36 Floreat Forum Shopping Centre, 5 Howtree Place, Floreat WA 6014", null, null, "@fountainofyouthperth",
            4.9, 960, "With nearly a thousand reviews and consistently close-to-perfect ratings, Fountain of Youth at Floreat Forum is one of Perth's most trusted beauty destinations. Offering nails, waxing, facials and more, their friendly team makes every client feel at home.",
            ["Gel Manicure $65", "Pedicure $75", "BIAB $75", "Waxing from $18", "Facials from $80"]),

        new("Amoura Beauty Studio Eglinton", "amoura-beauty-studio-eglinton", "nails", "Eglinton", "6034",
            "28 Mavericks Street, Eglinton WA 6034", null, null, "@amourabeautystudio",
            5.0, 97, "Serving Perth's growing northern corridor, Amoura Beauty Studio in Eglinton has quickly become the go-to nail destination for locals who want expert technique without travelling to the CBD. Celebrated for beautiful, long-lasting results and a calming appointment experience.",
            ["Gel Full Set $90", "BIAB $75", "Pedicure $70", "Nail Art from $15"]),

        new("Waxworks Skin and Beauty Perth CBD", "waxworks-skin-and-beauty-perth-cbd", "nails", "Perth", "6000",
            "50 St Georges Terrace, Shop 5, Perth WA 6000", null, null, "@waxworksskinbeauty",
            4.9, 233, "A well-established CBD beauty salon offering nails, waxing and skin services steps from the heart of the Perth business district. Praised for their professional, efficient service that suits the CBD clientele's busy schedules — without compromising on quality.",
            ["Gel Manicure $60", "Pedicure $70", "Eyebrow Wax $22", "Full Leg Wax $65"]),

        new("Seu Momento Beauty Subiaco", "seu-momento-beauty-subiaco", "nails", "Subiaco", "6008",
            "18 Hood Street, Subiaco WA 6008", null, null, "@seumomentobeauty",
            5.0, 245, "A warmly celebrated Brazilian-style beauty studio in Subiaco that has captured Perth's hearts. Seu Momento brings passion, professionalism and genuine care to every nail and massage service — their team are known for going above and beyond for every client.",
            ["Gel Manicure $65", "Massage 60min $95", "Pedicure $75"]),

        new("Tokyo Hair Collection Perth CBD", "tokyo-hair-collection-perth-cbd", "nails", "Perth", "6000",
            "580 Hay Street, Perth WA 6000", null, null, "@tokyohaircollectionperth",
            4.9, 6731, "Perth CBD's most-reviewed beauty destination by a wide margin. Hair Collection Tokyo offers a comprehensive menu spanning nails, hair, and beauty services. With nearly 7,000 reviews and consistent five-star ratings, the numbers speak for themselves.",
            ["Nails from $45", "Hair Cut & Style from $85", "Colour from $150"]),

        new("Viva Nails Subiaco", "viva-nails-subiaco", "nails", "Subiaco", "6008",
            null, null, null, "@vivanailssubiaco",
            4.5, 38, "A reliable and popular nail salon in Subiaco offering a full range of nail services including gel sets, pedicures and nail art. Conveniently located for Subiaco locals and workers.",
            ["Gel Full Set $85", "Pedicure $68", "Classic Manicure $42", "Acrylic Set $80"]),

        new("Crossways Nails Subiaco", "crossways-nails-subiaco", "nails", "Subiaco", "6008",
            null, null, null, null,
            4.4, 55, "A long-standing favourite for Subiaco nail clients. Crossways Nails provides reliable, affordable nail services with a professional team that keeps regulars coming back.",
            ["Gel Manicure $58", "Pedicure $65", "Full Set $80", "Polish Change $25"]),

        new("The Nail Depot Subiaco", "the-nail-depot-subiaco", "nails", "Subiaco", "6008",
            null, null, null, null,
            4.3, 44, "Subiaco's go-to for efficient, no-fuss nail services. The Nail Depot is praised for consistent quality, reasonable pricing and a welcoming atmosphere for both regular clients and first-time visitors.",
            ["Gel Manicure $60", "Full Set $82", "Pedicure $68"]),

        // ===== HAIR (15) =====
        new("Harper Hair Subiaco", "harper-hair-subiaco", "hair", "Subiaco", "6008",
            "Shop 16/375 Hay Street, Subiaco WA 6008", "0435 689 859", "https://www.harperhair.com.au", "@harperhairsubiaco",
            4.9, 120, "Perth's premier destination for blonde hair, balayage and lived-in colour, Harper Hair in Subiaco attracts colour-obsessed clients from across the city. Their team of highly skilled colorists specialises in creating sun-kissed, natural-looking blondes and seamless extensions.",
            ["Balayage from $220", "Full Colour from $150", "Cut & Blow Dry $95", "Extensions from $500"]),

        new("Circles of Hair Perth", "circles-of-hair-perth", "hair", "Perth", "6000",
            "296 Fitzgerald Street, Perth WA 6000", "1300 160 198", "https://circlesofhair.com.au", "@circlesofhair",
            4.9, 310, "Australia's most awarded hair salon for 2026, Circles of Hair has set the benchmark for professional styling in Perth. Renowned for their exceptional extensions programme — the team even manufactures their own extensions to meet their uncompromising quality standards.",
            ["Cut & Style from $100", "Balayage from $250", "Tape Extensions from $600", "Colour from $160"]),

        new("Status Hair Studio Mount Lawley", "status-hair-studio-mount-lawley", "hair", "Mount Lawley", "6050",
            "Shop 8, 83 Walcott Street, Mount Lawley WA 6050", null, null, "@statushairmountlawley",
            4.8, 185, "A highly regarded L'Oreal preferred salon nestled in the heart of Mount Lawley. Status Hair combines expert cuts, creative colour and the added convenience of an in-house brow studio and lash artistry service — Perth's ultimate one-stop beauty destination.",
            ["Cut & Style from $90", "Balayage from $230", "Colour from $140", "Brows from $35"]),

        new("Harfoner Hair South Fremantle", "harfoner-hair-south-fremantle", "hair", "Fremantle", "6162",
            "264 South Terrace, South Fremantle WA 6162", null, null, "@harfonerhair",
            4.8, 140, "A distinctively Scandinavian-inspired salon in South Fremantle, Harfoner Hair floods their bright, pale-wood interior with natural light and creative energy. Specialists in beautiful natural blondes, balayage, and vibrant fashion colours — all using predominantly vegan and cruelty-free products including Olaplex.",
            ["Cut & Style from $85", "Balayage from $210", "Colour from $130", "Treatments from $60"]),

        new("Samson and Delilah Subiaco", "samson-and-delilah-subiaco", "hair", "Subiaco", "6008",
            null, null, null, "@samsondelilahperth",
            4.7, 220, "Fashion-forward styling meets Perth's relaxed lifestyle at Samson & Delilah in Subiaco. Wella professionals specialising in copper transformations, platinum perfection and everything in between — delivered with the warm, unhurried atmosphere that Subiaco does best.",
            ["Cut & Style from $95", "Colour from $150", "Balayage from $240", "Toner from $80"]),

        new("Chilli Couture Pure Hair Indulgence Highgate", "chilli-couture-highgate", "hair", "Highgate", "6003",
            null, null, null, "@chillicoutureperth",
            4.8, 175, "Australia's first 100% organic hair salon, Chilli Couture in Highgate has been a trailblazer for sustainable beauty in Perth. Using only vegan, biodegradable products with ammonia and carcinogen-free colours, they deliver fashion cuts and vibrant colours with a conscience.",
            ["Cut & Style from $88", "Organic Colour from $160", "Balayage from $220", "Extensions from $450"]),

        new("Renos on St Quentin Claremont", "renos-on-st-quentin-claremont", "hair", "Claremont", "6010",
            "Shop 149, Claremont Quarter Shopping Centre, Claremont WA 6010", null, null, "@renosstquentin",
            4.7, 195, "Perfectly positioned inside the prestigious Claremont Quarter, Renos on St Quentin serves Claremont's discerning clientele with expert cuts, colour and styling. A trusted institution for the western suburbs, consistently delivering polished results in a sleek, upmarket environment.",
            ["Women's Cut & Style from $98", "Balayage from $240", "Full Colour from $155", "Blow Dry $65"]),

        new("Paris Rose Hair Artistry Subiaco", "paris-rose-hair-artistry-subiaco", "hair", "Subiaco", "6008",
            null, null, null, "@parisroseperth",
            4.9, 88, "Paris is widely regarded as one of Perth's most gifted colourists — a true artist when it comes to cutting, colouring and styling. Her Subiaco studio has a devoted following of women who trust her completely to uncover their best look. Book ahead as her calendar fills fast.",
            ["Cut & Style from $95", "Balayage from $250", "Colour Correction from $300", "Treatments $70"]),

        new("Hair Collection Tokyo Perth CBD", "hair-collection-tokyo-perth-cbd", "hair", "Perth", "6000",
            "580 Hay Street, Level 2, Perth WA 6000", null, null, "@haircollectiontokyo",
            4.9, 6731, "Perth CBD's single most-reviewed beauty business, Hair Collection Tokyo at 580 Hay Street has earned their extraordinary reputation through thousands of consistently outstanding appointments. Offering specialist anime-style lashes, expert colour and a dedicated team that makes every visit memorable.",
            ["Women's Cut from $85", "Colour from $140", "Lashes from $120", "Brows from $35"]),

        new("Los Pastel Subiaco", "los-pastel-subiaco", "hair", "Subiaco", "6008",
            null, null, null, "@lospastelperth",
            4.8, 95, "Subiaco's creative blonde specialists. Los Pastel is the salon Perth's blondes turn to when they want truly expert colour work — from high lift blondes and toners to creative balayage and pastel fashion shades. A fun, bright space with a team as passionate as their clients.",
            ["Balayage from $230", "Toning from $90", "Blonde Highlights from $180", "Cut from $85"]),

        new("Maurice Meade Subiaco", "maurice-meade-subiaco", "hair", "Subiaco", "6008",
            null, null, null, "@mauricemeadeperth",
            4.7, 310, "Part of Perth's most prestigious luxury salon group with ten locations across the city, Maurice Meade Subiaco delivers the group's hallmark blonde expertise and elevated service experience. One of Perth's most recognised names in professional haircare.",
            ["Cut & Style from $105", "Balayage from $270", "Full Colour from $175", "Treatments from $80"]),

        new("Maurice Meade Claremont", "maurice-meade-claremont", "hair", "Claremont", "6010",
            null, null, null, "@mauricemeadeperth",
            4.7, 275, "The Claremont outpost of Maurice Meade brings the luxury group's renowned blonde expertise to Perth's prestigious western suburbs. Impeccable service, beautiful results and the signature upmarket salon experience that Maurice Meade is known for across all ten Perth locations.",
            ["Cut & Style from $105", "Balayage from $270", "Full Colour from $175"]),

        new("Djurra Fremantle", "djurra-fremantle", "hair", "Fremantle", "6160",
            null, null, null, "@djurrafremantle",
            4.7, 145, "Fremantle's beloved all-in-one salon and spa, Djurra covers everything from expert fashion cuts and colour to relaxing skin treatments and massage. A true Fremantle institution that embodies the port city's creative, laid-back spirit.",
            ["Cut & Style from $88", "Colour from $140", "Facial from $90", "Massage from $85"]),

        new("Renee Yates Bicton", "renee-yates-bicton", "hair", "Bicton", "6157",
            null, null, null, "@reneeyateshair",
            4.9, 72, "A sleek, serene salon in Bicton where Renee and her team deliver total transformations over a barista-quality coffee. Praised for their genuine desire to find each client's best look — a welcome alternative to the busyness of city salons.",
            ["Women's Cut from $90", "Balayage from $220", "Colour from $145", "Blow Dry $55"]),

        // ===== WELLNESS (Ember Bathhouse) =====
        new("Ember Bathhouse Osborne Park", "ember-bathhouse-osborne-park", "wellness", "Osborne Park", "6017",
            null, null, null, "@emberbathhouse",
            4.9, 3652, "Osborne Park's extraordinary spa and bathhouse experience with nearly 4,000 five-star reviews. Ember Bathhouse offers a sanctuary of heat, steam and relaxation treatments that have made it one of Perth's most beloved wellness destinations since opening.",
            ["Bathhouse Access from $45", "Massage from $95", "Couples Packages from $220"]),

        // ===== LASHES (12) =====
        new("Glam Eyelash Extensions East Perth", "glam-eyelash-extensions-east-perth", "lashes", "East Perth", "6004",
            "7/8 Adelaide Terrace, East Perth WA 6004", "0497 833 273", "https://www.glameyelashextensions.com.au", "@glam_eyelashextensions",
            4.9, 185, "East Perth's premier lash studio specialising in Volume, Wispy, Wet Look and Fox Eye extensions, plus lash lifts. The team at Glam Eyelash also offers professional lash supplies retail and runs a respected lash training academy — making them one of Perth's most comprehensive lash destinations.",
            ["Classic Full Set $120", "Hybrid Full Set $150", "Volume Full Set $170", "Lash Lift $85", "Infill from $75"]),

        new("Lash Nap Studio Mount Lawley", "lash-nap-studio-mount-lawley", "lashes", "Bedford", "6052",
            "91 May Street, Bedford WA 6052", "0481 869 889", "https://www.lashnapstudio.com.au", "@lash.nap.studio",
            4.8, 120, "A dedicated lash studio in Mount Lawley focused on enhancing natural beauty through expert eyelash extensions, lash lifts and tints, and brow services. The name says it all — a treatment so relaxing, clients regularly nap through their appointments.",
            ["Classic Full Set $130", "Volume Full Set $160", "Lash Lift & Tint $95", "Infill from $70"]),

        new("Perth Lash Extensions West Perth", "perth-lash-extensions-west-perth", "lashes", "West Perth", "6005",
            "Shop 13, Plaistowe Mews, 102 Railway Street, West Perth WA 6005", "(08) 6245 7556", "https://perthlashextensions.com.au", "@perthtanslashbeauty",
            4.8, 340, "Experts in eyelash extensions since 2011, Perth Lash Extensions operates from convenient locations in West Perth and North Perth with free parking and evening appointments available. One of Perth's most established lash businesses with over a decade of experience.",
            ["Classic Full Set $135", "Hybrid $155", "Volume $175", "Mega Volume $195", "Lash Lift $90"]),

        new("Perth Lash Extensions North Perth", "perth-lash-extensions-north-perth", "lashes", "North Perth", "6006",
            "Shop 4, 265 Walcott Street, North Perth WA 6006", "(08) 6245 7552", "https://perthlashextensions.com.au", "@perthtanslashbeauty",
            4.8, 280, "The North Perth location of Perth's most established lash studio, offering the same expert classic, hybrid and volume extensions since 2011. Evening appointments and free parking make this a favourite for busy working women across the northern suburbs.",
            ["Classic Full Set $135", "Hybrid $155", "Volume $175", "Lash Lift $90", "Infill from $75"]),

        new("Mollylash Wembley", "mollylash-wembley", "lashes", "Wembley", "6014",
            "Shop 2, 334 Cambridge Street, Wembley WA 6014", "0416 370 290", "https://mollylash.com.au", "@ilovemollylash",
            4.8, 225, "A highly respected Perth lash and brow studio offering premier eyelash extensions, brow tinting and lamination, eyebrow microblading and cosmetic tattooing across their Wembley and Carlisle locations. Mollylash has built a devoted following for their natural-looking, long-lasting results.",
            ["Classic Full Set $130", "Hybrid $150", "Lash Lift $90", "Brow Lamination $85", "Microblading from $450"]),

        new("Mollylash Carlisle", "mollylash-carlisle", "lashes", "Carlisle", "6101",
            "Shop 2, 31 Archer Street, Carlisle WA 6101", "0416 370 290", "https://mollylash.com.au", "@ilovemollylash",
            4.8, 198, "The Carlisle location of one of Perth's favourite lash and brow studios. Mollylash brings the same trusted standard of care to the eastern suburbs — natural-looking lash extensions, lash lifts, and expert brow services in a welcoming studio environment.",
            ["Classic Full Set $130", "Hybrid $150", "Lash Lift $90", "Brow Lamination $85"]),

        new("Lash Magnifique Aubin Grove", "lash-magnifique-aubin-grove", "lashes", "Aubin Grove", "6164",
            null, "0481 245 859", "https://www.lashmagnifique.com.au", "@lashmagnifiquebeauty",
            4.9, 88, "Jean at Lash Magnifique runs a private, one-on-one home studio near Fremantle offering premium lash extensions in an unhurried, personal environment. Certified and experienced, every appointment includes a thorough consultation, patch test option and detailed aftercare advice.",
            ["Classic Set $120", "Natural Wispy $140", "Mega Volume from $170", "Infill from $70", "Lash Lift $90"]),

        new("Fab Lash and Beauty Perth", "fab-lash-and-beauty-perth", "lashes", "Perth", "6000",
            null, null, null, "@fablashandbeauty",
            4.7, 165, "A well-regarded lash and beauty studio in the Perth CBD precinct offering a comprehensive range of lash sets, brow services and beauty treatments. Known for their professional team and consistently well-executed results that keep city clients returning.",
            ["Classic Full Set $125", "Volume $158", "Lash Lift & Tint $92", "Brow Wax & Tint $55"]),

        new("Stripz Perth Lashes and Brows", "stripz-perth-lashes-brows", "lashes", "Perth", "6000",
            null, null, null, "@stripzperth",
            4.6, 112, "Specialising in lash extensions and brow services across the Perth CBD, Stripz has built a loyal following for their meticulous technique and reliable results. A popular choice for CBD professionals who want efficient, high-quality lash and brow maintenance.",
            ["Classic Lash Set $120", "Hybrid $145", "Lash Lift $88", "Brow Lamination $82", "Brow Wax $28"]),

        new("iBeautiq Lashes and Brows Perth", "ibeautiq-lashes-brows-perth", "lashes", "Perth", "6000",
            null, null, null, "@ibeautiqperth",
            4.7, 145, "A specialist lash and brow studio in Perth offering meticulous lash extensions, lifts, tints and brow treatments. Their attention to detail and commitment to beautiful, natural-looking results has earned them a strong following among Perth's beauty community.",
            ["Classic Full Set $128", "Hybrid $150", "Volume $168", "Lash Lift $88", "Brow Lamination $80"]),

        new("Cynthia's Beauty Salon Perth", "cynthias-beauty-salon-perth", "lashes", "Perth", "6000",
            null, null, null, "@cynthiasbeautysalon",
            4.6, 98, "A trusted Perth beauty salon offering lash extensions alongside a broad beauty service menu. Cynthia's team are known for their warmth, professionalism and ability to create flattering lash looks for every eye shape and style preference.",
            ["Classic Lash Set $118", "Hybrid $142", "Lash Lift & Tint $88", "Beauty Treatments from $50"]),

        new("Belle Sorelle Lashes Perth", "belle-sorelle-lashes-perth", "lashes", "Perth", "6000",
            null, null, null, "@bellesorelleperth",
            4.8, 178, "Belle Sorelle is celebrated for delivering consistently beautiful, flirtatious lash sets across a full range of styles — from natural classics to dramatic mega volumes. Their studio has built a devoted client base who trust them completely for their lash look.",
            ["Classic $125", "Hybrid $150", "Volume $168", "Mega Volume $195", "Infill from $72"]),

        // ===== BROWS (10) =====
        new("Ellie Dunne Collective Claremont", "ellie-dunne-collective-claremont", "brows", "Claremont", "6010",
            "23/337-339 Stirling Highway, Claremont WA 6010", "0451 234 268", "https://www.elliedunnecollective.com", "@elliedunnecollective",
            4.9, 340, "Claremont's most celebrated brow and beauty studio, Ellie Dunne Collective has earned its place in every savvy Perth woman's speed-dial. Ellie and her talented team offer microblading, feather-touch tattooing, brow lamination, lash lifts, spray tans and makeup applications — all from their gorgeous Claremont studio.",
            ["Microblading from $550", "Brow Lamination $88", "Lash Lift $95", "Spray Tan $55", "Makeup from $150"]),

        new("Your Eyes Only Brow Studio Perth", "your-eyes-only-brow-studio-perth", "brows", "Subiaco", "6008",
            "29 Catherine Street, Subiaco WA 6008", null, "https://www.youreyesonlyhq.com", "@youreyesonly_browstudio",
            4.8, 280, "Perth's leading dedicated brow studio, Your Eyes Only has made Racheal Keeley and her team the go-to for brow transformations across the city. From gentle waxing and shaping to permanent microblading and training masterclasses, they are Perth's foremost brow authorities.",
            ["Brow Wax & Tint $55", "Brow Lamination $88", "Microblading from $520", "Henna Brows $75"]),

        new("Elka Clinic Subiaco", "elka-clinic-subiaco", "brows", "Subiaco", "6008",
            "3/29 Hood Street, Subiaco WA 6008", "1300 216 456", "https://www.elkaclinic.com.au", "@elka.clinic",
            4.9, 195, "A highly regarded permanent makeup and brow clinic in Subiaco, Elka Clinic specialises in eyebrow tattooing, nano brows, eyeliner tattoo, lip blush and microneedling. Their pharmacist-backed team brings both artistry and clinical knowledge to every treatment.",
            ["Nano Brows from $580", "Eyeliner Tattoo from $480", "Lip Blush from $550", "Microneedling from $220"]),

        new("Holly Garvey Brow Studio Leederville", "holly-garvey-brow-studio-leederville", "brows", "Leederville", "6007",
            "324 Oxford Street, Leederville WA 6007", null, "https://www.hollygarvey.com", "@hollygarvey_beautydestination",
            4.9, 155, "Holly Garvey's boutique studio on Oxford Street in Leederville is the destination for those seeking beautifully shaped brows, semi-permanent makeup and lash lifts. Offering microblading, combination brows, soft powder brows and Yumi lash lifts — all with meticulous technique and thorough consultation.",
            ["Microblading from $540", "Brow Lamination $85", "Henna Brows $65", "Lash Lift $90", "Wax & Tint $52"]),

        new("Alison Jade Cottesloe", "alison-jade-cottesloe", "brows", "Cottesloe", "6011",
            null, null, null, "@alisonjadebrows",
            4.9, 310, "Alison Jade put Perth brows on the map and remains at the absolute forefront of the city's brow obsession. From her luxurious Cottesloe salon, Alison and her team deliver personalised consultations followed by expert waxing, tinting, henna, lamination and feather tattooing — with a second location now open in Melbourne.",
            ["Brow Wax & Tint $62", "Brow Lamination $95", "Feather Tattoo from $620", "Henna Brows $80"]),

        new("OJ Face Maylands", "oj-face-maylands", "brows", "Maylands", "6051",
            null, null, null, "@ojfaceperth",
            4.8, 220, "Gemma at OJ Face is celebrated throughout Perth for her ability to create soft, natural arches through expert waxing and tinting — brows so beautiful clients immediately rebook before leaving. Located within Museo Hair Collective in Maylands, OJ Face also offers dermal therapy facials and skin treatments.",
            ["Brow Wax & Tint $58", "Brow Lamination $90", "Facials from $110", "Power Peel $145"]),

        new("Elka Brows Subiaco", "elka-brows-subiaco", "brows", "Subiaco", "6008",
            "3/29 Hood Street, Subiaco WA 6008", "1300 216 456", "https://www.elkaclinic.com.au", "@elka.clinic",
            4.8, 145, "Sister studio to Elka Clinic, Elka Brows on Hood Street in Subiaco specialises in eyebrow tattooing, microblading, feathering and scalp micropigmentation. A trusted Subiaco destination for those seeking precise, semi-permanent brow results.",
            ["Microblading from $560", "Nano Brows from $580", "Brow Feathering from $520"]),

        new("Rachel Lavelle Beauty Perth", "rachel-lavelle-beauty-perth", "brows", "Perth", "6000",
            null, null, null, "@rachellavellebeauty",
            4.8, 175, "A premium Perth beauty studio and training academy offering brow services, cosmetic tattooing and a comprehensive roster of beauty courses. Rachel Lavelle is known for beautifully executed semi-permanent makeup and brow transformations, with results that honour each client's unique features.",
            ["Brow Lamination $88", "Microblading from $530", "Brow Wax & Tint $55", "Lash Lift $88"]),

        new("Luxury Brows at Blanc Suites Perth", "luxury-brows-blanc-suites-perth", "brows", "Perth", "6000",
            null, null, null, "@luxurybrowsperth",
            4.9, 130, "Tucked inside the exclusive Blanc Suites beauty hub, Luxury Brows is where Perth's brow obsessives go when they want truly immaculate arches. Founded for clients who refuse to compromise, this intimate studio offers exacting brow shaping, lamination and tattooing in a setting that matches the name entirely.",
            ["Brow Shaping & Tint $65", "Lamination $92", "Feather Touch Tattoo from $580"]),

        new("Katarina Callegari Brow Studio Subiaco", "katarina-callegari-brow-studio-subiaco", "brows", "Subiaco", "6008",
            null, null, null, "@katarina.callegari",
            4.9, 95, "Katarina Callegari's intimate Subiaco studio is a well-kept secret among Perth's brow connoisseurs. Specialising in feather touch, microblading, ombre and henna eyebrows, Katarina's perfectionist approach and personable nature have made her one of the city's most trusted brow artists.",
            ["Feather Touch Brows from $570", "Microblading from $550", "Ombre Brows from $580", "Henna $68"]),

        // ===== SKIN CARE (12) =====
        new("BLANC Skin Clinic Perth", "blanc-skin-clinic-perth", "skin-care", "Cottesloe", "6011",
            "8/12 Napoleon Street, Cottesloe WA 6011", "(08) 9284 5225", "https://blancskin.com.au", "@blanc_perth",
            4.9, 380, "An award-winning boutique cosmetic clinic known for its subtle, natural approach to aesthetics. BLANC offers clinical skin treatments, RF microneedling (Morpheus8), advanced skin rejuvenation, cosmetic injectables, body sculpting and luxurious Biologique Recherche facials — all delivered with understated elegance and exceptional results.",
            ["Facials from $150", "RF Microneedling from $400", "Skin Boosters from $350"]),

        new("SURSKIN West Leederville", "surskin-west-leederville", "skin-care", "West Leederville", "6007",
            null, null, null, "@surskinperth",
            4.9, 220, "SURSKIN in West Leederville goes well beyond conventional beauty treatments. This holistic skincare and aesthetics clinic offers transformative holistic facials, skin boosters, dermal energy therapies, injectables and lymphatic drainage massage — an approach designed to nurture skin, face, body and inner wellbeing simultaneously.",
            ["Holistic Facial from $130", "Skin Boosters from $350", "Dermal Therapy from $180"]),

        new("Youth Lab Claremont", "youth-lab-claremont", "skin-care", "Claremont", "6010",
            "221 Stirling Highway, Claremont WA 6010", null, null, "@youthlabperth",
            4.9, 440, "Youth Lab pairs advanced dermal and medical technologies with luxurious clinic environments across three Perth locations. At their flagship Claremont clinic they offer premium facials with medical-grade cosmeceuticals, mesotherapy, clinical peels, lasers and non-surgical cosmetic injectables.",
            ["Signature Facial from $150", "Mesotherapy from $350", "Clinical Peel from $180"]),

        new("Youth Lab Joondalup", "youth-lab-joondalup", "skin-care", "Joondalup", "6027",
            null, null, null, "@youthlabperth",
            4.8, 280, "Youth Lab's northern suburbs clinic brings the same advanced dermal technologies and luxury clinic experience to Joondalup. Expert facials, clinical peels, mesotherapy and cosmetic injectables delivered by a skilled team in a beautiful, premium environment.",
            ["Signature Facial from $150", "Clinical Peel from $180", "Mesotherapy from $350"]),

        new("Erin Aesthetics Subiaco", "erin-aesthetics-subiaco", "skin-care", "Subiaco", "6008",
            "7/513 Hay Street, Subiaco WA 6008", "0405 188 884", "https://www.erinaesthetics.com.au", "@erinaesthetics",
            4.9, 165, "Trained by world-class medical professionals and anti-ageing leaders, Erin Aesthetics is a premium Subiaco-based clinic maintaining exceptional standards across medical-grade peels, skin needling and mesotherapy. Known for their honesty-first approach and loyal clientele who trust them with their most complex skin concerns.",
            ["Medical Peel from $180", "Skin Needling from $280", "Mesotherapy from $320"]),

        new("SOOTHE Massage and DaySpa Nedlands", "soothe-massage-and-dayspa-nedlands", "skin-care", "Nedlands", "6009",
            "163 Stirling Highway, Nedlands WA 6009", "(08) 9322 1886", "https://www.soothespaperth.com", "@soothe_dayspa",
            4.9, 310, "A refined 240sqm luxury day spa in the heart of Nedlands, SOOTHE is Perth's sanctuary for those who want true restoration. HydroPeptide facials, customised remedial massage, couples experiences, a German-designed infrared sauna and head spa treatments — all curated to slow the breath, soften the body and gently reset the mind.",
            ["Signature Facial $165", "Remedial Massage 60min $110", "Couples Massage from $220", "Infrared Sauna $55"]),

        new("OJ Face Skin Clinic Maylands", "oj-face-skin-clinic-maylands", "skin-care", "Maylands", "6051",
            null, null, null, "@ojfaceperth",
            4.8, 195, "A results-driven dermal therapy clinic at Museo Hair Collective in Maylands, OJ Face offers some of Perth's most acclaimed facials — power peels targeting pigmentation and fine lines, skin needling for collagen stimulation and dermaplaning for flawless makeup application. Expert, caring and consistently impressive results.",
            ["Power Peel $145", "Skin Needling $285", "Dermaplaning $110", "Facial from $95"]),

        new("Clearskin Clinic Claremont", "clearskin-clinic-claremont", "skin-care", "Claremont", "6010",
            null, null, null, "@clearskinperth",
            4.7, 520, "One of Perth's most established skin clinic groups with multiple locations, Clearskin's Claremont clinic offers laser treatments, skin rejuvenation, facials and cosmetic services. A trusted name across the western suburbs for clinical skin results.",
            ["Facial from $95", "Skin Needling from $260", "IPL from $120"]),

        new("Ella Bache Perth CBD", "ella-bache-perth-cbd", "skin-care", "Perth", "6000",
            null, null, "https://www.ellabache.com.au", "@ellabacheperth",
            4.8, 155, "Perth's outpost of France's legendary Ella Bache skincare brand. Clients have been loyal to this CBD clinic for years, drawn by the excellent service, premium French skincare products and an unhurried, calming treatment experience that stands apart from busier city salons.",
            ["Ella Bache Facial from $110", "Express Facial $65", "Waxing from $25"]),

        new("Fountain of Youth Beauty Floreat", "fountain-of-youth-beauty-floreat", "skin-care", "Floreat", "6014",
            "Shop 36 Floreat Forum Shopping Centre, Floreat WA 6014", null, null, "@fountainofyouthfloreat",
            4.9, 960, "With nearly 1,000 glowing reviews, Fountain of Youth at Floreat Forum is one of Perth's most beloved all-in-one beauty destinations. Their skin treatments, facials and waxing services have earned a devoted following of clients who simply won't go anywhere else.",
            ["Facial from $85", "Microdermabrasion $110", "Waxing from $18", "Gel Nails $65"]),

        // ===== COSMETIC (5) =====
        new("Absolute Cosmetics Nedlands", "absolute-cosmetics-nedlands", "cosmetic", "Nedlands", "6009",
            null, null, null, "@absolutecosmeticsperth",
            4.9, 680, "Nedlands' premier cosmetic clinic, praised by clients for staff who are amazing, professional and genuinely caring. Absolute Cosmetics offers a comprehensive range of cosmetic injectables, skin treatments and aesthetic services — all delivered with the highest clinical standards and a natural-looking results philosophy.",
            ["Anti-Wrinkle from $12/unit", "Filler from $550", "Skin Booster from $400"]),

        new("Absolute Cosmetics Joondalup", "absolute-cosmetics-joondalup", "cosmetic", "Joondalup", "6027",
            null, null, null, "@absolutecosmeticsperth",
            4.9, 540, "The Joondalup location of Perth's beloved Absolute Cosmetics brings the group's trusted standard of cosmetic care to the northern suburbs. Expert injectables, skin treatments and aesthetic consultations from a team as skilled as they are warm.",
            ["Anti-Wrinkle from $12/unit", "Lip Filler from $550", "Skin Booster from $400"]),

        new("Clearskin Clinic Joondalup", "clearskin-clinic-joondalup", "cosmetic", "Joondalup", "6027",
            null, null, null, "@clearskinperth",
            4.7, 380, "The Joondalup location of Perth's trusted multi-location skin clinic group. Clearskin Joondalup delivers laser treatments, IPL, skin needling and cosmetic injectables for northern Perth clients seeking clinical results without travelling south.",
            ["IPL from $120", "Skin Needling from $260"]),

        new("Youth Lab West Perth", "youth-lab-west-perth", "cosmetic", "West Perth", "6005",
            null, null, null, "@youthlabperth",
            4.8, 320, "Youth Lab's West Perth clinic sits at the premium end of Perth's cosmetic and dermal therapy market. With advanced medical-grade technology, a skilled clinical team and a reputation for natural-looking results, Youth Lab West Perth is the destination for those who want the very best.",
            ["Clinical Facials from $150"]),

        new("Sara Lavis Aesthetics Mount Hawthorn", "sara-lavis-aesthetics-mount-hawthorn", "cosmetic", "Mount Hawthorn", "6016",
            "419 Oxford Street, Mount Hawthorn WA 6016", null, null, "@saralavisaesthetics",
            4.9, 195, "Founded by cosmetic and emergency nurse Sara Lavis, this boutique Mount Hawthorn clinic has built a devoted following through expert, natural-looking cosmetic injectables and a genuinely caring approach. Sara's clinical background means every treatment is delivered with real medical expertise and an aesthetic eye for natural enhancement.",
            ["Anti-Wrinkle from $12/unit", "Lip Filler from $550", "Cheek Filler from $650"]),

        // ===== MAKEUP (8) =====
        new("Asha Artistry Joondalup", "asha-artistry-joondalup", "makeup", "Joondalup", "6027",
            "2/37 Piccadilly Circle, Joondalup WA 6027", "0474 129 800", "https://www.ashaartistry.com.au", "@asha.artistry",
            4.9, 185, "Joondalup's premier makeup and hair studio for bridal parties, events and everyday glam. Asha Artistry offers airbrushed makeup, brow artistry, spray tanning and professional hairstyling — their bridal packages are celebrated for seamless communication, impeccable results and making brides feel a million dollars on their most important day.",
            ["Bridal Makeup from $220", "Bridesmaid Makeup from $120", "Spray Tan $55"]),

        new("Belladure Professional Makeup Perth", "belladure-professional-makeup-perth", "makeup", "Perth", "6000",
            null, null, null, "@belladureperth",
            4.8, 145, "A professional mobile makeup team serving weddings, balls and special occasions across the greater Perth metro area. Belladure are praised for their impeccable attention to detail, natural enhancement philosophy and ability to make every client feel genuinely beautiful — not just made up.",
            ["Bridal Makeup from $250", "Event Makeup from $130", "Trial from $150"]),

        new("Luxury Makeup House Perth", "luxury-makeup-house-perth", "makeup", "Perth", "6000",
            null, null, null, "@luxurymakeuphouse",
            4.8, 120, "An experienced team of professional makeup artists devoted to creating the most stunning version of every bride and event client. Luxury Makeup House brings professionalism, premium products and genuine pampering to every appointment.",
            ["Bridal Makeup from $240", "Event Makeup $130"]),

        new("Belle James Makeup Perth", "belle-james-makeup-perth", "makeup", "Perth", "6000",
            null, null, null, "@bellejamesmakeup",
            4.8, 95, "Belle has built her reputation on a broad range of makeup skills and an unwavering passion for enhancing natural beauty in the most effective, flattering way. From bridal and special occasions to everyday glam and editorial work, Belle's approach is always tailored uniquely to the individual.",
            ["Bridal Makeup from $230", "Event Makeup from $120", "Trial Makeup $140"]),

        new("Total Brides Mobile Makeup Perth", "total-brides-mobile-makeup-perth", "makeup", "Perth", "6000",
            null, null, null, "@totalbridesperth",
            4.7, 165, "A fully mobile team of Hair, Makeup and Beauty specialists who come directly to the bride's home or hotel — removing all wedding morning stress. Total Brides covers hair styling, makeup, spray tans, extensions and accessories, making them a genuinely comprehensive bridal beauty partner.",
            ["Bridal Hair & Makeup from $350", "Bridesmaid from $130", "Spray Tan $55"]),

        new("Bellissimo Makeup and Eyelashes Perth", "bellissimo-makeup-and-eyelashes-perth", "makeup", "Perth", "6000",
            null, null, null, "@bellissimomakeup",
            4.8, 110, "Krystal at Bellissimo specialises in subtle contouring, highlighting and timeless makeup that photographs beautifully. Her individual approach ensures each bride and event client looks fresh, confident and uniquely themselves — never over-done or cookie-cutter.",
            ["Bridal Makeup from $220", "Event Makeup $125", "Trial from $140"]),

        new("House of Haylo Bridal Makeup Perth", "house-of-haylo-bridal-makeup-perth", "makeup", "Perth", "6000",
            null, null, null, "@houseofhaylo",
            4.8, 88, "A talented bridal styling team who listen carefully and work collaboratively to create the perfect look for every bride's unique vision and personality. House of Haylo also covers brow styling, hair removal and spray tanning for complete bridal preparation.",
            ["Bridal Makeup from $230"]),

        new("Mandy To Hair and Makeup Artist Perth", "mandy-to-hair-makeup-artist-perth", "makeup", "Perth", "6000",
            null, null, null, "@mandytohairandmakeup",
            4.9, 72, "Mandy To brings genuine passion and a service-first ethos to every bridal and special occasion makeup appointment. Perth brides describe her as someone who truly listens, understands their vision and delivers results that exceed expectations — with impeccable attention to detail and real warmth.",
            ["Bridal Makeup from $240", "Bridesmaid Makeup from $115", "Hair Styling"]),

        // ===== BODY & MASSAGE (10) =====
        new("Mel's Massage and Reflexology Claremont", "mels-massage-and-reflexology-claremont", "body", "Claremont", "6010",
            null, null, null, "@melsmassageperth",
            4.9, 1339, "With nearly 1,400 five-star reviews, Mel's Massage and Reflexology in Claremont is one of Perth's most trusted and beloved massage destinations. Their expert team delivers consistently outstanding remedial and relaxation massage and reflexology in a calming, professional environment that keeps clients returning month after month.",
            ["Relaxation Massage 60min $95", "Remedial Massage $105", "Reflexology $95", "Couples $190"]),

        new("The Little Gem Spa Massage North Perth", "the-little-gem-spa-massage-north-perth", "body", "North Perth", "6006",
            null, null, null, "@thelittlegemperth",
            4.9, 2207, "A gem in every sense — The Little Gem Spa Massage in North Perth has accumulated over 2,200 glowing reviews and continues to grow their devoted following. Expert massage therapy and body treatments delivered in a beautifully appointed, relaxing space that feels a world away from everyday Perth.",
            ["Swedish Massage 60min $90", "Remedial Massage $105", "Hot Stone $120", "Couples Massage $195"]),

        new("SOOTHE Massage and DaySpa Body Nedlands", "soothe-massage-dayspa-body-nedlands", "body", "Nedlands", "6009",
            "163 Stirling Highway, Nedlands WA 6009", "(08) 9322 1886", "https://www.soothespaperth.com", "@soothe_dayspa",
            4.9, 310, "SOOTHE's 240sqm Nedlands sanctuary is Perth's most refined day spa experience. Customised remedial and relaxation massage, couples massage, infrared sauna, head spa and HydroPeptide facials — all curated to deliver true restoration in a light-filled, luxury environment that feels nothing like a typical day spa.",
            ["Remedial Massage 60min $115", "Relaxation 60min $105", "Couples $230", "Infrared Sauna $55"]),

        new("Ember Bathhouse Wellness Osborne Park", "ember-bathhouse-wellness-osborne-park", "body", "Osborne Park", "6017",
            null, null, null, "@emberbathhouse",
            4.9, 3652, "Perth's extraordinary bathhouse experience with nearly 4,000 glowing reviews. Ember offers a sequence of heat, steam, cold plunge and relaxation treatments that guide guests through genuine physical and mental restoration. Massage add-ons and private sessions available. One of Perth's most talked-about wellness experiences.",
            ["Bathhouse 2hr $55", "Bathhouse 4hr $75", "Massage from $90"]),

        new("The Head Spa Perth South Perth", "the-head-spa-perth-south-perth", "body", "South Perth", "6151",
            null, null, null, "@theheadspaperth",
            4.9, 401, "Perth's specialist head spa destination in South Perth, offering the deeply relaxing Japanese-inspired scalp treatment experience that has taken the beauty world by storm. The Head Spa Perth delivers meticulous scalp analysis, cleansing, exfoliation and nourishing treatments that leave scalp and hair genuinely transformed.",
            ["Head Spa Treatment 60min $110", "Head Spa 90min $150"]),

        new("Seu Momento Beauty Massage Subiaco", "seu-momento-beauty-massage-subiaco", "body", "Subiaco", "6008",
            "18 Hood Street, Subiaco WA 6008", null, null, "@seumomentobeauty",
            5.0, 245, "Perth's most-loved Brazilian beauty studio brings the same warmth and professionalism to massage as they do to their nails. Seu Momento's massage services are celebrated for genuine therapeutic skill — this is self-care delivered with real love and joy.",
            ["Relaxation Massage 60min $90", "Deep Tissue $100", "Brazilian Wax from $55"]),

        new("Djurra Day Spa Fremantle", "djurra-day-spa-fremantle", "body", "Fremantle", "6160",
            null, null, null, "@djurrafremantle",
            4.7, 175, "Fremantle's complete salon and spa experience, Djurra offers everything from expert hair and colour through to skin treatments, relaxation massage and body services. The spirit of Fremantle — creative, unhurried, warm — lives in every corner of this beloved institution.",
            ["Massage 60min $90", "Facial $100", "Waxing from $25", "Hair Styling from $88"]),

        new("Savasana Beauty and Wellness", "savasana-beauty-and-wellness-jurien-bay", "body", "Scarborough", "6019",
            null, null, null, "@savasanabeauty",
            5.0, 151, "A perfectly curated beauty and wellness destination with a five-star rating across 151 reviews. Savasana's private suite delivers manicures, pedicures and massage treatments in an environment clients describe as the best nail salon in Perth — personal, immaculate and utterly relaxing.",
            ["Manicure $65", "Pedicure $75", "Remedial Massage $95", "Relaxation Massage $85"]),

        new("Waxworks Skin and Beauty Body Perth CBD", "waxworks-skin-and-beauty-body-perth-cbd", "body", "Perth", "6000",
            "50 St Georges Terrace, Shop 5, Perth WA 6000", null, null, "@waxworksskinbeauty",
            4.9, 233, "Serving Perth's CBD professionals with expert waxing, spray tanning and body beauty services, Waxworks Skin and Beauty on St Georges Terrace is a CBD favourite for efficient, high-quality body treatments that fit around busy schedules.",
            ["Full Leg Wax $65", "Brazilian Wax $55", "Spray Tan $55", "Eyebrow Wax $22"]),

        new("Palm Beach Wellness Nedlands", "palm-beach-wellness-nedlands", "wellness", "Nedlands", "6009",
            null, null, null, "@palmbeachwellness",
            5.0, 76, "A beautiful wellness studio in Nedlands offering restorative fitness and wellness treatments in a calm, premium environment. Palm Beach Wellness is the destination for Nedlands and surrounds residents seeking a holistic approach to beauty and wellbeing.",
            ["Wellness Sessions from $85"]),

        // ===== WELLNESS (additional) =====
        new("Nest Day Spa Perth", "nest-day-spa-perth", "wellness", "Perth", "6000",
            null, null, null, "@nestdayspaperth",
            4.8, 285, "A beautifully designed day spa in Perth CBD offering a sanctuary of relaxation and wellness. From signature massages and facials through to specialty body treatments and wellness packages, Nest Day Spa has become one of Perth's favourite urban retreats.",
            ["Signature Massage 60min $95", "Day Spa Package from $180", "Facial from $100", "Body Wrap $130"]),

        new("Bridget Black Beauty Perth", "bridget-black-beauty-perth", "lashes", "Perth", "6000",
            null, null, null, "@bridgetblackbeauty",
            4.8, 155, "Bridget Black has earned Perth-wide recognition for expert lash extensions and beauty services. Known for a thoughtful, one-on-one approach and consistent results that look genuinely beautiful — not overdone — Bridget has built a loyal clientele who follow her wherever she sets up studio.",
            ["Classic Lash Set $125", "Hybrid $150", "Volume $168", "Lash Lift $88", "Brow Services from $45"]),

        // ===== MASSAGE (8) =====
        new("Relaxation Central Perth CBD", "relaxation-central-perth-cbd", "massage", "Perth", "6000",
            "140 William Street, Perth WA 6000", null, "https://www.fresha.com", null,
            4.8, 312, "One of the CBD's most frequented massage studios, Relaxation Central on William Street delivers expert remedial and relaxation massage to Perth's city workers. Heralded for their efficient booking system and consistently therapeutic results.",
            ["Remedial 60min $95", "Relaxation 60min $85", "Deep Tissue 60min $100"]),

        new("Oriental Massage Therapy Northbridge", "oriental-massage-therapy-northbridge", "massage", "Northbridge", "6003",
            "248 William Street, Northbridge WA 6003", null, "https://www.fresha.com", null,
            4.7, 445, "A long-established massage therapy studio in Northbridge with hundreds of loyal regulars. Specialising in traditional Eastern massage techniques including remedial, hot stone and deep tissue — affordable, consistent and therapeutic.",
            ["Relaxation 60min $70", "Remedial 60min $85", "Hot Stone 60min $90"]),

        new("Zing Remedial Massage Mount Lawley", "zing-remedial-massage-mount-lawley", "massage", "Mount Lawley", "6050",
            "643 Beaufort Street, Mount Lawley WA 6050", null, "https://www.fresha.com", null,
            4.9, 187, "Mount Lawley's go-to for expert remedial massage therapy. Zing's qualified team of remedial therapists address muscle tension, sports injuries and postural issues with thorough clinical technique and genuine care.",
            ["Remedial 60min $100", "Sports Massage 60min $105", "Relaxation 60min $90"]),

        new("The Bodywork Collective Leederville", "the-bodywork-collective-leederville", "massage", "Leederville", "6007",
            "381 Oxford Street, Leederville WA 6007", null, "https://www.fresha.com", null,
            4.9, 223, "A beloved Leederville collective of remedial massage therapists, myotherapists and allied health practitioners. The Bodywork Collective has built a reputation for thorough assessments and treatments that genuinely fix the problem.",
            ["Remedial 60min $105", "Myotherapy 60min $110", "Deep Tissue 60min $100"]),

        new("Head to Toe Beauty & Massage Fremantle", "head-to-toe-beauty-massage-fremantle", "massage", "Fremantle", "6160",
            "79 Market Street, Fremantle WA 6160", null, "https://www.fresha.com", null,
            4.8, 156, "A Fremantle staple combining beauty treatments with expert massage therapy under one roof. The warm, unpretentious Fremantle vibe extends to every treatment — professional, caring, and genuinely therapeutic.",
            ["Relaxation 60min $85", "Remedial 60min $95", "Pregnancy Massage 60min $95"]),

        new("Serenity Day Spa Claremont", "serenity-day-spa-claremont", "massage", "Claremont", "6010",
            "22 Bay View Terrace, Claremont WA 6010", null, "https://www.fresha.com", null,
            4.8, 198, "A refined Claremont day spa offering full massage and body treatment menus in a peaceful, beautifully appointed environment. Popular for couples packages, pregnancy massage and post-event recovery treatments.",
            ["Relaxation 60min $95", "Hot Stone 75min $120", "Couples 60min $190"]),

        new("Touch of Asia Massage Subiaco", "touch-of-asia-massage-subiaco", "massage", "Subiaco", "6008",
            "374 Hay Street, Subiaco WA 6008", null, "https://www.fresha.com", null,
            4.7, 289, "A well-established Subiaco massage studio specialising in traditional Thai massage, remedial, and relaxation treatments. A convenient Hay Street location and affordable pricing make this a Subiaco neighbourhood favourite.",
            ["Thai Massage 60min $75", "Remedial 60min $88", "Relaxation 60min $80"]),

        new("Revive Massage & Wellness Joondalup", "revive-massage-wellness-joondalup", "massage", "Joondalup", "6027",
            "1/34 Davidson Terrace, Joondalup WA 6027", null, "https://www.fresha.com", null,
            4.8, 143, "Joondalup's trusted remedial massage and wellness studio, offering qualified remedial therapy, relaxation massage and sports recovery treatments. Known for thorough assessments and results-focused treatments.",
            ["Remedial 60min $98", "Sports 60min $105", "Relaxation 60min $88"]),
    ];
}
