using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Locations;
using Appilico.Market.Domain.Reviews;
using Appilico.Market.Domain.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{

    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        await context.Database.MigrateAsync();

        await SeedRoles(roleManager);
        await SeedUsers(userManager);
        try { await SeedBeautyCategories(context); } catch { /* slug conflicts handled gracefully */ }
        await SeedITCategories(context);
        await SeedPerthSuburbs(context);
        await SeedAppSettings(context);
        await SeedMissingSuburbs(context);
        await UpdateSuburbCoordinates(context);
        await SeedRealProviders(context, userManager);
        await SeedWellnessProviders(context, userManager);
        await SeedDetailedProviders(context, userManager);
        await SeedITProviders(context, userManager);
        await FixDataQuality(context);
    }

    private static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
    {
        string[] roles = [UserRoles.SuperAdmin, UserRoles.Moderator, UserRoles.Provider, UserRoles.Customer];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    private static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        // Admin user
        if (await userManager.FindByEmailAsync("admin@appilico.com") == null)
        {
            var admin = new AppUser
            {
                UserName = "admin@appilico.com",
                Email = "admin@appilico.com",
                FirstName = "Admin",
                LastName = "User",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(admin, "Admin@123!");
            await userManager.AddToRoleAsync(admin, UserRoles.SuperAdmin);
        }

        // Moderator user
        if (await userManager.FindByEmailAsync("moderator@appilico.com") == null)
        {
            var mod = new AppUser
            {
                UserName = "moderator@appilico.com",
                Email = "moderator@appilico.com",
                FirstName = "Moderator",
                LastName = "User",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(mod, "Mod@12345!");
            await userManager.AddToRoleAsync(mod, UserRoles.Moderator);
        }
    }

    private static async Task SeedBeautyCategories(AppDbContext context)
    {
        var allExistingSlugs = await context.Categories
            .Where(c => c.MarketplaceType == ProviderType.Beauty)
            .Select(c => c.Slug)
            .ToListAsync();
        var existingParentSlugs = await context.Categories
            .Where(c => c.MarketplaceType == ProviderType.Beauty && c.ParentCategoryId == null)
            .Select(c => c.Slug)
            .ToListAsync();

        var beautyCategories = new (string Name, string Slug, string Icon, (string Name, string Slug)[] Subs)[]
        {
            ("Nails", "nails", "Sparkles", [
                ("Gel Nails", "gel-nails"),
                ("Acrylic Nails", "acrylic-nails"),
                ("Nail Art", "nail-art"),
                ("Manicure", "manicure"),
                ("Pedicure", "pedicure"),
                ("SNS Nails", "sns-nails")
            ]),
            ("Hair", "hair", "Scissors", [
                ("Hair Salon", "hair-salon"),
                ("Hair Colouring", "hair-colouring"),
                ("Hair Extensions", "hair-extensions"),
                ("Braiding", "braiding"),
                ("Balayage", "balayage"),
                ("Keratin Treatment", "keratin-treatment")
            ]),
            ("Lashes", "lashes", "Eye", [
                ("Lash Extensions", "lash-extensions"),
                ("Lash Lift", "lash-lift"),
                ("Lash Tinting", "lash-tinting")
            ]),
            ("Brows", "brows", "Pen", [
                ("Eyebrow Threading", "eyebrow-threading"),
                ("Eyebrow Waxing", "eyebrow-waxing"),
                ("Brow Lamination", "brow-lamination"),
                ("Microblading", "microblading"),
                ("Brow Tinting", "brow-tinting")
            ]),
            ("Skin Care", "skin-care", "Heart", [
                ("Facial", "facial"),
                ("Microdermabrasion", "microdermabrasion"),
                ("Chemical Peel", "chemical-peel"),
                ("LED Therapy", "led-therapy"),
                ("Hydrafacial", "hydrafacial")
            ]),
            ("Makeup", "makeup", "Palette", [
                ("Makeup Artist", "makeup-artist"),
                ("Bridal Makeup", "bridal-makeup"),
                ("Special Effects Makeup", "sfx-makeup")
            ]),
            ("Body", "body", "Flower2", [
                ("Massage", "massage"),
                ("Waxing", "waxing"),
                ("Laser Hair Removal", "laser-hair-removal"),
                ("Body Sculpting", "body-sculpting"),
                ("Spray Tan", "spray-tan")
            ]),
            ("Cosmetic", "cosmetic", "Syringe", [
                ("Lip Filler", "lip-filler"),
                ("Botox", "botox"),
                ("Dermal Filler", "dermal-filler"),
                ("Skin Clinic", "skin-clinic")
            ]),
            ("Wellness", "wellness", "Leaf", [
                ("Day Spa", "day-spa"),
                ("Aromatherapy", "aromatherapy"),
                ("Reflexology", "reflexology"),
                ("Float Therapy", "float-therapy")
            ]),
            ("Massage", "massage", "Hand", [
                ("Remedial Massage", "remedial-massage"),
                ("Relaxation Massage", "relaxation-massage"),
                ("Deep Tissue Massage", "deep-tissue-massage"),
                ("Hot Stone Massage", "hot-stone-massage"),
                ("Sports Massage", "sports-massage"),
                ("Thai Massage", "thai-massage")
            ])
        };

        foreach (var (name, slug, icon, subs) in beautyCategories)
        {
            if (allExistingSlugs.Contains(slug)) continue; // Skip if slug exists (as parent or sub)

            var parent = new Category
            {
                Name = name,
                Slug = slug,
                IconName = icon,
                MarketplaceType = ProviderType.Beauty,
                SortOrder = Array.IndexOf(beautyCategories, (name, slug, icon, subs))
            };
            context.Categories.Add(parent);
            await context.SaveChangesAsync();

            foreach (var (subName, subSlug) in subs)
            {
                if (allExistingSlugs.Contains(subSlug)) continue; // Skip existing sub slugs

                context.Categories.Add(new Category
                {
                    Name = subName,
                    Slug = subSlug,
                    ParentCategoryId = parent.Id,
                    MarketplaceType = ProviderType.Beauty,
                    SortOrder = Array.IndexOf(subs, (subName, subSlug))
                });
            }
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedITCategories(AppDbContext context)
    {
        if (await context.Categories.AnyAsync(c => c.MarketplaceType == ProviderType.ITService))
            return;

        var itCategories = new (string Name, string Slug, string Icon)[]
        {
            ("Web Development", "web-development", "Globe"),
            ("Mobile Development", "mobile-development", "Smartphone"),
            ("UI/UX Design", "ui-ux-design", "Palette"),
            ("Cloud & DevOps", "cloud-devops", "Cloud"),
            ("Data & Analytics", "data-analytics", "BarChart3"),
            ("Cybersecurity", "cybersecurity", "Shield"),
            ("AI & Machine Learning", "ai-machine-learning", "Brain"),
            ("IT Support", "it-support", "Headphones"),
            ("Software Development", "software-development", "Code"),
            ("Database Administration", "database-administration", "Database"),
            ("Networking", "networking", "Network"),
            ("IT Consulting", "it-consulting", "Briefcase")
        };

        for (int i = 0; i < itCategories.Length; i++)
        {
            context.Categories.Add(new Category
            {
                Name = itCategories[i].Name,
                Slug = itCategories[i].Slug,
                IconName = itCategories[i].Icon,
                MarketplaceType = ProviderType.ITService,
                SortOrder = i
            });
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedPerthSuburbs(AppDbContext context)
    {
        if (await context.Suburbs.AnyAsync())
            return;

        // Perth metropolitan and key WA suburbs for SEO
        var suburbs = new (string Name, string PostCode)[]
        {
            ("Perth", "6000"), ("Northbridge", "6003"), ("West Perth", "6005"),
            ("East Perth", "6004"), ("South Perth", "6151"), ("Subiaco", "6008"),
            ("Leederville", "6007"), ("Mount Lawley", "6050"), ("Highgate", "6003"),
            ("Inglewood", "6052"), ("Maylands", "6051"), ("Bayswater", "6053"),
            ("Morley", "6062"), ("Dianella", "6059"), ("Yokine", "6060"),
            ("Scarborough", "6019"), ("Doubleview", "6018"), ("Innaloo", "6018"),
            ("Karrinyup", "6018"), ("Stirling", "6021"), ("Balcatta", "6021"),
            ("Osborne Park", "6017"), ("Tuart Hill", "6060"), ("Joondanna", "6060"),
            ("Claremont", "6010"), ("Cottesloe", "6011"), ("Dalkeith", "6009"),
            ("Nedlands", "6009"), ("Mosman Park", "6012"), ("Peppermint Grove", "6011"),
            ("Fremantle", "6160"), ("North Fremantle", "6159"), ("East Fremantle", "6158"),
            ("South Fremantle", "6162"), ("Beaconsfield", "6162"), ("Hilton", "6163"),
            ("Applecross", "6153"), ("Ardross", "6153"), ("Mount Pleasant", "6153"),
            ("Booragoon", "6154"), ("Myaree", "6154"), ("Melville", "6156"),
            ("Willetton", "6155"), ("Canning Vale", "6155"), ("Riverton", "6148"),
            ("Joondalup", "6027"), ("Currambine", "6028"), ("Burns Beach", "6028"),
            ("Hillarys", "6025"), ("Sorrento", "6020"), ("Padbury", "6025"),
            ("Duncraig", "6023"), ("Warwick", "6024"), ("Greenwood", "6024"),
            ("Rockingham", "6168"), ("Mandurah", "6210"), ("Bunbury", "6230"),
            ("Victoria Park", "6100"), ("Cannington", "6107"), ("Belmont", "6104"),
            ("Rivervale", "6103"), ("Bentley", "6102"), ("Karawara", "6152"),
            ("Como", "6152"), ("Manning", "6152"), ("Salter Point", "6152"),
            ("Armadale", "6112"), ("Midland", "6056"), ("Ellenbrook", "6069"),
            ("Mundijong", "6123"), ("Byford", "6122"), ("Warnbro", "6169"),
            ("Cockburn Central", "6164"), ("Success", "6164"), ("Hammond Park", "6164"),
            ("Baldivis", "6171"), ("Secret Harbour", "6173"), ("Piara Waters", "6112"),
            ("Harrisdale", "6112"), ("Thornlie", "6108"), ("Gosnells", "6110"),
            ("Kalamunda", "6076"), ("Mundaring", "6073"), ("Wanneroo", "6065"),
            ("Clarkson", "6030"), ("Butler", "6036"), ("Alkimos", "6038"),
            ("Two Rocks", "6037"), ("Yanchep", "6035"), ("Geraldton", "6530"),
            ("Kalgoorlie", "6430"), ("Albany", "6330"), ("Broome", "6725")
        };

        foreach (var (name, postCode) in suburbs)
        {
            context.Suburbs.Add(new Suburb
            {
                Name = name,
                Slug = name.ToLower().Replace(" ", "-").Replace("'", ""),
                State = "WA",
                PostCode = postCode,
                IsActive = true
            });
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedAppSettings(AppDbContext context)
    {
        if (await context.AppSettings.AnyAsync())
            return;

        var settings = new AppSetting[]
        {
            new() { Key = "Platform.Name", Value = "Appilico", Group = "General", Description = "Platform name" },
            new() { Key = "Platform.Currency", Value = "AUD", Group = "General", Description = "Default currency" },
            new() { Key = "Platform.Country", Value = "Australia", Group = "General", Description = "Target country" },
            new() { Key = "Platform.SupportEmail", Value = "support@appilico.com", Group = "General", Description = "Support email" },
            new() { Key = "Beauty.Domain", Value = "beauty.appilico.com.au", Group = "Domains", Description = "Beauty marketplace domain" },
            new() { Key = "IT.Domain", Value = "service.appilico.com.au", Group = "Domains", Description = "IT marketplace domain" },
            new() { Key = "Admin.Domain", Value = "admin.appilico.com.au", Group = "Domains", Description = "Admin dashboard domain" },
        };

        context.AppSettings.AddRange(settings);
        await context.SaveChangesAsync();
    }

    private static async Task SeedMissingSuburbs(AppDbContext context)
    {
        var missing = new (string Name, string PostCode)[]
        {
            ("Floreat", "6014"),
            ("Swanbourne", "6010"),
            ("North Perth", "6006"),
            ("Mirrabooka", "6061"),
            ("Swan View", "6056"),
            ("Forrestfield", "6058"),
            ("East Victoria Park", "6101"),
            ("Palmyra", "6157"),
            ("Bicton", "6157"),
            ("Hamilton Hill", "6163"),
            ("Spearwood", "6163"),
            ("Bibra Lake", "6163"),
            ("Beeliar", "6164"),
            ("Yangebup", "6164"),
            ("Waikiki", "6169"),
            ("Bertram", "6167"),
            ("East Perth", "6004"),
            ("Shenton Park", "6008"),
            ("Eglinton", "6034"),
            ("Highgate", "6003"),
            ("Aubin Grove", "6164"),
            ("Carlisle", "6101"),
            ("Mount Hawthorn", "6016"),
            ("South Perth", "6151"),
            ("Cockburn Central", "6164"),
            ("West Leederville", "6007"),
            ("Malaga", "6090"),
            ("Wembley", "6014"),
            // Phase 8 — additional suburbs
            ("Southern River", "6110"),
            ("Gosnells", "6110"),
            ("Thornlie", "6108"),
            ("Harrisdale", "6112"),
            ("Piara Waters", "6112"),
            ("Byford", "6122"),
            ("Kelmscott", "6111"),
            ("Bull Creek", "6149"),
            ("Leeming", "6149"),
            ("Myaree", "6154"),
            ("Melville", "6156"),
            ("Mount Pleasant", "6153"),
            ("Rivervale", "6103"),
            ("Greenwood", "6024"),
            ("Kingsley", "6026"),
            ("Woodvale", "6026"),
            ("Padbury", "6025"),
            ("Warwick", "6024"),
            ("Beechboro", "6063"),
            ("Girrawheen", "6064"),
            ("Madeley", "6065"),
            ("Churchlands", "6018"),
            ("Tuart Hill", "6060"),
            ("Yokine", "6060"),
            ("Huntingdale", "6110"),
            ("Kenwick", "6107"),
            ("Manning", "6152"),
            ("Murdoch", "6150"),
            ("Mindarie", "6030"),
            ("Secret Harbour", "6173"),
            ("Atwell", "6164"),
            ("Success", "6164"),
            ("South Lake", "6164"),
        };

        foreach (var (name, postCode) in missing)
        {
            var slug = name.ToLower().Replace(" ", "-").Replace("'", "");
            if (!await context.Suburbs.AnyAsync(s => s.Slug == slug))
            {
                context.Suburbs.Add(new Suburb
                {
                    Name = name,
                    Slug = slug,
                    State = "WA",
                    PostCode = postCode,
                    IsActive = true
                });
            }
        }

        await context.SaveChangesAsync();

        // Fix Perth CBD → Perth for frontend slug consistency
        var perthCbd = await context.Suburbs.FirstOrDefaultAsync(s => s.Slug == "perth-cbd");
        if (perthCbd != null)
        {
            perthCbd.Name = "Perth";
            perthCbd.Slug = "perth";
            await context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Idempotent: adds GPS coordinates to suburbs that are missing them.
    /// Enables the nearest-suburb geolocation endpoint.
    /// </summary>
    private static async Task UpdateSuburbCoordinates(AppDbContext context)
    {
        // Only run if any suburb is still missing coordinates
        if (!await context.Suburbs.AnyAsync(s => !s.Latitude.HasValue))
            return;

        var coords = new Dictionary<string, (double Lat, double Lng)>(StringComparer.OrdinalIgnoreCase)
        {
            ["perth"]             = (-31.9505, 115.8605),
            ["northbridge"]       = (-31.9436, 115.8577),
            ["west-perth"]        = (-31.9530, 115.8480),
            ["east-perth"]        = (-31.9481, 115.8700),
            ["south-perth"]       = (-31.9840, 115.8660),
            ["subiaco"]           = (-31.9492, 115.8261),
            ["leederville"]       = (-31.9366, 115.8419),
            ["mount-lawley"]      = (-31.9335, 115.8714),
            ["highgate"]          = (-31.9400, 115.8664),
            ["inglewood"]         = (-31.9193, 115.8758),
            ["maylands"]          = (-31.9339, 115.8877),
            ["bayswater"]         = (-31.9193, 115.9161),
            ["morley"]            = (-31.8914, 115.9020),
            ["dianella"]          = (-31.8929, 115.8750),
            ["yokine"]            = (-31.9060, 115.8560),
            ["scarborough"]       = (-31.8944, 115.7577),
            ["doubleview"]        = (-31.8939, 115.7823),
            ["innaloo"]           = (-31.8879, 115.7977),
            ["karrinyup"]         = (-31.8758, 115.8044),
            ["stirling"]          = (-31.9017, 115.8219),
            ["balcatta"]          = (-31.8714, 115.8258),
            ["osborne-park"]      = (-31.9033, 115.8251),
            ["tuart-hill"]        = (-31.8997, 115.8530),
            ["joondanna"]         = (-31.9080, 115.8453),
            ["claremont"]         = (-31.9785, 115.7802),
            ["cottesloe"]         = (-31.9993, 115.7548),
            ["dalkeith"]          = (-31.9891, 115.8137),
            ["nedlands"]          = (-31.9804, 115.8019),
            ["mosman-park"]       = (-31.9890, 115.7699),
            ["peppermint-grove"]  = (-32.0020, 115.7719),
            ["fremantle"]         = (-32.0569, 115.7439),
            ["north-fremantle"]   = (-32.0292, 115.7491),
            ["east-fremantle"]    = (-32.0403, 115.7714),
            ["south-fremantle"]   = (-32.0707, 115.7533),
            ["beaconsfield"]      = (-32.0614, 115.7604),
            ["hilton"]            = (-32.0438, 115.7850),
            ["applecross"]        = (-32.0150, 115.8500),
            ["ardross"]           = (-32.0135, 115.8300),
            ["mount-pleasant"]    = (-32.0150, 115.8590),
            ["booragoon"]         = (-32.0282, 115.8400),
            ["myaree"]            = (-32.0211, 115.8245),
            ["melville"]          = (-32.0329, 115.8004),
            ["willetton"]         = (-32.0506, 115.8787),
            ["canning-vale"]      = (-32.0714, 115.9086),
            ["riverton"]          = (-32.0321, 115.8683),
            ["joondalup"]         = (-31.7452, 115.7661),
            ["currambine"]        = (-31.7168, 115.7497),
            ["burns-beach"]       = (-31.6866, 115.7429),
            ["hillarys"]          = (-31.8025, 115.7439),
            ["sorrento"]          = (-31.8176, 115.7583),
            ["padbury"]           = (-31.8323, 115.7725),
            ["duncraig"]          = (-31.8455, 115.7808),
            ["warwick"]           = (-31.8567, 115.8015),
            ["greenwood"]         = (-31.8391, 115.8210),
            ["rockingham"]        = (-32.2779, 115.7297),
            ["mandurah"]          = (-32.5290, 115.7215),
            ["bunbury"]           = (-33.3273, 115.6413),
            ["victoria-park"]     = (-31.9811, 115.8828),
            ["cannington"]        = (-31.9960, 115.9369),
            ["belmont"]           = (-31.9563, 115.9308),
            ["rivervale"]         = (-31.9574, 115.9103),
            ["bentley"]           = (-32.0008, 115.9033),
            ["karawara"]          = (-32.0093, 115.8671),
            ["como"]              = (-31.9994, 115.8657),
            ["manning"]           = (-32.0069, 115.8623),
            ["salter-point"]      = (-32.0011, 115.8737),
            ["armadale"]          = (-32.1488, 116.0120),
            ["midland"]           = (-31.8898, 116.0142),
            ["ellenbrook"]        = (-31.7640, 116.0059),
            ["mundijong"]         = (-32.2923, 115.9737),
            ["byford"]            = (-32.2241, 116.0005),
            ["warnbro"]           = (-32.3154, 115.7537),
            ["cockburn-central"]  = (-32.1178, 115.8424),
            ["success"]           = (-32.1281, 115.8539),
            ["hammond-park"]      = (-32.1417, 115.8501),
            ["baldivis"]          = (-32.3087, 115.8089),
            ["secret-harbour"]    = (-32.3982, 115.7539),
            ["piara-waters"]      = (-32.1299, 115.9196),
            ["harrisdale"]        = (-32.1129, 115.9076),
            ["thornlie"]          = (-32.0441, 115.9560),
            ["gosnells"]          = (-32.0741, 115.9938),
            ["kalamunda"]         = (-31.9779, 116.0598),
            ["mundaring"]         = (-31.9030, 116.1670),
            ["wanneroo"]          = (-31.7500, 115.8058),
            ["clarkson"]          = (-31.6902, 115.7993),
            ["butler"]            = (-31.6373, 115.7930),
            ["alkimos"]           = (-31.6143, 115.7667),
            ["two-rocks"]         = (-31.4988, 115.5950),
            ["yanchep"]           = (-31.5501, 115.7221),
            ["geraldton"]         = (-28.7774, 114.6145),
            ["kalgoorlie"]        = (-30.7490, 121.4661),
            ["albany"]            = (-35.0275, 117.8840),
            ["broome"]            = (-17.9619, 122.2361),
            ["floreat"]           = (-31.9330, 115.7860),
            ["swanbourne"]        = (-31.9724, 115.7720),
            ["north-perth"]       = (-31.9258, 115.8530),
            ["mirrabooka"]        = (-31.8742, 115.8643),
            ["swan-view"]         = (-31.8686, 116.0481),
            ["forrestfield"]      = (-31.9791, 116.0178),
            ["east-victoria-park"]= (-31.9883, 115.8997),
            ["palmyra"]           = (-32.0497, 115.7897),
            ["bicton"]            = (-32.0394, 115.7776),
            ["hamilton-hill"]     = (-32.0856, 115.7869),
            ["spearwood"]         = (-32.0989, 115.7868),
            ["bibra-lake"]        = (-32.1113, 115.8281),
            ["beeliar"]           = (-32.1253, 115.8183),
            ["yangebup"]          = (-32.1089, 115.8375),
            ["waikiki"]           = (-32.3019, 115.7547),
            ["bertram"]           = (-32.2600, 115.8028),
            ["shenton-park"]      = (-31.9546, 115.8117),
            ["eglinton"]          = (-31.5965, 115.6926),
            ["aubin-grove"]       = (-32.1464, 115.8686),
            ["carlisle"]          = (-31.9790, 115.9080),
            ["mount-hawthorn"]    = (-31.9237, 115.8384),
            ["west-leederville"]  = (-31.9397, 115.8311),
            ["malaga"]            = (-31.8524, 115.8770),
            ["wembley"]           = (-31.9280, 115.8110),
            ["southern-river"]    = (-32.1026, 115.9612),
            ["kelmscott"]         = (-32.1295, 116.0216),
            ["bull-creek"]        = (-32.0735, 115.8593),
            ["leeming"]           = (-32.0786, 115.8644),
            ["kingsley"]          = (-31.8192, 115.8100),
            ["woodvale"]          = (-31.8119, 115.8228),
            ["beechboro"]         = (-31.8608, 115.9359),
            ["girrawheen"]        = (-31.8449, 115.8490),
            ["madeley"]           = (-31.7944, 115.8207),
            ["churchlands"]       = (-31.9221, 115.8030),
            ["huntingdale"]       = (-32.0672, 115.9679),
            ["kenwick"]           = (-32.0267, 115.9730),
            ["murdoch"]           = (-32.0630, 115.8380),
            ["mindarie"]          = (-31.6829, 115.7161),
            ["atwell"]            = (-32.1415, 115.8389),
            ["south-lake"]        = (-32.1196, 115.8479),
        };

        var suburbs = await context.Suburbs.Where(s => !s.Latitude.HasValue).ToListAsync();
        foreach (var suburb in suburbs)
        {
            if (coords.TryGetValue(suburb.Slug, out var c))
            {
                suburb.Latitude = c.Lat;
                suburb.Longitude = c.Lng;
            }
        }
        await context.SaveChangesAsync();
    }
}
