using Appilico.Market.Domain;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    /// <summary>
    /// Fix category misassignments, remove duplicates, update descriptions.
    /// Safe to run multiple times (idempotent).
    /// </summary>
    private static async Task FixDataQuality(AppDbContext context)
    {
        var categories = await context.Categories
            .Where(c => c.ParentCategoryId == null)
            .ToListAsync();

        // --- Fix category misassignments ---
        var categoryFixes = new Dictionary<string, string>
        {
            // Sonya's Beauty — Eyelash Extensions Studio should be Lashes, not Nails
            { "sonya-s-beauty-eyelash-extensions-studio-subiaco", "lashes" },
            // Full Spectrum Hair Concept should be Hair, not Brows
            { "full-spectrum-hair-concept-myaree", "hair" },
            // Sora Hair should be Hair, not Brows
            { "sora-hair-subiaco-subiaco", "hair" },
            // Maurice Meade is a hair salon, not Skin Care
            { "maurice-meade-subiaco-subiaco", "hair" },
        };

        foreach (var (slug, categorySlug) in categoryFixes)
        {
            var provider = await context.Providers
                .Include(p => p.Services)
                .FirstOrDefaultAsync(p => p.Slug == slug);
            var category = categories.FirstOrDefault(c => c.Slug == categorySlug);
            if (provider != null && category != null)
            {
                // Update all ProviderService entries to the correct category
                foreach (var svc in provider.Services)
                {
                    svc.CategoryId = category.Id;
                }
                await context.SaveChangesAsync();
            }
        }

        // --- Remove Seu Momento duplicate (keep Body/Massage one, delete Nails one) ---
        var seuMomentoNails = await context.Providers
            .FirstOrDefaultAsync(p => p.Slug == "seu-momento-beauty-subiaco");
        if (seuMomentoNails != null)
        {
            // Delete related entities
            var reviews = await context.Reviews.Where(r => r.ProviderId == seuMomentoNails.Id).ToListAsync();
            context.Reviews.RemoveRange(reviews);
            var services = await context.ProviderServices.Where(s => s.ProviderId == seuMomentoNails.Id).ToListAsync();
            context.ProviderServices.RemoveRange(services);
            var gallery = await context.ProviderGalleryImages.Where(g => g.ProviderId == seuMomentoNails.Id).ToListAsync();
            context.ProviderGalleryImages.RemoveRange(gallery);
            var areas = await context.ProviderServiceAreas.Where(a => a.ProviderId == seuMomentoNails.Id).ToListAsync();
            context.ProviderServiceAreas.RemoveRange(areas);
            context.Providers.Remove(seuMomentoNails);
            await context.SaveChangesAsync();
        }

        // --- Re-categorise Body/Wellness providers to Massage ---
        var massageCat = categories.FirstOrDefault(c => c.Slug == "massage");
        if (massageCat != null)
        {
            var massageSlugs = new[]
            {
                "mels-massage-and-reflexology-claremont",
                "the-little-gem-spa-massage-north-perth",
                "soothe-massage-dayspa-nedlands",
                "soothe-massage-dayspa-body-nedlands",
                "ember-bathhouse-wellness-osborne-park",
                "ember-bathhouse-osborne-park",
                "seu-momento-beauty-massage-subiaco",
                "the-head-spa-perth-south-perth",
                "djurra-day-spa-fremantle",
                "palm-beach-wellness-nedlands",
                "savasana-beauty-and-wellness-jurien-bay",
            };

            foreach (var slug in massageSlugs)
            {
                var provider = await context.Providers
                    .Include(p => p.Services)
                    .FirstOrDefaultAsync(p => p.Slug == slug);
                if (provider != null)
                {
                    foreach (var svc in provider.Services)
                    {
                        svc.CategoryId = massageCat.Id;
                    }
                    await context.SaveChangesAsync();
                }
            }
        }

        // --- Improve descriptions for top providers ---
        var descriptionUpdates = new Dictionary<string, string>
        {
            { "her-on-oxford-mount-hawthorn",
              "HER on Oxford is Mount Hawthorn's celebrated skin sanctuary, delivering transformative facial treatments from their stunning Oxford Street studio. Specialising in advanced skin treatments, dermal therapies and corrective facials, their highly trained team has built an extraordinary 625-review following of devoted Perth clients." },
            { "ivy-reign-leederville",
              "IVY REIGN is Leederville's luxurious beauty haven on Oxford Street, offering expert skin treatments, lash services and brow work in a beautifully designed studio environment. With over 400 glowing reviews and a reputation built on precision and care, IVY REIGN is one of Perth's most sought-after beauty destinations." },
            { "eesome-west-leederville",
              "Eesome is West Leederville's highly regarded aesthetic clinic delivering evidence-based skin treatments, injectables and corrective therapies from their Electric Lane studio. Their client-first philosophy and outstanding 260+ reviews reflect a team passionate about visible, lasting results." },
            { "glow-skin-and-spa-baldivis",
              "Glow Skin & Spa in Baldivis has quickly become the southern suburbs' go-to beauty destination, earning an extraordinary 284 five-star reviews. Offering a comprehensive menu of skin treatments, waxing, massage and wellness services from their Nancy Alley studio." },
            { "full-spectrum-hair-concept-myaree",
              "Full Spectrum Hair Concept in Myaree is one of Perth's most celebrated hair studios, with 275 glowing reviews and a reputation for exceptional colour work. Their Myaree studio brings creative, fashion-forward hair artistry to Perth's southern corridor." },
        };

        foreach (var (slug, description) in descriptionUpdates)
        {
            var provider = await context.Providers.FirstOrDefaultAsync(p => p.Slug == slug);
            if (provider != null)
            {
                provider.Description = description;
            }
        }
        await context.SaveChangesAsync();
    }
}
