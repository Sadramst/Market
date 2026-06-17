using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Locations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    public static async Task SeedServicesAsync(IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<AppDbContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        await context.Database.MigrateAsync();
        await SeedRoles(roleManager);
        await SeedUsers(userManager);
        await SeedITCategories(context);
        await SeedPerthSuburbs(context);
        await SeedAppSettings(context);

        var categories = await context.Categories
            .Where(c => c.MarketplaceType == ProviderType.ITService)
            .ToListAsync();
        var suburbs = await context.Suburbs.Where(s => s.IsActive).ToListAsync();
        if (!categories.Any() || !suburbs.Any()) return;

        var providers = new[]
        {
            new { BusinessName = "Elephant in the Boardroom", Slug = "elephant-in-the-boardroom-perth", Category = "web-development", Suburb = "perth", Address = "Level 14, 191 St Georges Tce, Perth WA 6000", Phone = "(08) 6365 4060", Website = "https://www.elephantintheboardroom.com.au", Rating = 4.9m, ReviewCount = 87, Description = "Perth's award-winning digital agency. 2,000+ completed projects." },
            new { BusinessName = "Techwell IT", Slug = "techwell-it-perth", Category = "it-support", Suburb = "osborne-park", Address = "Osborne Park WA 6017", Phone = "(08) 6102 6040", Website = "https://www.techwellit.com.au", Rating = 4.8m, ReviewCount = 112, Description = "Perth's trusted managed IT support for SMBs. Fast local response." },
            new { BusinessName = "iT4 Business", Slug = "it4-business-joondalup", Category = "it-support", Suburb = "joondalup", Address = "Joondalup WA 6027", Phone = "(08) 9300 0100", Website = "https://www.it4business.com.au", Rating = 4.9m, ReviewCount = 78, Description = "Joondalup-based managed IT, cloud and cybersecurity services." },
            new { BusinessName = "Webprofits Perth", Slug = "webprofits-perth", Category = "digital-marketing", Suburb = "perth", Address = "Perth WA 6000", Phone = (string?)null, Website = "https://www.webprofits.com.au", Rating = 4.8m, ReviewCount = 64, Description = "Performance-focused digital growth agency. SEO, Google Ads, paid social." },
            new { BusinessName = "Ample Digital", Slug = "ample-digital-fremantle", Category = "ui-ux-design", Suburb = "fremantle", Address = "Fremantle WA 6160", Phone = (string?)null, Website = "https://www.ampledigital.com.au", Rating = 4.9m, ReviewCount = 57, Description = "Fremantle design studio. UX research, product design, brand identity." },
            new { BusinessName = "Katana Cloud", Slug = "katana-cloud-west-perth", Category = "cloud-devops", Suburb = "west perth", Address = "West Perth WA 6005", Phone = (string?)null, Website = "https://www.katanacloud.com.au", Rating = 4.7m, ReviewCount = 38, Description = "Perth cloud specialists. AWS, Azure, Google Cloud, DevOps automation." },
            new { BusinessName = "StrategicIT Security", Slug = "strategicit-security-perth", Category = "cybersecurity", Suburb = "perth", Address = "Perth WA 6000", Phone = (string?)null, Website = "https://www.strategicit.com.au", Rating = 4.8m, ReviewCount = 43, Description = "Perth cybersecurity consultancy. Pen testing, audits, compliance." },
        };

        foreach (var providerSeed in providers)
        {
            if (await context.Providers.AnyAsync(x => x.Slug == providerSeed.Slug))
                continue;

            var category = categories.FirstOrDefault(c => c.Slug == providerSeed.Category);
            var suburbKey = providerSeed.Suburb.Trim().ToLower().Replace(" ", "-");
            var suburb = suburbs.FirstOrDefault(s => s.Slug == suburbKey)
                ?? suburbs.FirstOrDefault(s => s.Name.Equals(providerSeed.Suburb, StringComparison.OrdinalIgnoreCase))
                ?? suburbs.FirstOrDefault(s => s.Name.ToLower().Replace(" ", "-") == suburbKey);

            if (category == null || suburb == null)
            {
                Console.WriteLine($"⚠ Skip {providerSeed.Slug}: category={category != null} suburb={suburb != null}");
                continue;
            }

            var email = $"provider.{providerSeed.Slug.Replace("-", "") }@appilico-seed.internal";
            var user = await userManager.FindByEmailAsync(email) ?? await userManager.FindByNameAsync(email);
            if (user == null)
            {
                var nameParts = providerSeed.BusinessName.Split(' ');
                user = new AppUser
                {
                    UserName = email,
                    Email = email,
                    FirstName = nameParts[0],
                    LastName = nameParts.Length > 1 ? string.Join(" ", nameParts[1..Math.Min(3, nameParts.Length)]) : "Business",
                    EmailConfirmed = true
                };

                var createResult = await userManager.CreateAsync(user, "SeedProvider@2026!");
                if (!createResult.Succeeded)
                    continue;

                await userManager.AddToRoleAsync(user, UserRoles.Provider);
            }

            var provider = new Provider
            {
                UserId = user.Id,
                BusinessName = providerSeed.BusinessName,
                Slug = providerSeed.Slug,
                Description = providerSeed.Description,
                ProviderType = ProviderType.ITService,
                Status = ProviderStatus.Approved,
                Phone = providerSeed.Phone,
                Website = providerSeed.Website,
                City = suburb.Name,
                State = "WA",
                PostalCode = suburb.PostCode,
                FullAddress = providerSeed.Address,
                IsFeatured = providerSeed.Rating >= 4.8m && providerSeed.ReviewCount >= 50,
                IsVerified = false,
                AverageRating = (double)providerSeed.Rating,
                TotalReviews = providerSeed.ReviewCount,
                ApprovedAt = DateTime.UtcNow,
                ApprovedBy = "system-seed",
                BusinessHoursJson = "{\"mon\":\"9:00-17:30\",\"tue\":\"9:00-17:30\",\"wed\":\"9:00-17:30\",\"thu\":\"9:00-17:30\",\"fri\":\"9:00-17:30\",\"sat\":\"Closed\",\"sun\":\"Closed\"}",
                HasRealData = true,
                IsClaimed = false,
                DataSource = "seeded",
                Tagline = null,
            };

            context.Providers.Add(provider);
            await context.SaveChangesAsync();

            context.ProviderServiceAreas.Add(new ProviderServiceArea { ProviderId = provider.Id, SuburbId = suburb.Id });

            if (!string.IsNullOrWhiteSpace(providerSeed.Website) || !string.IsNullOrWhiteSpace(providerSeed.Phone))
            {
                context.ProviderServices.Add(new ProviderService
                {
                    ProviderId = provider.Id,
                    CategoryId = category.Id,
                    Name = providerSeed.Category switch
                    {
                        "web-development" => "Website Development",
                        "it-support" => "Managed IT Support",
                        "digital-marketing" => "Digital Marketing",
                        "ui-ux-design" => "UI/UX Design",
                        "cloud-devops" => "Cloud & DevOps",
                        "cybersecurity" => "Cybersecurity Audit",
                        _ => "IT Consulting"
                    },
                    PriceFrom = 500m,
                    DurationMinutes = 60,
                    IsActive = true,
                    SortOrder = 0
                });
            }

            await context.SaveChangesAsync();
        }
    }
}