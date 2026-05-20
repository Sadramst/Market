using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Categories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private static async Task SeedMoreBeautyProviders(AppDbContext context, UserManager<AppUser> userManager)
    {
        // Guard: skip if we already seeded all extras (check last provider)
        if (await context.Providers.AnyAsync(p => p.Slug == "beauty-and-bliss-east-perth"))
            return;

        var rng = new Random(99);
        var categories = await context.Categories.Where(c => c.MarketplaceType == ProviderType.Beauty).ToListAsync();
        var subs = categories.Where(c => c.ParentCategoryId != null).ToList();
        var parents = categories.Where(c => c.ParentCategoryId == null).ToList();
        var suburbs = await context.Suburbs.Where(s => s.IsActive).ToListAsync();
        if (!categories.Any() || !suburbs.Any()) return;

        Category? Cat(string slug) => subs.FirstOrDefault(c => c.Slug == slug) ?? parents.FirstOrDefault(c => c.Slug == slug);

        var reviewerNames = new[] {
            ("Natasha","Webb"),("Priya","Singh"),("Mei","Chen"),("Fatima","Hassan"),
            ("Rosa","Martinez"),("Aisha","Ahmed"),("Yuki","Tanaka"),("Sienna","Blake"),
            ("Tara","O'Brien"),("Jade","Nguyen"),("Amber","Scott"),("Holly","Parsons"),
            ("Courtney","Kelly"),("Bianca","Ford"),("Gemma","Chapman"),("Elise","Hart"),
            ("Megan","Price"),("Stacey","Murray"),("Daniella","Stone"),("Vanessa","Clarke"),
            ("Lauren","James"),("Rachel","Dixon"),("Fiona","Barrett"),("Helen","Wright"),
            ("Jasmin","Lloyd"),("Tamara","Boyd"),("Sasha","Russo"),("Kristy","Chan"),
            ("Leanne","Palmer"),("Brooke","Sullivan"),("Renee","Bishop"),("Donna","Marsh"),
            ("Kelly","Grant"),("Lisa","Howard"),("Wendy","Russell"),("Amanda","Fox"),
            ("Sharon","Cook"),("Tracey","Dunn"),("Debbie","Watts"),("Sandra","Hunt"),
        };
        int ri = 0;

        var hours = """{"mon":"9:00-17:30","tue":"9:00-17:30","wed":"9:00-17:30","thu":"9:00-20:00","fri":"9:00-17:30","sat":"9:00-16:00","sun":"Closed"}""";

        async Task Add(string name, string desc, string suburbName, string postCode, string? insta, Svc[] services, Rev[] reviews)
        {
            var email = name.ToLower().Replace(" ", "").Replace("&", "and").Replace("'", "") + "@example.com";
            if (email.Length > 50) email = email[..50];
            var existing = await userManager.FindByEmailAsync(email);
            if (existing != null) return;

            var parts = name.Split(' ');
            var user = new AppUser { UserName = email, Email = email, FirstName = parts[0], LastName = parts.Length > 1 ? string.Join(" ", parts[1..]) : "Beauty", EmailConfirmed = true };
            var createResult = await userManager.CreateAsync(user, "Provider@123!");
            if (!createResult.Succeeded) return;
            await userManager.AddToRoleAsync(user, UserRoles.Provider);

            var suburb = suburbs.FirstOrDefault(s => s.Name == suburbName) ?? suburbs[0];
            var slug = name.ToLower().Replace(" ", "-").Replace("&", "and").Replace("'", "").Replace("(", "").Replace(")", "");
            var featured = rng.NextDouble() < 0.2;

            var provider = new Provider
            {
                UserId = user.Id, BusinessName = name, Slug = slug, Description = desc,
                ProviderType = ProviderType.Beauty, Status = ProviderStatus.Approved,
                Phone = $"04{rng.Next(10, 99)} {rng.Next(100, 999)} {rng.Next(100, 999)}",
                Email = email, City = suburbName, State = "WA", PostalCode = postCode,
                InstagramUrl = insta != null ? $"https://instagram.com/{insta.TrimStart('@')}" : null,
                IsFeatured = featured, IsVerified = rng.NextDouble() < 0.5,
                AverageRating = 0, TotalReviews = 0,
                ApprovedAt = DateTime.UtcNow.AddDays(-rng.Next(7, 120)), ApprovedBy = "system",
                BusinessHoursJson = hours
            };
            context.Providers.Add(provider);
            await context.SaveChangesAsync();

            var areas = new List<Domain.Locations.Suburb> { suburb };
            areas.AddRange(suburbs.Where(s => s.Id != suburb.Id).OrderBy(_ => rng.Next()).Take(rng.Next(1, 3)));
            foreach (var a in areas)
                context.ProviderServiceAreas.Add(new ProviderServiceArea { ProviderId = provider.Id, SuburbId = a.Id });

            for (int i = 0; i < services.Length; i++)
            {
                var s = services[i];
                var cat = Cat(s.Cat);
                if (cat == null) continue;
                context.ProviderServices.Add(new Domain.ProviderService
                {
                    ProviderId = provider.Id, CategoryId = cat.Id, Name = s.Name,
                    PriceFrom = s.From, PriceTo = s.To, PriceNote = s.Note,
                    DurationMinutes = s.Mins, IsActive = true, SortOrder = i
                });
            }
            await context.SaveChangesAsync();

            double total = 0;
            foreach (var r in reviews)
            {
                if (ri >= reviewerNames.Length) ri = 0;
                var (fn, ln) = reviewerNames[ri++];
                var re = $"{fn.ToLower()}.{ln.ToLower()}{rng.Next(1, 999)}@example.com";
                var reviewer = await userManager.FindByEmailAsync(re);
                if (reviewer == null)
                {
                    reviewer = new AppUser { UserName = re, Email = re, FirstName = fn, LastName = ln, EmailConfirmed = true };
                    var revResult = await userManager.CreateAsync(reviewer, "Customer@123!");
                    if (!revResult.Succeeded) continue;
                    await userManager.AddToRoleAsync(reviewer, UserRoles.Customer);
                }
                context.Reviews.Add(new Domain.Reviews.Review
                {
                    UserId = reviewer.Id, ProviderId = provider.Id, Rating = r.Stars,
                    Title = r.Title, Comment = r.Body, Status = Domain.Reviews.ReviewStatus.Approved,
                    CreatedAt = DateTime.UtcNow.AddDays(-rng.Next(1, 90))
                });
                total += r.Stars;
            }
            provider.AverageRating = Math.Round(total / reviews.Length, 1);
            provider.TotalReviews = reviews.Length;
            suburb.ProviderCount++;
            await context.SaveChangesAsync();
        }

        // ===== MASSAGE PROVIDERS =====

        await Add("Thai Bliss Massage Perth",
            "Authentic Thai massage in Perth CBD by trained Thai therapists. Traditional Thai, oil massage, and Thai herbal compress. Walk-ins welcome.",
            "Perth CBD", "6000", "@thaiblissmassageperth",
            [
                new("Traditional Thai Massage (60min)", "massage", 70, 90, null, 60),
                new("Traditional Thai Massage (90min)", "massage", 100, 120, null, 90),
                new("Thai Oil Massage (60min)", "massage", 80, 100, null, 60),
                new("Thai Herbal Compress", "massage", 100, 130, null, 75),
                new("Foot Reflexology (45min)", "reflexology", 55, 70, null, 45),
                new("Head, Neck & Shoulder (30min)", "massage", 45, 55, null, 30),
            ],
            [
                new(5, "Best Thai massage in Perth", "Authentic technique just like Thailand. Absolutely incredible."),
                new(5, "Regular weekly visit", "Been coming every week for a year. My back has never felt better."),
                new(4, "Great value", "Very affordable for the quality. The herbal compress is amazing."),
            ]);

        await Add("Muscle Fix Remedial Massage",
            "Sports and remedial massage clinic in Subiaco. Specialising in injury recovery, chronic pain management, and sports performance. Health fund rebates available.",
            "Subiaco", "6008", "@musclefixperth",
            [
                new("Remedial Massage (60min)", "massage", 100, 120, null, 60),
                new("Remedial Massage (90min)", "massage", 140, 160, null, 90),
                new("Sports Massage (60min)", "massage", 110, 130, null, 60),
                new("Deep Tissue Massage (60min)", "massage", 100, 120, null, 60),
                new("Cupping Therapy Add-On", "massage", 20, 30, "add-on", 15),
                new("Dry Needling (30min)", "massage", 70, 90, null, 30),
            ],
            [
                new(5, "Fixed my shoulder", "Had frozen shoulder for months. After 4 sessions, fully recovered."),
                new(5, "Best remedial in Perth", "Deep tissue is exactly the right pressure. Health fund rebates too."),
                new(4, "Sports recovery", "Great for post-marathon recovery. Very knowledgeable therapist."),
                new(5, "Pain relief specialist", "Chronic lower back pain is finally manageable. Highly recommend."),
            ]);

        await Add("Balinese Retreat Day Spa",
            "Balinese-inspired day spa in Fremantle. Traditional Balinese massage, body scrubs, and flower bath rituals. Transport yourself to Bali.",
            "Fremantle", "6160", "@balineseretreatspa",
            [
                new("Balinese Massage (60min)", "massage", 90, 110, null, 60),
                new("Balinese Massage (90min)", "massage", 130, 150, null, 90),
                new("Frangipani Body Scrub", "day-spa", 80, 100, null, 45),
                new("Flower Bath Ritual", "day-spa", 70, 90, null, 30),
                new("Bali Bliss Package (3hr)", "day-spa", 280, 350, null, 180),
                new("Couples Balinese Massage", "day-spa", 180, 220, "per couple", 75),
            ],
            [
                new(5, "Like being in Bali!", "The flower bath is pure magic. Closed my eyes and felt like Ubud."),
                new(5, "Incredible day spa", "The Bali Bliss package is the ultimate indulgence."),
                new(4, "Lovely atmosphere", "Beautiful decor and amazing massage. A true retreat."),
            ]);

        await Add("Relax & Heal Massage Therapy",
            "Holistic massage therapy in Mount Lawley. Combining Eastern and Western techniques for total body wellness. Pregnancy and lymphatic drainage specialist.",
            "Mount Lawley", "6050", "@relaxandhealperth",
            [
                new("Swedish Massage (60min)", "massage", 85, 100, null, 60),
                new("Lymphatic Drainage Massage", "massage", 100, 120, null, 60),
                new("Pregnancy Massage (60min)", "massage", 90, 110, null, 60),
                new("Myofascial Release (60min)", "massage", 100, 120, null, 60),
                new("Relaxation Massage (90min)", "massage", 120, 140, null, 90),
            ],
            [
                new(5, "Pregnancy massage expert", "Finally someone who knows how to position and massage pregnant bodies!"),
                new(5, "Lymphatic drainage works", "My swelling reduced significantly after 3 sessions."),
                new(4, "Very healing", "Left feeling completely renewed. Wonderful therapist."),
            ]);

        await Add("Coastal Massage Scarborough",
            "Beachside massage studio steps from Scarborough Beach. Wind down after a surf with a relaxation or deep tissue massage. Ocean views from treatment rooms.",
            "Scarborough", "6019", "@coastalmassageperth",
            [
                new("Beachside Relaxation (60min)", "massage", 80, 100, null, 60),
                new("Deep Tissue Massage (60min)", "massage", 95, 115, null, 60),
                new("Post-Surf Recovery Massage", "massage", 75, 95, null, 45),
                new("Couples Ocean View Massage", "day-spa", 170, 210, "per couple", 60),
                new("Hot Shell Massage (75min)", "massage", 110, 140, null, 75),
            ],
            [
                new(5, "Ocean views while getting a massage!", "Absolutely blissful. The sound of the waves makes it perfect."),
                new(5, "Post-surf essential", "My muscles thank me every time. Great pressure and technique."),
                new(4, "Lovely beachside spot", "Great location, great massage. Book ahead in summer."),
            ]);

        // ===== MORE HAIR SALONS =====

        await Add("Blonde Theory Hair Studio",
            "Perth's blonde specialist. Lived-in blondes, platinum transformations, and colour corrections. Using Schwarzkopf BlondMe exclusively.",
            "Claremont", "6010", "@blondetheoryperth",
            [
                new("Blonde Balayage", "balayage", 280, 400, "varies by length", 180),
                new("Platinum Full Head", "hair-colouring", 300, 450, null, 150),
                new("Colour Correction", "hair-colouring", 350, 600, "consultation required", 240),
                new("Toner Refresh", "hair-colouring", 60, 80, null, 30),
                new("Cut & Blow Dry", "hair-salon", 70, 95, null, 60),
            ],
            [
                new(5, "Blonde perfection!", "Went from dark brown to icy blonde in 2 sessions. No damage!"),
                new(5, "Best colourist in Perth", "Nobody does blonde better. Worth every dollar."),
                new(4, "Amazing results", "My balayage is exactly what I showed on my Pinterest board."),
            ]);

        await Add("Curly Girl Perth",
            "Specialist curly hair salon in Maylands. DevaCut certified stylists. Cuts, treatments, and education for wavy, curly, and coily hair.",
            "Maylands", "6051", "@curlygirlperth",
            [
                new("DevaCut (Dry Cut)", "hair-salon", 85, 120, null, 75),
                new("Curly Transformation Package", "hair-salon", 150, 200, "cut + treatment + style", 120),
                new("Deep Conditioning Treatment", "keratin-treatment", 50, 70, null, 30),
                new("Curly Colour & Cut", "hair-colouring", 200, 300, null, 150),
                new("Curl Education Session", "hair-salon", 60, 80, "30min consultation", 30),
            ],
            [
                new(5, "Finally someone who gets curls!", "First time my curls have been cut properly. Life-changing."),
                new(5, "Curly hair specialist", "No more triangle hair! My curls have never looked this good."),
                new(4, "Great curly salon", "Helpful education on products and routine for my hair type."),
                new(5, "DevaCut is magic", "Every curly girl in Perth needs to come here."),
            ]);

        await Add("Gentlemen's Barber Leederville",
            "Classic barbershop with a modern twist. Hot towel shaves, beard grooming, and precision cuts. Complimentary espresso with every service.",
            "Leederville", "6007", "@gentlemensbarber",
            [
                new("Men's Haircut", "hair-salon", 40, 55, null, 30),
                new("Cut & Beard Trim", "hair-salon", 55, 70, null, 45),
                new("Hot Towel Shave", "hair-salon", 35, 50, null, 30),
                new("Beard Shape & Oil", "hair-salon", 25, 35, null, 20),
                new("Father & Son Cuts", "hair-salon", 60, 80, "2 cuts", 50),
            ],
            [
                new(5, "Best barber in Perth", "Perfect fade every time. Love the espresso too!"),
                new(5, "Old school experience", "The hot towel shave is incredible. Proper barbershop."),
                new(4, "Great cuts", "Clean, sharp cuts. Very consistent quality."),
            ]);

        // ===== MORE NAILS =====

        await Add("Cherry Blossom Nails",
            "Japanese-style nail art salon in Dianella. Intricate hand-painted designs, 3D art, and premium Presto gel. Appointment only.",
            "Dianella", "6059", "@cherryblossomperth",
            [
                new("Japanese Gel Art", "nail-art", 80, 150, "varies by design", 90),
                new("3D Nail Art Set", "nail-art", 100, 200, null, 120),
                new("Simple Gel Manicure", "gel-nails", 55, 65, null, 45),
                new("Character Nail Art", "nail-art", 120, 200, "per set", 120),
                new("Gel Pedicure with Art", "pedicure", 70, 100, null, 60),
            ],
            [
                new(5, "Art on my nails!", "The most detailed nail art I've ever seen. Incredible skill."),
                new(5, "Japanese quality", "Like having tiny paintings on each nail. Absolutely love it."),
                new(4, "Worth the wait", "Book ahead — she's booked weeks out. But so worth it!"),
            ]);

        await Add("Nail Haven Karrinyup",
            "Premium nail salon in Karrinyup. Luxurious manicures and pedicures with complimentary drinks. Hygiene is our top priority.",
            "Karrinyup", "6018", "@nailhavenperth",
            [
                new("Luxury Gel Manicure", "gel-nails", 55, 70, null, 50),
                new("Luxury Gel Pedicure", "pedicure", 65, 80, null, 55),
                new("Acrylic Full Set", "acrylic-nails", 70, 90, null, 70),
                new("SNS Dip Powder", "sns-nails", 60, 75, null, 55),
                new("Shellac Manicure", "gel-nails", 40, 50, null, 35),
                new("Pamper Package (Mani + Pedi)", "manicure", 100, 130, null, 90),
            ],
            [
                new(5, "Best nail salon near me", "Clean, professional, and beautiful results every time."),
                new(4, "Love the complimentary drinks", "Nice touch having a tea or champagne while getting nails done."),
                new(5, "Hygiene conscious", "They sterilise everything properly. Finally a salon I trust."),
            ]);

        // ===== MORE SKIN CARE =====

        await Add("Derma Glow Clinic",
            "Medical-grade skin clinic in Cottesloe. Specialising in acne treatment, pigmentation correction, and anti-ageing. Nurse-led treatments.",
            "Cottesloe", "6011", "@dermaglowperth",
            [
                new("Acne Treatment Facial", "facial", 130, 170, null, 60),
                new("Pigmentation Laser", "skin-clinic", 250, 400, "per session", 45),
                new("Skin Needling (Dermapen)", "microdermabrasion", 250, 350, null, 60),
                new("Cosmelan Peel", "chemical-peel", 800, 1200, "includes home kit", 60),
                new("LED + Hydrating Mask", "led-therapy", 70, 90, null, 30),
                new("Skin Analysis Consultation", "skin-clinic", 50, null, "redeemable on treatment", 30),
            ],
            [
                new(5, "Cleared my acne!", "After years of struggling, 3 treatments and my skin is clear."),
                new(5, "Pigmentation gone", "The Cosmelan peel was intense but my melasma has faded dramatically."),
                new(4, "Professional clinic", "Nurse-led gives me confidence. Very thorough consultation."),
            ]);

        await Add("The Skin Room Perth",
            "Boutique skin studio in Highgate. Natural and organic facials, enzyme peels, and holistic skin healing. Vegan-friendly products.",
            "Highgate", "6003", "@theskinroom",
            [
                new("Organic Glow Facial", "facial", 100, 130, null, 60),
                new("Enzyme Peel Facial", "chemical-peel", 120, 150, null, 50),
                new("Acne Clear Treatment", "facial", 110, 140, null, 55),
                new("Holistic Healing Facial", "facial", 130, 160, null, 70),
                new("Express Skin Refresh", "facial", 60, 75, null, 30),
            ],
            [
                new(5, "My skin glows!", "Organic products and amazing skill. My skin has never been happier."),
                new(4, "Love the vegan approach", "Great for sensitive skin. No harsh chemicals."),
                new(5, "Best facial in Perth", "The enzyme peel is incredible. Smooth, glowing skin for weeks."),
            ]);

        // ===== MORE WELLNESS / SPA =====

        await Add("Tranquil Waters Day Spa",
            "Luxury day spa in Applecross overlooking the Swan River. Signature body treatments, couples packages, and high tea spa experiences.",
            "Applecross", "6153", "@tranquilwaterspa",
            [
                new("Signature River View Massage (90min)", "massage", 160, 200, null, 90),
                new("High Tea & Spa Package", "day-spa", 300, 380, "includes high tea", 180),
                new("Body Polish & Wrap", "day-spa", 140, 180, null, 90),
                new("Couples Sunset Package", "day-spa", 380, 480, "per couple", 120),
                new("Express Aromatherapy (45min)", "aromatherapy", 70, 90, null, 45),
            ],
            [
                new(5, "Stunning views while you relax", "The river view treatment room is magical at sunset."),
                new(5, "High tea spa was divine", "Champagne, scones, AND a massage? Dream afternoon."),
                new(4, "Luxury experience", "A bit of a splurge but worth every cent for a special occasion."),
            ]);

        await Add("Heal & Align Wellness",
            "Holistic wellness centre in Inglewood. Reiki, crystal healing, sound therapy, and aromatherapy. Supporting mind-body connection.",
            "Inglewood", "6052", "@healandalign",
            [
                new("Reiki Healing Session", "day-spa", 80, 110, null, 60),
                new("Sound Bath Therapy", "day-spa", 40, 60, "group session", 60),
                new("Crystal Healing", "day-spa", 90, 120, null, 60),
                new("Aromatherapy Massage (60min)", "aromatherapy", 90, 110, null, 60),
                new("Energy Balancing Package", "day-spa", 150, 190, null, 90),
            ],
            [
                new(5, "Life-changing reiki", "I was sceptical but left feeling lighter than I have in years."),
                new(4, "Beautiful sound bath", "So relaxing. The singing bowls are mesmerising."),
                new(5, "Spiritual healing", "This place has helped my anxiety more than anything else."),
            ]);

        // ===== MORE COSMETIC / LASHES =====

        await Add("Lash Doll Studio",
            "Instagram-famous lash studio in South Perth. Known for mega volume, wispy hybrid, and wet-look lash sets. Perth's lash queen.",
            "South Perth", "6151", "@lashdollstudio",
            [
                new("Wispy Hybrid Set", "lash-extensions", 160, 190, null, 110),
                new("Mega Volume Full Set", "lash-extensions", 200, 240, null, 130),
                new("Wet-Look Lash Set", "lash-extensions", 180, 220, null, 120),
                new("Lash Infill (2 weeks)", "lash-extensions", 70, 90, null, 60),
                new("Lash Removal", "lash-extensions", 30, 40, null, 20),
            ],
            [
                new(5, "Best lashes in Perth!", "The wispy hybrid set is EXACTLY what I wanted. Gorgeous."),
                new(5, "Lash queen for a reason", "Everyone asks where I get my lashes. Perfection every time."),
                new(4, "Beautiful volume", "Mega volume without the weight. Very skilled."),
                new(5, "Obsessed", "Been going for 2 years. Can't imagine going anywhere else."),
            ]);

        await Add("Cosmetic Nurse Perth",
            "Experienced cosmetic nurse offering injectables in a clinical setting. Anti-wrinkle, fillers, and skin boosters. Registered nurse with 10+ years experience.",
            "West Perth", "6005", "@cosmeticnurseperth",
            [
                new("Anti-Wrinkle 1 Area", "botox", 150, 200, null, 15),
                new("Anti-Wrinkle 3 Areas", "botox", 350, 450, null, 30),
                new("Lip Enhancement (1ml)", "lip-filler", 400, 500, null, 30),
                new("Cheek Enhancement", "dermal-filler", 550, 700, "per ml", 30),
                new("Skin Booster Treatment", "skin-clinic", 350, 450, null, 45),
                new("Dissolving Treatment", "dermal-filler", 200, 300, null, 20),
            ],
            [
                new(5, "Natural and beautiful", "My lips look amazing and nobody can tell they're done."),
                new(5, "Trustworthy nurse", "10 years experience really shows. Excellent technique."),
                new(4, "Great anti-wrinkle results", "Forehead lines gone. Very happy with the result."),
            ]);

        // ===== PROVIDERS IN UNDERSERVED SUBURBS =====

        await Add("Glow Up Beauty Thornlie",
            "Affordable full-service beauty salon in Thornlie. Nails, lashes, waxing, and facials. Best value beauty in Perth's south-east.",
            "Thornlie", "6108", "@glowupthornlie",
            [
                new("Gel Manicure", "gel-nails", 40, 55, null, 40),
                new("Classic Lash Extensions", "lash-extensions", 90, 120, null, 75),
                new("Brazilian Wax", "waxing", 40, 55, null, 25),
                new("Express Facial", "facial", 50, 65, null, 30),
                new("Brow Shape & Tint", "eyebrow-threading", 25, 35, null, 20),
                new("Full Face Threading", "eyebrow-threading", 30, 40, null, 20),
            ],
            [
                new(5, "Great value!", "Affordable beauty that doesn't compromise on quality. Love it."),
                new(4, "My local go-to", "So glad to have a good beauty salon in Thornlie."),
                new(5, "Best prices in Perth", "You don't need to go to the city for great beauty treatments."),
            ]);

        await Add("Hair Loft Gosnells",
            "Friendly hair salon in Gosnells serving families since 2018. Affordable cuts, colours, and styling for the whole family.",
            "Gosnells", "6110", "@hairloftgosnells",
            [
                new("Women's Cut & Blow Dry", "hair-salon", 50, 70, null, 50),
                new("Men's Cut", "hair-salon", 25, 35, null, 25),
                new("Kids' Cut", "hair-salon", 20, 25, null, 20),
                new("Full Colour & Cut", "hair-colouring", 120, 180, null, 120),
                new("Foils & Toner", "hair-colouring", 130, 190, null, 90),
            ],
            [
                new(5, "Family-friendly salon", "The whole family goes here. Great prices and lovely staff."),
                new(4, "Consistent quality", "Never had a bad cut. Very reliable salon."),
                new(5, "Best in Gosnells", "Don't need to travel to the city for great hair."),
            ]);

        await Add("Nails & Co Baldivis",
            "Modern nail studio in Baldivis Shopping Centre. Walk-ins welcome. Offering the latest gel, SNS, and acrylic techniques.",
            "Baldivis", "6171", "@nailsandcobaldivis",
            [
                new("Gel Manicure", "gel-nails", 45, 60, null, 40),
                new("SNS Nails", "sns-nails", 55, 70, null, 50),
                new("Acrylic Full Set", "acrylic-nails", 65, 85, null, 70),
                new("Gel Pedicure", "pedicure", 55, 70, null, 50),
                new("Nail Repair", "gel-nails", 10, 15, "per nail", 10),
            ],
            [
                new(5, "Finally a great nail salon here", "No more driving to the city for good nails!"),
                new(4, "Good walk-in availability", "Popped in on a Saturday and got in quickly."),
                new(5, "Love my SNS", "Perfect every time. Such a friendly team."),
            ]);

        await Add("Brow Boutique Joondalup",
            "Dedicated brow studio in Joondalup. Expert threading, waxing, and lamination. Quick and precise with beautiful results every time.",
            "Joondalup", "6027", "@browboutiquejoondalup",
            [
                new("Eyebrow Threading", "eyebrow-threading", 18, 25, null, 15),
                new("Brow Wax & Shape", "eyebrow-waxing", 20, 28, null, 15),
                new("Brow Lamination & Tint", "brow-lamination", 55, 70, null, 35),
                new("Upper Lip Thread", "eyebrow-threading", 10, 15, null, 5),
                new("Full Face Threading", "eyebrow-threading", 35, 45, null, 25),
            ],
            [
                new(5, "Best brow threading!", "So quick and clean. My brows look perfect every time."),
                new(4, "Great lamination", "Brow lamination gives me that fluffy brow look I love."),
                new(5, "Never going anywhere else", "Consistent, affordable, and always friendly."),
            ]);

        await Add("Spray Tan Studio Hillarys",
            "Airbrush spray tan experts in Hillarys. Using Naked Tan products for a natural bronze. Perfect for events, weddings, and holidays.",
            "Hillarys", "6025", "@spraytanhillarys",
            [
                new("Full Body Airbrush Tan", "spray-tan", 40, 55, null, 20),
                new("Express 1-Hour Tan", "spray-tan", 45, 60, null, 20),
                new("Half Body Tan", "spray-tan", 25, 35, null, 15),
                new("Bridal Party Tan (3+)", "spray-tan", 35, 45, "per person, min 3", 15),
                new("Dark Glow Tan", "spray-tan", 45, 60, null, 20),
            ],
            [
                new(5, "Streak-free every time", "Best spray tan I've ever had. So natural-looking."),
                new(4, "Great for events", "Got tanned for my formal and looked amazing."),
                new(5, "Love Naked Tan", "The product fades so evenly. No patchy bits!"),
            ]);

        await Add("Beauty Bar Wanneroo",
            "Full-service beauty bar in Wanneroo. Quick, quality treatments at affordable prices. Nails, lashes, brows, and facials.",
            "Wanneroo", "6065", "@beautybarwanneroo",
            [
                new("Gel Manicure", "gel-nails", 40, 55, null, 40),
                new("Lash Lift & Tint", "lash-lift", 60, 75, null, 40),
                new("Brow Lamination", "brow-lamination", 50, 65, null, 30),
                new("Express Facial", "facial", 50, 65, null, 30),
                new("Brazilian Wax", "waxing", 45, 55, null, 25),
                new("Full Face Threading", "eyebrow-threading", 30, 40, null, 20),
            ],
            [
                new(5, "Best beauty bar up north", "Everything I need in one place. Great prices too."),
                new(4, "Quick and quality", "Lash lift was done in 40 mins and looks amazing."),
                new(5, "My regular beauty spot", "Come here for everything. Always consistent."),
            ]);

        await Add("Mane & Co Hair Studio",
            "Boutique hair salon in Ardross. Specialising in creative colour, lived-in hair, and textured cuts. Small salon, big talent.",
            "Ardross", "6153", "@maneandcohairstudio",
            [
                new("Creative Colour", "hair-colouring", 200, 350, "varies by technique", 150),
                new("Lived-In Balayage", "balayage", 250, 380, null, 180),
                new("Textured Cut & Style", "hair-salon", 75, 100, null, 60),
                new("Toner Gloss Treatment", "hair-colouring", 50, 70, null, 30),
                new("Bridal Hair Trial", "hair-salon", 100, 130, null, 75),
            ],
            [
                new(5, "Hair goals achieved!", "My lived-in balayage is stunning. Best colourist I've found."),
                new(5, "Small salon, big talent", "Love the personal attention you get here."),
                new(4, "Beautiful creative colour", "Not afraid to try new techniques. Love the result."),
            ]);

        await Add("Deep Relief Massage Mandurah",
            "Professional remedial massage in Mandurah. Focused on pain relief, rehabilitation, and stress management. HICAPS available for immediate health fund claims.",
            "Mandurah", "6210", "@deepreliefmandurah",
            [
                new("Remedial Massage (60min)", "massage", 85, 105, null, 60),
                new("Relaxation Massage (60min)", "massage", 75, 95, null, 60),
                new("Deep Tissue Massage (90min)", "massage", 120, 140, null, 90),
                new("Trigger Point Therapy", "massage", 90, 110, null, 45),
                new("Pregnancy Massage", "massage", 85, 100, null, 60),
            ],
            [
                new(5, "Pain relief specialist", "My chronic neck pain is finally under control. Amazing therapist."),
                new(4, "Health fund rebate is great", "Love the HICAPS machine — claim on the spot."),
                new(5, "Best massage in Mandurah", "Deep tissue is exactly what my body needs."),
            ]);

        await Add("Polished Pinkies Nail Bar",
            "Fun and vibrant nail bar in Butler. Specialising in press-on nails, gel extensions, and nail art. Walk-ins and appointments available.",
            "Butler", "6036", "@polishedpinkiesperth",
            [
                new("Gel Extensions", "acrylic-nails", 65, 85, null, 70),
                new("Gel Polish Manicure", "gel-nails", 40, 55, null, 35),
                new("Custom Press-On Nails", "nail-art", 50, 80, "per set", 0),
                new("Nail Art Add-On", "nail-art", 5, 20, "per nail", 10),
                new("Soak Off & Nail Care", "manicure", 25, 35, null, 20),
            ],
            [
                new(5, "Custom press-ons are genius!", "Order online and pick up. Perfect nails without the salon wait."),
                new(4, "Great gel extensions", "Strong, natural-looking extensions at good prices."),
                new(5, "Fun nail designs", "The nail art is always on trend. Love this place."),
            ]);

        await Add("Lash & Brow Bar Clarkson",
            "Specialist lash and brow studio in Clarkson. Classic, hybrid, and volume lashes. Russian volume trained. Brow lamination and microblading.",
            "Clarkson", "6030", "@lashbrowbarclarkson",
            [
                new("Classic Lash Set", "lash-extensions", 100, 130, null, 80),
                new("Hybrid Lash Set", "lash-extensions", 140, 170, null, 100),
                new("Russian Volume Set", "lash-extensions", 180, 220, null, 130),
                new("Lash Infill", "lash-extensions", 60, 80, null, 50),
                new("Brow Lamination & Tint", "brow-lamination", 55, 70, null, 35),
                new("Microblading", "microblading", 400, 550, "includes touch-up", 180),
            ],
            [
                new(5, "Volume lashes are perfect", "Finally found amazing lashes in the northern suburbs!"),
                new(4, "Great brow lamination", "My brows have never looked better. Very precise work."),
                new(5, "Worth the drive", "I come from Joondalup for these lashes. That good."),
            ]);

        await Add("Pure Skin Facial Bar",
            "Express facial bar in Victoria Park. Clinical facials in 30 minutes. Perfect for busy professionals who want results without the time commitment.",
            "Victoria Park", "6100", "@pureskinfacialbar",
            [
                new("30-Min Power Facial", "facial", 55, 70, null, 30),
                new("45-Min Hydra Boost", "hydrafacial", 80, 100, null, 45),
                new("LED Add-On", "led-therapy", 20, 30, "add-on", 15),
                new("Enzyme Resurfacing", "chemical-peel", 70, 90, null, 30),
                new("Skin Membership (4 facials/month)", "facial", 180, null, "monthly subscription", 30),
            ],
            [
                new(5, "Perfect for busy people", "30 minutes and my skin looks incredible. Genius concept."),
                new(5, "The membership is amazing", "4 facials a month keeps my skin permanently glowing."),
                new(4, "Quick but effective", "No fluff, just results. Love the express format."),
            ]);

        await Add("Healing Hands Massage Ellenbrook",
            "Family-owned massage practice in Ellenbrook. Gentle, caring approach to therapeutic and relaxation massage. All ages welcome.",
            "Ellenbrook", "6069", "@healinghandsellenbrook",
            [
                new("Relaxation Massage (60min)", "massage", 70, 90, null, 60),
                new("Therapeutic Massage (60min)", "massage", 80, 100, null, 60),
                new("Kids Massage (30min)", "massage", 35, 45, "ages 5-12", 30),
                new("Seniors Massage (60min)", "massage", 65, 80, "65+", 60),
                new("Couples Massage", "day-spa", 140, 180, "per couple", 60),
            ],
            [
                new(5, "So gentle and caring", "The therapist really listens to what you need. Beautiful practice."),
                new(4, "Great for kids", "My daughter had her first massage here and loved it."),
                new(5, "Best value massage", "Affordable and effective. Been coming monthly for years."),
            ]);

        await Add("La Belle Beauty Morley",
            "French-inspired beauty salon in Morley Galleria. Offering luxury facials, body treatments, and nail services with a Parisian touch.",
            "Morley", "6062", "@labellebeautyperth",
            [
                new("Parisian Facial", "facial", 110, 140, null, 60),
                new("French Manicure (Gel)", "gel-nails", 55, 70, null, 45),
                new("Body Exfoliation & Wrap", "day-spa", 100, 130, null, 60),
                new("Brow Sculpting", "eyebrow-waxing", 25, 35, null, 15),
                new("Lash Tint & Lift", "lash-lift", 70, 85, null, 40),
            ],
            [
                new(5, "Très magnifique!", "The French manicure is perfection. Elegant and long-lasting."),
                new(4, "Lovely Parisian vibe", "Beautiful salon with attention to every detail."),
                new(5, "My spa escape", "The body exfoliation makes my skin feel brand new."),
            ]);

        await Add("The Massage Hub Cockburn",
            "No-frills massage studio in Cockburn Central. Quality remedial and relaxation massage at honest prices. No upselling, just great massage.",
            "Cockburn Central", "6164", "@massagehubcockburn",
            [
                new("Relaxation Massage (60min)", "massage", 65, 80, null, 60),
                new("Remedial Massage (60min)", "massage", 75, 95, null, 60),
                new("Deep Tissue (60min)", "massage", 80, 100, null, 60),
                new("30-Min Express Massage", "massage", 40, 50, null, 30),
                new("90-Min Full Body", "massage", 100, 120, null, 90),
            ],
            [
                new(5, "Honest and affordable", "No gimmicks, just a great massage at a fair price."),
                new(5, "Best value remedial", "Finally a massage place that doesn't try to upsell everything."),
                new(4, "Solid massage studio", "Consistent quality. No-frills but does the job perfectly."),
            ]);

        await Add("Beauty & Bliss East Perth",
            "Upscale beauty lounge in East Perth. Premium services in a stylish, relaxing environment. Champagne on arrival for all appointments.",
            "East Perth", "6004", "@beautyandblissperth",
            [
                new("Signature Facial", "facial", 130, 170, null, 60),
                new("Luxury Gel Manicure", "gel-nails", 60, 75, null, 50),
                new("Volume Lash Extensions", "lash-extensions", 180, 220, null, 120),
                new("Full Body Massage (90min)", "massage", 140, 170, null, 90),
                new("Pamper Day Package", "day-spa", 350, 450, "facial + massage + nails", 180),
            ],
            [
                new(5, "Champagne and beauty!", "The luxury experience starts from the moment you walk in."),
                new(5, "Worth the splurge", "Pamper day package is the perfect birthday gift."),
                new(4, "Beautiful salon", "Stunning fit-out and great services. A real treat."),
            ]);
    }
}
