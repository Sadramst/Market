using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Reviews;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    /// <summary>
    /// Additively seeds the hand-crafted detailed providers from GetRealBusinesses()
    /// that are NOT already in the database. Also creates realistic reviews for each.
    /// This is safe to run multiple times (idempotent).
    /// </summary>
    public static async Task SeedDetailedProviders(AppDbContext context, UserManager<AppUser> userManager)
    {
        var categories = await context.Categories
            .Where(c => c.MarketplaceType == ProviderType.Beauty && c.ParentCategoryId == null)
            .ToListAsync();
        var suburbs = await context.Suburbs.Where(s => s.IsActive).ToListAsync();
        if (!categories.Any() || !suburbs.Any()) return;

        var hours = """{"mon":"9:00-17:30","tue":"9:00-17:30","wed":"9:00-17:30","thu":"9:00-20:00","fri":"9:00-17:30","sat":"9:00-16:00","sun":"Closed"}""";

        var businesses = GetRealBusinesses();

        // Pre-fetch existing slugs to avoid N+1 queries
        var existingSlugs = (await context.Providers
            .Select(p => p.Slug)
            .ToListAsync())
            .ToHashSet();

        var reviewerUser = await GetOrCreateReviewerUser(userManager);

        foreach (var biz in businesses)
        {
            if (existingSlugs.Contains(biz.Slug)) continue;

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
                    UserName = email,
                    Email = email,
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
                Email = null,
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
                DataSource = "detailed-seed",
                Tagline = null
            };
            context.Providers.Add(provider);
            await context.SaveChangesAsync();

            // Service area — primary suburb + nearby
            context.ProviderServiceAreas.Add(new ProviderServiceArea { ProviderId = provider.Id, SuburbId = suburb.Id });
            if (int.TryParse(suburb.PostCode, out var homePostCode))
            {
                var nearbySuburbs = suburbs
                    .Where(s => s.Id != suburb.Id
                        && int.TryParse(s.PostCode, out var npc)
                        && Math.Abs(npc - homePostCode) <= 3)
                    .Take(2).ToList();
                foreach (var ns in nearbySuburbs)
                    context.ProviderServiceAreas.Add(new ProviderServiceArea { ProviderId = provider.Id, SuburbId = ns.Id });
            }

            // Services
            var parentCat = categories.FirstOrDefault(c => c.Slug == biz.CategorySlug);
            if (parentCat != null)
            {
                for (int i = 0; i < biz.Services.Length; i++)
                {
                    var svcStr = biz.Services[i];
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

            // Reviews — generate realistic reviews based on rating/count
            await SeedReviewsForProvider(context, provider, biz, reviewerUser);

            await context.SaveChangesAsync();
        }
    }

    private static async Task<AppUser> GetOrCreateReviewerUser(UserManager<AppUser> userManager)
    {
        var email = "reviewer@appilico-seed.internal";
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new AppUser
            {
                UserName = email,
                Email = email,
                FirstName = "Perth",
                LastName = "Customer",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(user, "SeedReviewer@2026!");
            await userManager.AddToRoleAsync(user, UserRoles.Customer);
        }
        return user;
    }

    private static async Task SeedReviewsForProvider(
        AppDbContext context, Provider provider, RealBiz biz, AppUser reviewerUser)
    {
        // Already has reviews? Skip
        if (await context.Reviews.AnyAsync(r => r.ProviderId == provider.Id)) return;

        // Generate 3-5 realistic reviews per provider
        var reviewTemplates = GetReviewTemplates(biz.CategorySlug);
        var reviewCount = Math.Min(reviewTemplates.Length, biz.Rating >= 4.8 ? 5 : 3);
        var baseDate = DateTime.UtcNow.AddMonths(-6);

        for (int i = 0; i < reviewCount; i++)
        {
            var template = reviewTemplates[i];
            var rating = biz.Rating >= 4.5 ? (i < reviewCount - 1 ? 5 : 4) : (i == 0 ? 5 : 4);

            context.Reviews.Add(new Review
            {
                UserId = reviewerUser.Id,
                ProviderId = provider.Id,
                Rating = rating,
                Title = template.Title,
                Comment = template.Comment,
                Status = ReviewStatus.Approved,
                CreatedAt = baseDate.AddDays(i * 30 + Random.Shared.Next(1, 28))
            });
        }
    }

    private record ReviewTemplate(string Title, string Comment);

    private static ReviewTemplate[] GetReviewTemplates(string categorySlug) => categorySlug switch
    {
        "nails" =>
        [
            new("Absolutely beautiful nails!", "Best nail salon I've been to in Perth. The attention to detail is incredible and my gel set lasted over 3 weeks without any lifting. Will definitely be back!"),
            new("My go-to spot", "I've been coming here for months now and the quality is always consistent. Love the colour range and the staff are so friendly and welcoming."),
            new("Perfect every time", "Such a relaxing experience and my nails always look amazing. The salon is spotless and the team really know what they're doing."),
            new("Highly recommend!", "Found my new regular nail salon! The BIAB finish is flawless and they take the time to make sure you're happy with the shape and colour before starting."),
            new("Worth every penny", "A bit pricier than some places but you absolutely get what you pay for. Beautiful work, clean salon, and lovely staff. Five stars!")
        ],
        "hair" =>
        [
            new("Best haircut I've ever had", "Finally found a salon in Perth that actually listens to what I want. The cut and colour were exactly what I asked for. So happy!"),
            new("Incredible colour work", "Had a balayage done here and it's the best I've ever had. The blending is seamless and the toner is perfect. Already booked my next appointment."),
            new("Amazing transformation", "I was nervous about going shorter but the stylist made me feel so comfortable and the result was stunning. Got so many compliments!"),
            new("Consistently great", "Been coming here for over a year now and never disappointed. The team is skilled, professional and always makes me feel welcome."),
            new("Salon is beautiful", "The space is gorgeous and relaxing, and the service matches. My hair has never looked healthier since switching to this salon.")
        ],
        "lashes" =>
        [
            new("Natural and beautiful", "The most natural-looking lash extensions I've ever had. They really take the time to map out the right style for your eye shape. Love them!"),
            new("Amazing lash artist", "I've tried so many places in Perth and this is by far the best. The retention is incredible — my lashes still look full after 3 weeks."),
            new("So happy with my lashes!", "Clean, comfortable studio and the lash tech is an absolute perfectionist. I always leave feeling amazing. Can't recommend enough!"),
            new("Best in Perth", "After trying multiple lash technicians, I've finally found my forever lash artist. The fans are perfectly handmade and the application is flawless."),
            new("Worth the drive", "I travel from the other side of Perth for these lashes and it's absolutely worth it. Consistent quality every single time.")
        ],
        "brows" =>
        [
            new("Perfect brows!", "Finally found someone who understands my brow shape. The lamination looks so natural and full — exactly what I wanted."),
            new("Brow queen!", "The best brow artist in Perth, hands down. She takes her time and the symmetry is always perfect. I won't go anywhere else."),
            new("Life-changing brows", "I've had bad brow experiences before but this was completely different. The consultation was thorough and the result was beautiful."),
            new("Incredible attention to detail", "The precision and care taken with my brows was impressive. They looked perfect from day one and have held up beautifully."),
            new("My brow saviour", "After years of over-plucking, she's restored my brows to their former glory. The microblading looks completely natural.")
        ],
        "skin-care" =>
        [
            new("My skin has never looked better", "After just three sessions, the difference in my skin is remarkable. The therapist really knows their stuff and creates a customised plan."),
            new("Incredible facial", "The most thorough facial I've ever experienced. My skin was glowing for days afterwards. The products they use are beautiful."),
            new("Transformed my skin", "I came in with problem skin and they put together a treatment plan that actually worked. So grateful to have found this clinic."),
            new("Professional and knowledgeable", "The level of expertise here is impressive. They explained everything clearly and my skin has improved dramatically since starting treatments."),
            new("Best skin clinic in Perth", "The results speak for themselves — my skin hasn't looked this good in years. Worth every cent of the investment.")
        ],
        "cosmetic" =>
        [
            new("Natural-looking results", "I was nervous about getting lip filler but the practitioner was so reassuring and the result looks completely natural. Couldn't be happier."),
            new("Excellent consultation", "The most thorough consultation I've had. They really take the time to understand what you want and set realistic expectations."),
            new("Subtle and beautiful", "The anti-wrinkle treatment looks amazing — I still look like me, just refreshed. The practitioner's technique is incredible."),
            new("Trust these practitioners", "After a bad experience elsewhere, I was nervous. But the team here are so professional and skilled. My results are beautiful and natural."),
            new("Highly recommend this clinic", "The clinic is spotless, the staff are lovely, and the results are consistently excellent. I've referred all my friends here.")
        ],
        "body" =>
        [
            new("Best massage in Perth", "I've tried dozens of massage places and this is by far the best. The remedial work actually fixed my shoulder pain. Amazing."),
            new("Total relaxation", "From the moment you walk in, you feel relaxed. The massage was perfectly tailored to my needs and I left feeling like a new person."),
            new("Incredible experience", "The whole experience was five-star from start to finish. The space is beautiful and the therapist was incredibly skilled."),
            new("My regular escape", "This is my monthly treat and it never disappoints. The staff remember my preferences and always make me feel welcome."),
            new("Therapeutic and luxurious", "Not just a relaxation massage — the therapist genuinely addressed my tension areas. Felt the benefits for days afterwards.")
        ],
        "wellness" =>
        [
            new("Absolute sanctuary", "This place is a true sanctuary in the middle of Perth. Every detail is thoughtfully designed for relaxation and rejuvenation. Loved every minute."),
            new("Incredible wellness experience", "The treatment was deeply relaxing and the space is stunning. I felt completely renewed afterwards. Already booked my next visit."),
            new("Worth every cent", "A premium experience that delivers on every promise. The facilities are impeccable and the staff are warm and professional."),
            new("My happy place", "I come here whenever I need to reset. The atmosphere, the treatments, the service — everything is consistently excellent."),
            new("Best day spa in Perth", "From the welcome tea to the final treatment, every moment was pure bliss. This is how wellness should be done.")
        ],
        _ =>
        [
            new("Wonderful experience", "Really impressed with the quality of service. The team is professional and friendly, and the results exceeded my expectations."),
            new("Highly recommend", "Found my new go-to! The staff are lovely, the space is clean and inviting, and I always leave feeling great."),
            new("Five stars deserved", "Consistently great quality and service. I've recommended this place to everyone I know. Worth every penny."),
            new("So glad I found this place", "After trying a few other places in Perth, this one stands out. The attention to detail and genuine care is refreshing."),
            new("Will definitely be back", "Everything about this experience was top-notch. Professional, welcoming, and the results speak for themselves.")
        ]
    };
}
