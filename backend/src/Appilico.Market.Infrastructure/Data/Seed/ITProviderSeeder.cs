using System.Text.Json;
using System.Text.RegularExpressions;
using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Locations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    public static async Task SeedITProviders(AppDbContext context, UserManager<AppUser> userManager)
    {
        // Skip if we already have IT providers
        if (await context.Providers.AnyAsync(p => p.ProviderType == ProviderType.ITService))
            return;

        var jsonPath = Path.Combine(AppContext.BaseDirectory, "Data", "Seed", "it_providers.json");
        if (!File.Exists(jsonPath))
            return;

        var jsonStr = File.ReadAllText(jsonPath);
        var googlePlaces = JsonSerializer.Deserialize<List<GooglePlaceDto>>(jsonStr) ?? new List<GooglePlaceDto>();
        if (!googlePlaces.Any()) return;

        var categories = await context.Categories
            .Where(c => c.MarketplaceType == ProviderType.ITService)
            .ToListAsync();
        var suburbs = await context.Suburbs.Where(s => s.IsActive).ToListAsync();
        if (!categories.Any() || !suburbs.Any()) return;

        var postcodeRegex = new Regex(@"WA\s+(\d{4})");
        var hours = """{"mon":"9:00-17:30","tue":"9:00-17:30","wed":"9:00-17:30","thu":"9:00-17:30","fri":"9:00-17:30","sat":"Closed","sun":"Closed"}""";

        // Map frontend slugs to DB category slugs
        var categoryMap = new Dictionary<string, string>
        {
            ["web-development"] = "web-development",
            ["mobile-apps"] = "mobile-development",
            ["cloud-devops"] = "cloud-devops",
            ["cybersecurity"] = "cybersecurity",
            ["data-analytics"] = "data-analytics",
            ["it-support"] = "it-support",
            ["ai-ml"] = "ai-machine-learning",
            ["ui-ux-design"] = "ui-ux-design",
            ["consulting"] = "it-consulting",
            ["networking"] = "networking",
            ["ecommerce"] = "web-development",
            ["digital-marketing"] = "web-development",
            ["software-development"] = "software-development",
            ["database-administration"] = "database-administration",
        };

        Category? FindCat(string slug)
        {
            if (categoryMap.TryGetValue(slug, out var dbSlug))
                return categories.FirstOrDefault(c => c.Slug == dbSlug);
            return categories.FirstOrDefault(c => c.Slug == slug)
                ?? categories.FirstOrDefault(c => c.Slug == "it-support");
        }

        foreach (var place in googlePlaces)
        {
            if (await context.Providers.AnyAsync(p => p.Slug == place.slug)) continue;

            var postCode = string.Empty;
            if (!string.IsNullOrEmpty(place.address))
            {
                var match = postcodeRegex.Match(place.address);
                if (match.Success) postCode = match.Groups[1].Value;
            }

            var email = $"provider.{place.slug.Replace("-", "")}@appilico-seed.internal";
            if (email.Length > 80)
            {
                var hash = Math.Abs(place.slug.GetHashCode()).ToString();
                email = $"p{hash}@appilico-seed.internal";
            }
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = await userManager.FindByNameAsync(email);
            }
            if (user == null)
            {
                var nameParts = place.businessName.Split(' ');
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

            var suburb = suburbs.FirstOrDefault(s => s.Name.Equals(place.suburb, StringComparison.OrdinalIgnoreCase))
                         ?? suburbs.FirstOrDefault(s => s.Name.Contains(place.suburb, StringComparison.OrdinalIgnoreCase))
                         ?? suburbs.FirstOrDefault(s => s.PostCode == postCode)
                         ?? suburbs[0];

            var catSlug = place.categories.FirstOrDefault() ?? "it-support";
            var parentCat = FindCat(catSlug);

            var provider = new Provider
            {
                UserId = user.Id,
                BusinessName = place.businessName,
                Slug = place.slug,
                Description = place.description,
                ProviderType = ProviderType.ITService,
                Status = ProviderStatus.Approved,
                Phone = place.phoneNumber,
                Email = null,
                Website = place.website,
                City = place.suburb,
                State = "WA",
                PostalCode = postCode,
                FullAddress = place.address,
                IsFeatured = place.averageRating >= 4.8 && place.totalReviews >= 50,
                IsVerified = false,
                AverageRating = place.averageRating,
                TotalReviews = place.totalReviews,
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

            // Service area
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

            // Default services based on category
            if (parentCat != null)
            {
                var defaultServices = catSlug switch
                {
                    "web-development" => new[] { ("Website Development", 2500m), ("Website Redesign", 1800m), ("Landing Page", 800m) },
                    "mobile-apps" => new[] { ("iOS App Development", 5000m), ("Android App Development", 4500m), ("Cross-Platform App", 6000m) },
                    "cloud-devops" => new[] { ("Cloud Migration", 3000m), ("CI/CD Setup", 1500m), ("Infrastructure Audit", 1200m) },
                    "cybersecurity" => new[] { ("Security Audit", 2000m), ("Penetration Testing", 3000m), ("Compliance Review", 1500m) },
                    "data-analytics" => new[] { ("Dashboard Setup", 1500m), ("Data Pipeline", 2500m), ("BI Report", 800m) },
                    "it-support" => new[] { ("IT Support Monthly", 500m), ("Computer Repair", 120m), ("Network Setup", 350m) },
                    "ai-ml" => new[] { ("AI Consultation", 2000m), ("ML Model Development", 5000m), ("Automation Setup", 3000m) },
                    "ui-ux-design" => new[] { ("UI Design", 2000m), ("UX Audit", 1200m), ("Prototype", 1500m) },
                    "consulting" => new[] { ("IT Strategy Session", 500m), ("Technology Audit", 1500m), ("Digital Roadmap", 2500m) },
                    "networking" => new[] { ("Network Setup", 800m), ("Wi-Fi Installation", 500m), ("Cabling", 1200m) },
                    "ecommerce" => new[] { ("Online Store Setup", 3000m), ("Payment Integration", 800m), ("Product Upload", 500m) },
                    "digital-marketing" => new[] { ("SEO Package", 1200m), ("Google Ads Management", 800m), ("Content Strategy", 1000m) },
                    "software-development" => new[] { ("Custom Software", 5000m), ("API Development", 2000m), ("System Integration", 3000m) },
                    "database-administration" => new[] { ("Database Setup", 1500m), ("Performance Tuning", 1200m), ("Backup Strategy", 800m) },
                    _ => new[] { ("IT Consultation", 150m), ("Support Package", 500m) }
                };

                for (int i = 0; i < defaultServices.Length; i++)
                {
                    context.ProviderServices.Add(new ProviderService
                    {
                        ProviderId = provider.Id,
                        CategoryId = parentCat.Id,
                        Name = defaultServices[i].Item1,
                        PriceFrom = defaultServices[i].Item2,
                        DurationMinutes = 60,
                        IsActive = true,
                        SortOrder = i
                    });
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
