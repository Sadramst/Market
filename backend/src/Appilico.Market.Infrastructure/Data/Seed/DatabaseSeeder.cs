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
        await SeedBeautyCategories(context);
        await SeedITCategories(context);
        await SeedPerthSuburbs(context);
        await SeedAppSettings(context);
        await SeedMissingSuburbs(context);
        await SeedBeautyProviders(context, userManager);
        await SeedMoreBeautyProviders(context, userManager);
        await SeedRealProviders(context, userManager);
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
        if (await context.Categories.AnyAsync(c => c.MarketplaceType == ProviderType.Beauty))
            return;

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
            ])
        };

        foreach (var (name, slug, icon, subs) in beautyCategories)
        {
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
}
