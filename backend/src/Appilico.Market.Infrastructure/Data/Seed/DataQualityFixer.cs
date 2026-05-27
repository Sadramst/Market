using Appilico.Market.Domain;
using Appilico.Market.Domain.Categories;
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

        // --- Ensure Massage exists as a parent (top-level) category ---
        // On older databases, "massage" may exist only as a subcategory under Body
        var massageParent = categories.FirstOrDefault(c => c.Slug == "massage");
        if (massageParent == null)
        {
            var massageSub = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "massage");
            if (massageSub != null)
            {
                // Promote to parent category
                massageSub.ParentCategoryId = null;
                massageSub.IconName = "Hand";
                massageSub.Name = "Massage";
                massageSub.IsActive = true;
                await context.SaveChangesAsync();
                massageParent = massageSub;
            }
            else
            {
                // Create it fresh
                massageParent = new Category
                {
                    Name = "Massage",
                    Slug = "massage",
                    IconName = "Hand",
                    MarketplaceType = ProviderType.Beauty,
                    IsActive = true,
                    SortOrder = 10
                };
                context.Categories.Add(massageParent);
                await context.SaveChangesAsync();
            }
            // Refresh categories list
            categories = await context.Categories.Where(c => c.ParentCategoryId == null).ToListAsync();
        }

        // --- BULK FIX: Reassign all massage_providers.json providers to the Massage category ---
        // Massage may exist as parent OR subcategory (under Body) depending on seed history
        var massageCat = categories.FirstOrDefault(c => c.Slug == "massage")
            ?? await context.Categories.FirstOrDefaultAsync(c => c.Slug == "massage");
        if (massageCat != null)
        {
            // Find all providers from massage_providers.json — they have HasRealData, ProviderType=Beauty,
            // and their descriptions or services relate to massage. Match by checking if they have
            // services assigned to Body/Wellness/Skin Care categories but their business name or
            // description strongly suggests massage.
            var bodyCat = categories.FirstOrDefault(c => c.Slug == "body");
            var wellnessCat = categories.FirstOrDefault(c => c.Slug == "wellness");
            var skinCat = categories.FirstOrDefault(c => c.Slug == "skin-care");

            var wrongCatIds = new List<Guid>();
            if (bodyCat != null) wrongCatIds.Add(bodyCat.Id);
            if (wellnessCat != null) wrongCatIds.Add(wellnessCat.Id);
            if (skinCat != null) wrongCatIds.Add(skinCat.Id);

            // Get all beauty providers that have massage-related content
            var massageKeywords = new[] { "massage", "remedial", "deep tissue", "relaxation massage", "thai massage", "sports massage", "hot stone" };
            var allBeautyProviders = await context.Providers
                .Include(p => p.Services)
                .Where(p => p.ProviderType == ProviderType.Beauty && p.HasRealData)
                .ToListAsync();

            var fixCount = 0;
            foreach (var provider in allBeautyProviders)
            {
                var name = provider.BusinessName?.ToLower() ?? "";
                var desc = provider.Description?.ToLower() ?? "";
                var isMassage = massageKeywords.Any(k => name.Contains(k) || desc.Contains(k));

                if (!isMassage) continue;

                // Check if already correctly assigned
                var hasCorrectCat = provider.Services.Any(s => s.CategoryId == massageCat.Id);
                if (hasCorrectCat) continue;

                // Fix: reassign all services to massage category
                if (provider.Services.Any())
                {
                    foreach (var svc in provider.Services)
                        svc.CategoryId = massageCat.Id;
                }
                else
                {
                    // Provider has NO services at all — add default massage services
                    var defaultSvcs = new[] { ("Remedial Massage 60min", 95m), ("Relaxation Massage 60min", 85m), ("Deep Tissue 60min", 100m) };
                    for (int i = 0; i < defaultSvcs.Length; i++)
                    {
                        context.ProviderServices.Add(new ProviderService
                        {
                            ProviderId = provider.Id,
                            CategoryId = massageCat.Id,
                            Name = defaultSvcs[i].Item1,
                            PriceFrom = defaultSvcs[i].Item2,
                            DurationMinutes = 60,
                            IsActive = true,
                            SortOrder = i
                        });
                    }
                }
                fixCount++;
            }
            if (fixCount > 0)
                await context.SaveChangesAsync();
        }

        // --- Fix specific category misassignments ---
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
            // Bodysmart is physio/health, not beauty massage — recategorise to Wellness
            { "bodysmart-physio-pilates-and-chiro-perth-cbd-perth", "wellness" },
            // Glow Skin & Spa — Skin is primary
            { "glow-skin-and-spa-baldivis", "skin-care" },
            { "glow-skin-spa-baldivis", "skin-care" },
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

        // --- Remove Glow Skin & Spa duplicate (keep the massage_providers one with description) ---
        var glowSkinDupe = await context.Providers
            .FirstOrDefaultAsync(p => p.Slug == "glow-skin-spa-baldivis");
        if (glowSkinDupe != null)
        {
            var reviews2 = await context.Reviews.Where(r => r.ProviderId == glowSkinDupe.Id).ToListAsync();
            context.Reviews.RemoveRange(reviews2);
            var services2 = await context.ProviderServices.Where(s => s.ProviderId == glowSkinDupe.Id).ToListAsync();
            context.ProviderServices.RemoveRange(services2);
            var gallery2 = await context.ProviderGalleryImages.Where(g => g.ProviderId == glowSkinDupe.Id).ToListAsync();
            context.ProviderGalleryImages.RemoveRange(gallery2);
            var areas2 = await context.ProviderServiceAreas.Where(a => a.ProviderId == glowSkinDupe.Id).ToListAsync();
            context.ProviderServiceAreas.RemoveRange(areas2);
            context.Providers.Remove(glowSkinDupe);
            await context.SaveChangesAsync();
        }

        // --- Re-categorise specific Body/Wellness providers to Massage ---
        // (These are manual overrides for specific slugs that the bulk fix above may not catch)
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

        // --- WELLNESS category fix: Assign day-spa / holistic / float therapy providers ---
        var wellnessCatFinal = categories.FirstOrDefault(c => c.Slug == "wellness")
            ?? await context.Categories.FirstOrDefaultAsync(c => c.Slug == "wellness");

        if (wellnessCatFinal != null)
        {
            var wellnessKeywords = new[] { "day spa", "spa retreat", "float therapy", "float tank", "aromatherapy", "reflexology", "holistic", "wellness spa", "wellness centre", "wellness center", "bathhouse", "naturopath", "meditation", "endota" };
            var wellnessSlugs = new[]
            {
                "ember-bathhouse-wellness-osborne-park",
                "ember-bathhouse-osborne-park",
                "palm-beach-wellness-nedlands",
                "savasana-beauty-and-wellness-jurien-bay",
                "djurra-day-spa-fremantle",
                "the-head-spa-perth-south-perth",
            };

            // Manual slug overrides first
            foreach (var slug in wellnessSlugs)
            {
                var provider = await context.Providers
                    .Include(p => p.Services)
                    .FirstOrDefaultAsync(p => p.Slug == slug);
                if (provider != null)
                {
                    foreach (var svc in provider.Services)
                        svc.CategoryId = wellnessCatFinal.Id;
                }
            }

            // Bulk keyword-based wellness assignment
            var allBeautyForWellness = await context.Providers
                .Include(p => p.Services)
                .Where(p => p.ProviderType == ProviderType.Beauty && p.HasRealData)
                .ToListAsync();

            var wellnessFixCount = 0;
            foreach (var provider in allBeautyForWellness)
            {
                var name = provider.BusinessName?.ToLower() ?? "";
                var desc = provider.Description?.ToLower() ?? "";
                var isWellness = wellnessKeywords.Any(k => name.Contains(k) || desc.Contains(k));
                // Don't reassign massage providers that already have massage category
                var hasMassageSvc = massageCat != null && provider.Services.Any(s => s.CategoryId == massageCat.Id);
                if (isWellness && !hasMassageSvc && provider.Services.Any())
                {
                    // Assign the primary service to wellness; leave others intact
                    var primarySvc = provider.Services.OrderBy(s => s.SortOrder).First();
                    if (primarySvc.CategoryId != wellnessCatFinal.Id)
                    {
                        primarySvc.CategoryId = wellnessCatFinal.Id;
                        wellnessFixCount++;
                    }
                }
            }
            if (wellnessFixCount > 0)
                await context.SaveChangesAsync();
        }

        // --- Improve descriptions for top providers ---
        var descriptionUpdates = new Dictionary<string, string>        {
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
            { "breathe-beauty-wembley",
              "Owner Serena has crafted one of Perth's most adored beauty sanctuaries in Wembley, earning nearly 500 five-star reviews through consistently exceptional nail, brow, lash and skin services. Clients describe Breathe Beauty as the kind of place that genuinely makes you feel cared for." },
            { "rejuvewell-retreat-massage-and-beauty-therapy-northbridge",
              "REJUVEWELL RETREAT in Northbridge is Perth's extraordinary massage and beauty sanctuary with nearly 600 five-star reviews. Perched above James Street, they offer a comprehensive menu of therapeutic massage, body treatments and beauty services in a beautifully designed retreat environment." },
            { "harper-hair-subiaco",
              "Perth's destination for expertly crafted blonde hair, balayage and lived-in colour. Harper Hair draws colour-obsessed clients from across the city who trust the team's exceptional eye for natural, sun-kissed tones and seamlessly blended extensions." },
            { "erin-aesthetics-subiaco",
              "Trained by world-class medical professionals and anti-ageing leaders, Erin Aesthetics is a premium Subiaco clinic maintaining exceptional standards across medical-grade peels, skin needling and mesotherapy. Known for their honesty-first approach and loyal clientele." },
            { "elka-clinic-subiaco",
              "A highly regarded permanent makeup and brow clinic on Hood Street, Elka Clinic specialises in eyebrow tattooing, nano brows, eyeliner tattoo, lip blush and microneedling. Their pharmacist-backed team brings both artistry and clinical knowledge to every treatment." },
            { "ultimate-aesthetics-subiaco-subiaco",
              "Ultimate Aesthetics is Subiaco's trusted cosmetic clinic on Barker Road, offering expert cosmetic injectables, advanced skin treatments and body contouring services. With 225 glowing reviews and a team known for natural-looking results." },
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
