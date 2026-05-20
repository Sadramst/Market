using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Locations;
using Appilico.Market.Domain.Reviews;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private record Svc(string Name, string Cat, decimal From, decimal? To, string? Note, int Mins);
    private record Rev(int Stars, string Title, string Body);

    private static async Task SeedBeautyProviders(AppDbContext context, UserManager<AppUser> userManager)
    {
        if (await context.Providers.AnyAsync())
            return;

        var rng = new Random(42);
        var categories = await context.Categories.Where(c => c.MarketplaceType == ProviderType.Beauty).ToListAsync();
        var subs = categories.Where(c => c.ParentCategoryId != null).ToList();
        var parents = categories.Where(c => c.ParentCategoryId == null).ToList();
        var suburbs = await context.Suburbs.Where(s => s.IsActive).ToListAsync();
        if (!categories.Any() || !suburbs.Any()) return;

        Category? Cat(string slug) => subs.FirstOrDefault(c => c.Slug == slug) ?? parents.FirstOrDefault(c => c.Slug == slug);

        var reviewerNames = new[] {
            ("Sarah","Mitchell"),("Emma","Thompson"),("Jessica","Williams"),("Olivia","Brown"),
            ("Charlotte","Davis"),("Amelia","Wilson"),("Mia","Taylor"),("Harper","Anderson"),
            ("Ava","Thomas"),("Sophia","Jackson"),("Isabella","White"),("Grace","Harris"),
            ("Lily","Martin"),("Chloe","Garcia"),("Ruby","Martinez"),("Ella","Robinson"),
            ("Zoe","Clark"),("Lucy","Rodriguez"),("Hannah","Lewis"),("Aria","Lee"),
            ("Layla","Walker"),("Riley","Hall"),("Nora","Allen"),("Stella","Young"),
            ("Bella","King"),("Aurora","Wright"),("Violet","Lopez"),("Willow","Hill"),
            ("Hazel","Scott"),("Luna","Green"),("Ivy","Adams"),("Emilia","Baker"),
            ("Evelyn","Nelson"),("Abigail","Carter"),("Emily","Phillips"),("Madison","Evans"),
            ("Penelope","Turner"),("Scarlett","Collins"),("Victoria","Stewart"),("Eleanor","Murphy"),
            ("Natalie","Rivera"),("Leah","Cooper"),("Savannah","Rogers"),("Brooklyn","Reed"),
            ("Camila","Cook"),("Paisley","Morgan"),("Addison","Bell"),("Quinn","Bailey"),
            ("Piper","Ward"),("Samantha","Cox"),("Claire","Howard"),("Madeline","Flores"),
            ("Mackenzie","Watson"),("Aubrey","Brooks"),("Kinsley","Kelly"),("Anna","Sanders"),
            ("Kennedy","Price"),("Caroline","Bennett"),("Maya","Wood"),("Genesis","Barnes"),
            ("Naomi","Ross"),("Aaliyah","Henderson"),("Elena","Coleman"),("Sadie","Jenkins"),
            ("Autumn","Perry"),("Jade","Powell"),("Katherine","Long"),("Eva","Patterson"),
            ("Hailey","Hughes"),("Lydia","Flores"),("Jasmine","Washington"),("Ariana","Butler"),
            ("Kylie","Foster"),("Gianna","Simmons"),("Allison","Bryant"),("Reagan","Alexander"),
            ("Lila","Russell"),("Vivian","Griffin"),("Alice","Hayes"),("Delilah","Myers"),
            ("Valentina","Ford"),("Julia","Hamilton"),("Sophie","Sullivan"),("Taylor","Reynolds"),
            ("Brianna","Fisher"),("Gabriella","Ellis"),("Peyton","Harrison"),("Alexandra","McDonald"),
            ("Maria","Cruz"),("Daisy","Marshall"),("Brielle","Ortiz"),("Isla","Gomez"),
            ("Melody","Murray"),("Cecilia","Freeman"),("Josie","Wells"),("Diana","Webb"),
            ("Paige","Simpson"),("Adriana","Stevens"),
        };
        int ri = 0;

        var hours = """{"mon":"9:00-17:30","tue":"9:00-17:30","wed":"9:00-17:30","thu":"9:00-20:00","fri":"9:00-17:30","sat":"9:00-16:00","sun":"Closed"}""";

        async Task AddProvider(string name, string desc, string suburbName, string postCode, string? insta, Svc[] services, Rev[] reviews)
        {
            var email = name.ToLower().Replace(" ", "").Replace("&", "and").Replace("'", "") + "@example.com";
            if (email.Length > 50) email = email[..50];
            var existing = await userManager.FindByEmailAsync(email);
            if (existing != null) return;

            var parts = name.Split(' ');
            var user = new AppUser { UserName = email, Email = email, FirstName = parts[0], LastName = parts.Length > 1 ? string.Join(" ", parts[1..]) : "Beauty", EmailConfirmed = true };
            await userManager.CreateAsync(user, "Provider@123!");
            await userManager.AddToRoleAsync(user, UserRoles.Provider);

            var suburb = suburbs.FirstOrDefault(s => s.Name == suburbName) ?? suburbs[0];
            var slug = name.ToLower().Replace(" ", "-").Replace("&", "and").Replace("'", "").Replace("(", "").Replace(")", "");
            var featured = rng.NextDouble() < 0.25;

            var provider = new Provider
            {
                UserId = user.Id, BusinessName = name, Slug = slug, Description = desc,
                ProviderType = ProviderType.Beauty, Status = ProviderStatus.Approved,
                Phone = $"04{rng.Next(10, 99)} {rng.Next(100, 999)} {rng.Next(100, 999)}",
                Email = email, City = suburbName, State = "WA", PostalCode = postCode,
                InstagramUrl = insta != null ? $"https://instagram.com/{insta.TrimStart('@')}" : null,
                IsFeatured = featured, IsVerified = rng.NextDouble() < 0.6,
                AverageRating = 0, TotalReviews = 0,
                ApprovedAt = DateTime.UtcNow.AddDays(-rng.Next(7, 180)), ApprovedBy = "system",
                BusinessHoursJson = hours
            };
            context.Providers.Add(provider);
            await context.SaveChangesAsync();

            // Service areas
            var areas = new List<Suburb> { suburb };
            areas.AddRange(suburbs.Where(s => s.Id != suburb.Id).OrderBy(_ => rng.Next()).Take(rng.Next(1, 4)));
            foreach (var a in areas)
                context.ProviderServiceAreas.Add(new ProviderServiceArea { ProviderId = provider.Id, SuburbId = a.Id });

            // Services
            for (int i = 0; i < services.Length; i++)
            {
                var s = services[i];
                var cat = Cat(s.Cat);
                if (cat == null) continue;
                context.ProviderServices.Add(new ProviderService
                {
                    ProviderId = provider.Id, CategoryId = cat.Id, Name = s.Name,
                    PriceFrom = s.From, PriceTo = s.To, PriceNote = s.Note,
                    DurationMinutes = s.Mins, IsActive = true, SortOrder = i
                });
            }
            await context.SaveChangesAsync();

            // Reviews
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
                    await userManager.CreateAsync(reviewer, "Customer@123!");
                    await userManager.AddToRoleAsync(reviewer, UserRoles.Customer);
                }
                context.Reviews.Add(new Review
                {
                    UserId = reviewer.Id, ProviderId = provider.Id, Rating = r.Stars,
                    Title = r.Title, Comment = r.Body, Status = ReviewStatus.Approved,
                    CreatedAt = DateTime.UtcNow.AddDays(-rng.Next(1, 120))
                });
                total += r.Stars;
            }
            provider.AverageRating = Math.Round(total / reviews.Length, 1);
            provider.TotalReviews = reviews.Length;
            suburb.ProviderCount++;
            await context.SaveChangesAsync();
        }

        // ===== 45 realistic Perth beauty providers =====

        await AddProvider("Glow Studio Perth",
            "Premium nail and lash studio in the heart of Perth CBD. Specialising in luxury gel nails, lash extensions, and brow design. Walk-ins welcome.",
            "Perth CBD", "6000", "@glowstudioperth",
            new Svc[] {
                new("Classic Gel Manicure", "gel-nails", 55, 65, null, 45),
                new("Gel Pedicure", "pedicure", 60, 75, null, 50),
                new("Russian Volume Lashes", "lash-extensions", 180, 220, null, 120),
                new("Classic Lash Extensions", "lash-extensions", 120, 150, null, 90),
                new("Brow Lamination & Tint", "brow-lamination", 65, null, null, 40),
                new("Lash Lift & Tint", "lash-lift", 75, 85, null, 45),
            },
            new Rev[] {
                new(5, "Absolutely love it!", "Best gel nails I've had in Perth. The attention to detail is incredible. Will be back!"),
                new(5, "Perfect lashes every time", "I've been coming here for lash extensions for 6 months. Consistently amazing work."),
                new(4, "Great studio", "Lovely atmosphere and skilled technicians. Parking can be tricky in the CBD though."),
                new(5, "Highly recommend", "Brow lamination looks incredible. Staff are so friendly and professional."),
            });

        await AddProvider("Luxe Nails Fremantle",
            "Boutique nail salon in Fremantle offering SNS, acrylic, and gel nails. Known for our intricate nail art designs. Located on South Terrace.",
            "Fremantle", "6160", "@luxenailsfreo",
            new Svc[] {
                new("SNS Dipping Powder", "sns-nails", 65, 80, null, 60),
                new("Acrylic Full Set", "acrylic-nails", 75, 95, null, 75),
                new("Gel Polish Manicure", "gel-nails", 45, 55, null, 40),
                new("Nail Art (per nail)", "nail-art", 5, 25, "per nail", 15),
                new("Deluxe Pedicure", "pedicure", 65, 85, null, 60),
            },
            new Rev[] {
                new(5, "Best nail salon in Freo!", "The nail art is next level. I always get compliments."),
                new(4, "Really lovely", "Great SNS nails, very friendly staff. A bit pricey but worth it."),
                new(5, "My go-to salon", "Consistently beautiful nails. The acrylic work is flawless."),
            });

        await AddProvider("Brow Bar Subiaco",
            "Expert eyebrow shaping and facial threading. Perth's top destination for microblading and brow lamination. Award-winning technicians.",
            "Subiaco", "6008", "@browbarsubiaco",
            new Svc[] {
                new("Eyebrow Threading", "eyebrow-threading", 20, 30, null, 15),
                new("Microblading", "microblading", 450, 600, "includes touch-up", 180),
                new("Brow Lamination", "brow-lamination", 55, 70, null, 35),
                new("Brow Tinting", "brow-tinting", 20, 25, null, 15),
                new("Lip & Chin Threading", "eyebrow-threading", 15, 25, null, 10),
            },
            new Rev[] {
                new(5, "Life-changing microblading", "My brows have never looked better. Worth every cent!"),
                new(5, "Quick and precise", "Best threading in Perth, hands down. So fast and accurate."),
                new(4, "Great brows", "Love the lamination service. Only wish they had more parking."),
            });

        await AddProvider("The Lash Collective",
            "Perth's premier lash studio offering classic, hybrid, and volume lash extensions. We use only premium Korean silk and mink lashes.",
            "Claremont", "6010", "@thelashcollective",
            new Svc[] {
                new("Classic Lash Set", "lash-extensions", 130, 150, null, 90),
                new("Hybrid Lash Set", "lash-extensions", 160, 190, null, 110),
                new("Mega Volume Set", "lash-extensions", 200, 250, null, 150),
                new("Lash Infill (2 weeks)", "lash-extensions", 70, 90, null, 60),
                new("Lash Lift & Tint", "lash-lift", 80, 95, null, 50),
                new("Lash Tint Only", "lash-tinting", 25, 30, null, 20),
            },
            new Rev[] {
                new(5, "Obsessed with my lashes!", "Volume set is perfection. Light, fluffy, and lasts 3 weeks."),
                new(5, "Won't go anywhere else", "Been a loyal client for 2 years. Consistently stunning results."),
                new(4, "Beautiful work", "Lovely lashes and a relaxing experience. Booking can be tricky though!"),
                new(5, "First time client", "Loved my classic set! Very natural and well applied."),
            });

        await AddProvider("Skin Rituals Perth",
            "Clinical-grade facials and skin treatments in a luxurious setting. LED therapy, hydrafacials, and chemical peels tailored to your skin type.",
            "Mount Lawley", "6050", "@skinritualsperth",
            new Svc[] {
                new("Signature Facial", "facial", 120, 150, null, 60),
                new("HydraFacial MD", "hydrafacial", 199, 250, null, 75),
                new("LED Light Therapy", "led-therapy", 60, 80, null, 30),
                new("Chemical Peel", "chemical-peel", 150, 200, null, 45),
                new("Microdermabrasion", "microdermabrasion", 130, 160, null, 50),
                new("Express Glow Facial", "facial", 75, 90, null, 30),
            },
            new Rev[] {
                new(5, "My skin has never looked better", "The HydraFacial is incredible. Immediately glowing skin after every session."),
                new(5, "Professional and knowledgeable", "The therapists really know their stuff. Great skin analysis."),
                new(4, "Love the LED therapy", "Noticeable improvement in my skin texture after 4 sessions."),
            });

        await AddProvider("Mane Attraction Hair Studio",
            "Full-service hair salon specialising in balayage, colour correction, and keratin treatments. Using only premium Olaplex and Redken products.",
            "Joondalup", "6027", "@maneattraction_joondalup",
            new Svc[] {
                new("Balayage & Toner", "balayage", 250, 380, "varies by length", 180),
                new("Full Head Colour", "hair-colouring", 180, 260, null, 120),
                new("Half Head Foils", "hair-colouring", 150, 200, null, 90),
                new("Keratin Smoothing Treatment", "keratin-treatment", 300, 400, null, 150),
                new("Cut & Blow Dry", "hair-salon", 65, 95, null, 60),
                new("Olaplex Treatment Add-On", "hair-salon", 35, 50, "add-on", 20),
            },
            new Rev[] {
                new(5, "Best balayage in Perth!", "My hair has never looked so good. The blending is seamless."),
                new(5, "Colour correction miracle", "They fixed a terrible box dye job. The result is stunning."),
                new(4, "Great salon", "Friendly staff and lovely atmosphere. Keratin treatment worked wonders."),
                new(5, "Always perfect", "Been coming for years. Consistent quality every single time."),
            });

        await AddProvider("Blush Mobile Beauty",
            "Mobile beauty services across Perth metro. We come to you! Perfect for bridal parties, events, and busy professionals.",
            "South Perth", "6151", "@blushmobilebeauty",
            new Svc[] {
                new("Mobile Makeup Application", "makeup-artist", 100, 150, null, 60),
                new("Bridal Makeup Trial", "bridal-makeup", 120, 150, null, 75),
                new("Bridal Day-Of Makeup", "bridal-makeup", 200, 280, null, 90),
                new("Bridal Party Makeup", "bridal-makeup", 100, 130, "per person", 45),
                new("Mobile Spray Tan", "spray-tan", 45, 65, null, 30),
                new("Mobile Lash Extensions", "lash-extensions", 150, 200, "includes travel", 120),
            },
            new Rev[] {
                new(5, "Made my wedding day!", "The bridal makeup was flawless and lasted all day and night."),
                new(5, "So convenient", "Love that they come to me. Great quality makeup and very professional."),
                new(5, "Bridal party loved it", "All 6 bridesmaids looked incredible. Highly organised and talented."),
            });

        await AddProvider("The Wax Room",
            "Specialist waxing studio for women and men. Brazilian, full body, and facial waxing using premium hard wax for minimal discomfort.",
            "Victoria Park", "6100", "@thewaxroom_perth",
            new Svc[] {
                new("Brazilian Wax", "waxing", 55, 70, null, 30),
                new("Full Leg Wax", "waxing", 45, 60, null, 30),
                new("Full Body Wax (Women)", "waxing", 120, 160, null, 75),
                new("Brow Wax & Shape", "eyebrow-waxing", 20, 30, null, 15),
                new("Underarm Wax", "waxing", 20, 25, null, 10),
                new("Half Leg Wax", "waxing", 30, 40, null, 20),
            },
            new Rev[] {
                new(5, "Least painful wax ever", "They use amazing wax. Brazilian was so quick and much less painful."),
                new(4, "Great service", "Very professional and hygienic. In and out in 20 minutes."),
                new(5, "Won't go anywhere else", "Best waxing in Perth. Fair prices and lovely staff."),
            });

        await AddProvider("Radiance Skin Clinic",
            "Advanced cosmetic treatments including dermal fillers, anti-wrinkle injections, and skin rejuvenation. Led by qualified cosmetic nurses.",
            "Cottesloe", "6011", "@radianceskinclinic",
            new Svc[] {
                new("Lip Filler (1ml)", "lip-filler", 350, 450, "per ml", 45),
                new("Anti-Wrinkle Injections", "botox", 200, 500, "per area", 30),
                new("Cheek Filler", "dermal-filler", 500, 700, "per ml", 45),
                new("Chin/Jawline Filler", "dermal-filler", 500, 700, "per ml", 45),
                new("Skin Consultation", "skin-clinic", 0, null, "free", 30),
                new("PRP Skin Rejuvenation", "skin-clinic", 400, 600, null, 60),
            },
            new Rev[] {
                new(5, "Natural looking lips", "Best lip filler I've had. So natural and well proportioned."),
                new(5, "Incredible nurse injector", "Very knowledgeable and takes time to explain everything."),
                new(4, "Great results", "Chin filler has transformed my profile. Very happy."),
                new(5, "Finally found my clinic", "The best cosmetic clinic in Perth."),
            });

        await AddProvider("Zen Day Spa",
            "Perth's favourite day spa experience. Full-body massages, aromatherapy, and relaxation packages in a tranquil Scarborough setting near the beach.",
            "Scarborough", "6019", "@zendayspaperth",
            new Svc[] {
                new("Swedish Relaxation Massage (60min)", "massage", 90, 110, null, 60),
                new("Deep Tissue Massage (60min)", "massage", 100, 120, null, 60),
                new("Hot Stone Massage", "massage", 120, 150, null, 75),
                new("Couples Massage Package", "day-spa", 200, 260, "per couple", 90),
                new("Aromatherapy Massage", "aromatherapy", 100, 130, null, 60),
                new("Full Day Spa Package", "day-spa", 350, 450, null, 240),
            },
            new Rev[] {
                new(5, "Heavenly experience", "The hot stone massage was absolute bliss. Beautiful spa environment."),
                new(5, "Best massage in Perth", "Deep tissue was exactly what I needed. Incredibly skilled."),
                new(4, "Lovely spa", "Great couples package for our anniversary. Will return."),
                new(5, "My happy place", "I come here monthly. Always leave feeling completely rejuvenated."),
            });

        await AddProvider("Bronze & Glow Tanning",
            "Expert spray tan studio in Cannington. We use only organic, vegan-friendly solutions for a natural, streak-free glow that lasts.",
            "Cannington", "6107", "@bronzeandglowperth",
            new Svc[] {
                new("Full Body Spray Tan", "spray-tan", 35, 50, null, 20),
                new("Express Tan (2hr wash off)", "spray-tan", 40, 55, null, 20),
                new("Half Body Spray Tan", "spray-tan", 25, 35, null, 15),
                new("Bridal Tan Package", "spray-tan", 60, 80, "includes trial", 30),
            },
            new Rev[] {
                new(5, "Most natural tan ever!", "No orange tinge, no streaks. Perfect every time."),
                new(4, "Great tan", "Lasts about a week and fades evenly. Very happy."),
                new(5, "Pre-wedding glow", "Got the bridal package and looked amazing."),
            });

        await AddProvider("Braids by Bree",
            "Perth's braiding specialist. Box braids, cornrows, knotless braids, and protective styles. All hair types welcome. Mobile service available.",
            "Morley", "6062", "@braidsbybree_",
            new Svc[] {
                new("Knotless Box Braids", "braiding", 200, 350, "varies by length", 300),
                new("Cornrows (full head)", "braiding", 80, 150, null, 120),
                new("Feed-In Braids", "braiding", 100, 180, null, 150),
                new("Twist Outs", "braiding", 80, 120, null, 90),
                new("Clip-In Extensions Install", "hair-extensions", 60, 80, "extensions not included", 45),
            },
            new Rev[] {
                new(5, "Amazing braids!", "Bree is so talented. Knotless braids were neat and lasted 8 weeks."),
                new(5, "Best braider in Perth", "Hard to find good braiders in Perth. Bree is the best."),
                new(4, "Great work", "Beautiful cornrows. Took a while but the result was perfect."),
            });

        await AddProvider("Laser Aesthetics Perth",
            "State-of-the-art laser hair removal clinic using the latest Soprano ICE technology. All skin types treated safely and effectively.",
            "West Perth", "6005", "@laseraestheticsperth",
            new Svc[] {
                new("Brazilian Laser", "laser-hair-removal", 99, 149, "per session", 20),
                new("Full Legs Laser", "laser-hair-removal", 199, 299, "per session", 30),
                new("Underarms Laser", "laser-hair-removal", 49, 79, "per session", 15),
                new("Full Body Laser Package", "laser-hair-removal", 499, 699, "per session", 90),
                new("Brazilian + Underarm Combo", "laser-hair-removal", 129, 179, "per session", 25),
                new("Face Laser (upper lip/chin)", "laser-hair-removal", 39, 59, "per session", 10),
            },
            new Rev[] {
                new(5, "Finally smooth skin!", "After 6 sessions, barely any hair left. The Soprano ICE is painless."),
                new(4, "Great results", "Noticeable reduction after 3 sessions. Staff are very professional."),
                new(5, "Best laser clinic", "Tried 3 different clinics before this one. Best results by far."),
                new(5, "Pain-free laser", "Was so nervous but it was completely painless. Amazing results."),
            });

        await AddProvider("Polish & Pour Nail Bar",
            "Modern nail bar in Leederville. Get your nails done with a glass of prosecco. Walk-ins and appointments available.",
            "Leederville", "6007", "@polishandpour",
            new Svc[] {
                new("Classic Manicure", "manicure", 35, 45, null, 30),
                new("Gel Manicure", "gel-nails", 50, 65, null, 45),
                new("Spa Pedicure", "pedicure", 55, 70, null, 50),
                new("Gel Pedicure", "gel-nails", 60, 75, null, 55),
                new("Nail Art Design", "nail-art", 10, 30, "per nail", 15),
                new("Mani + Pedi Combo", "manicure", 80, 110, null, 75),
            },
            new Rev[] {
                new(5, "Such a fun concept!", "Love getting my nails done with a glass of bubbly. Great vibe."),
                new(5, "Beautiful gel nails", "Always so clean and precise. My go-to nail salon."),
                new(4, "Cute nail bar", "Walk-in friendly which is great. Nail art was lovely."),
            });

        await AddProvider("SFX Makeup by Tara",
            "Special effects and editorial makeup artist. Film, TV, theatre, Halloween, and creative looks. Based in Perth, available Australia-wide.",
            "Northbridge", "6003", "@sfxbytara",
            new Svc[] {
                new("SFX Makeup (Film/TV)", "sfx-makeup", 250, 500, "per day", 180),
                new("Halloween Makeup", "sfx-makeup", 80, 200, "varies by complexity", 90),
                new("Editorial Makeup (Photoshoot)", "makeup-artist", 150, 250, null, 90),
                new("Theatre Makeup", "sfx-makeup", 100, 180, null, 60),
                new("Creative Glam Makeup", "makeup-artist", 120, 180, null, 75),
            },
            new Rev[] {
                new(5, "Mind-blowing SFX work", "Hired Tara for a short film. The prosthetics were incredible."),
                new(5, "Best Halloween makeup!", "My zombie makeup was so realistic. Amazing talent."),
                new(5, "Editorial perfection", "Perfect for my portfolio shoot. Understood the brief immediately."),
            });

        await AddProvider("Hair Extensions Perth",
            "Perth's leading hair extensions specialist. Tape-in, micro-link, and hand-tied weft extensions. Free consultations available.",
            "Applecross", "6153", "@hairextensionsperth",
            new Svc[] {
                new("Tape-In Extensions (Full Head)", "hair-extensions", 400, 600, "hair included", 120),
                new("Micro-Link Extensions", "hair-extensions", 500, 800, "hair included", 180),
                new("Hand-Tied Weft", "hair-extensions", 600, 900, "hair included", 150),
                new("Extensions Maintenance", "hair-extensions", 100, 150, null, 60),
                new("Extensions Removal", "hair-extensions", 60, 100, null, 45),
                new("Cut & Style (with extensions)", "hair-salon", 80, 120, null, 60),
            },
            new Rev[] {
                new(5, "Dream hair achieved!", "Went from a bob to waist-length hair. The blend is seamless."),
                new(5, "Extensions specialist", "The only place that gets it right every time."),
                new(4, "Beautiful hair", "Tape-ins look so natural. A bit pricey but worth it."),
                new(5, "Wow factor hair", "Everyone asks if my hair is real. Amazing job."),
            });

        await AddProvider("Float & Restore",
            "Premium float therapy and wellness centre. Sensory deprivation tanks, infrared sauna, and massage therapy. Book your reset.",
            "Nedlands", "6009", "@floatandrestore",
            new Svc[] {
                new("60-Minute Float Session", "float-therapy", 69, 89, null, 60),
                new("90-Minute Float Session", "float-therapy", 89, 109, null, 90),
                new("Float + Massage Package", "day-spa", 159, 199, null, 120),
                new("Infrared Sauna (30min)", "day-spa", 30, 45, null, 30),
                new("Remedial Massage", "massage", 90, 120, null, 60),
                new("First Float Special", "float-therapy", 49, null, "first time only", 60),
            },
            new Rev[] {
                new(5, "Life-changing experience", "Floating is the ultimate reset. I sleep like a baby after."),
                new(5, "Incredible wellness centre", "Love combining a float with a massage. Pure bliss."),
                new(4, "Great float tanks", "Clean, modern tanks. Staff are very welcoming."),
                new(5, "My weekly ritual", "I float every week. Done wonders for my anxiety."),
            });

        await AddProvider("Brow & Beauty Hub",
            "One-stop beauty destination. Expert brow shaping, facials, lash extensions, and waxing. Convenient Rockingham location.",
            "Rockingham", "6168", "@browanbeautyhub",
            new Svc[] {
                new("Brow Shape & Tint", "eyebrow-threading", 30, 40, null, 20),
                new("Brow Lamination", "brow-lamination", 50, 65, null, 35),
                new("Express Facial", "facial", 60, 80, null, 30),
                new("Classic Lash Extensions", "lash-extensions", 110, 140, null, 80),
                new("Full Face Wax", "waxing", 35, 50, null, 25),
                new("Brazilian Wax", "waxing", 50, 65, null, 25),
            },
            new Rev[] {
                new(5, "Love this place!", "One stop for everything. Great brows and lashes at fair prices."),
                new(4, "Convenient and professional", "Glad to have a quality beauty spot in Rockingham."),
                new(5, "My regular spot", "Been coming for a year. Always great service and results."),
            });

        await AddProvider("Body Sculpt Studio",
            "Non-invasive body contouring and sculpting treatments. Fat freezing, cavitation, and RF skin tightening. Real results, no surgery.",
            "Booragoon", "6154", "@bodysculptstudio",
            new Svc[] {
                new("CoolSculpting (per area)", "body-sculpting", 300, 500, "per area", 60),
                new("Cavitation Treatment", "body-sculpting", 150, 200, null, 45),
                new("RF Skin Tightening", "body-sculpting", 150, 250, "per area", 45),
                new("Body Contouring Package (6 sessions)", "body-sculpting", 1200, 1800, "package", 45),
                new("Free Body Assessment", "body-sculpting", 0, null, "free", 30),
            },
            new Rev[] {
                new(5, "Actually works!", "Lost 3cm off my waist after 4 sessions. So happy."),
                new(4, "Noticeable results", "The RF tightening has really improved my skin."),
                new(5, "Non-surgical solution", "CoolSculpting was painless and effective."),
            });

        await AddProvider("Nails on Wheels Perth",
            "Mobile nail technician servicing Perth metro. Gel, acrylic, and SNS nails at your home, office, or event. Licensed and insured.",
            "Belmont", "6104", "@nailsonwheelsperth",
            new Svc[] {
                new("Mobile Gel Manicure", "gel-nails", 55, 70, "includes travel", 50),
                new("Mobile Acrylic Full Set", "acrylic-nails", 80, 100, "includes travel", 80),
                new("Mobile SNS Nails", "sns-nails", 70, 85, "includes travel", 65),
                new("Mobile Pedicure", "pedicure", 60, 80, "includes travel", 55),
                new("Pamper Party Package (4+)", "gel-nails", 50, 65, "per person, min 4", 50),
            },
            new Rev[] {
                new(5, "So convenient!", "Having my nails done at home is the best. Great quality too."),
                new(5, "Perfect for busy mums", "Can't get to a salon with kids — this is a lifesaver!"),
                new(4, "Lovely nails", "Great mobile service. Very professional and clean setup."),
            });

        await AddProvider("Elysian Hair & Beauty",
            "Full-service hair and beauty salon in Midland. Cuts, colours, styling, facials, and lash extensions. Family-friendly with a kids' corner.",
            "Midland", "6056", "@elysianhairbeauty",
            new Svc[] {
                new("Women's Cut & Style", "hair-salon", 60, 85, null, 60),
                new("Men's Cut", "hair-salon", 30, 40, null, 30),
                new("Full Colour & Cut", "hair-colouring", 160, 220, null, 120),
                new("Highlights & Toner", "hair-colouring", 140, 200, null, 90),
                new("Relaxation Facial", "facial", 70, 90, null, 45),
                new("Classic Lash Extensions", "lash-extensions", 100, 130, null, 75),
            },
            new Rev[] {
                new(5, "Best salon in Midland", "Great cuts, great colours, great service. 3 years running."),
                new(4, "Family-friendly salon", "Love the kids' corner — makes it possible to get my hair done!"),
                new(5, "Always a great experience", "The team is so welcoming. My colour always turns out beautiful."),
            });

        await AddProvider("Serenity Massage & Spa",
            "Therapeutic and relaxation massage in a calming Armadale setting. Remedial, hot stone, and pregnancy massage by qualified therapists.",
            "Armadale", "6112", "@serenitymassageperth",
            new Svc[] {
                new("Relaxation Massage (60min)", "massage", 80, 100, null, 60),
                new("Remedial Massage (60min)", "massage", 90, 110, null, 60),
                new("Hot Stone Massage (90min)", "massage", 130, 160, null, 90),
                new("Pregnancy Massage", "massage", 85, 100, null, 60),
                new("Couples Massage", "day-spa", 180, 220, "per couple", 75),
            },
            new Rev[] {
                new(5, "Best massage ever", "The remedial massage sorted out my chronic back pain."),
                new(4, "Very relaxing", "Beautiful calming environment. Therapist was gentle and skilled."),
                new(5, "Pregnancy massage heaven", "So hard to find a good pregnancy massage. This is perfect."),
            });

        await AddProvider("Glo Skin Bar",
            "Express beauty bar specialising in quick, quality treatments. BB glow, micro-needling, and express facials. Walk-ins welcome.",
            "Willetton", "6155", "@gloskinbar",
            new Svc[] {
                new("BB Glow Treatment", "facial", 150, 200, null, 60),
                new("Micro-Needling", "microdermabrasion", 200, 280, null, 45),
                new("Express Glow Facial (30min)", "facial", 55, 70, null, 30),
                new("LED + Mask Combo", "led-therapy", 50, 65, null, 30),
                new("Dermaplaning", "facial", 80, 100, null, 35),
            },
            new Rev[] {
                new(5, "BB Glow is amazing!", "My skin is literally glowing. No foundation needed for weeks."),
                new(4, "Quick and effective", "Love the express facial — perfect for my lunch break."),
                new(5, "Micro-needling results", "After 3 sessions, my acne scars have significantly faded."),
            });

        await AddProvider("Studio 88 Nails & Lashes",
            "Trendy nail and lash studio in Ellenbrook. Cat-eye nails, ombre gels, and Y2K-inspired designs. Follow us on TikTok for the latest trends.",
            "Ellenbrook", "6069", "@studio88nails",
            new Svc[] {
                new("Ombre Gel Nails", "gel-nails", 60, 80, null, 50),
                new("Cat-Eye Gel Nails", "gel-nails", 60, 80, null, 50),
                new("Chrome/Mirror Nails", "nail-art", 65, 85, null, 55),
                new("Classic Lash Set", "lash-extensions", 100, 130, null, 75),
                new("Lash Lift & Tint", "lash-lift", 65, 80, null, 40),
                new("Full Set + Lash Combo", "gel-nails", 140, 180, null, 105),
            },
            new Rev[] {
                new(5, "Trendiest nails in Perth!", "Cat-eye nails are incredible. Always get compliments."),
                new(5, "Love the vibe", "Such a fun studio. Music, trendy designs, and great skills."),
                new(4, "Great combo deal", "Nails + lashes in one appointment is so convenient."),
            });

        await AddProvider("Reflections Beauty Therapy",
            "Experienced beauty therapist offering personalised skin treatments, relaxation therapies, and anti-ageing facials. Over 15 years experience.",
            "Como", "6152", "@reflectionsbeautytherapy",
            new Svc[] {
                new("Anti-Ageing Facial", "facial", 110, 140, null, 60),
                new("Glycolic Peel", "chemical-peel", 120, 160, null, 40),
                new("Back Facial", "facial", 90, 110, null, 45),
                new("Massage & Facial Combo", "massage", 150, 190, null, 90),
                new("Eye Treatment", "facial", 60, 80, null, 30),
            },
            new Rev[] {
                new(5, "Ageless skin!", "The anti-ageing facial series has made such a visible difference."),
                new(4, "Very knowledgeable", "15 years experience really shows. Great personalised advice."),
                new(5, "Hidden gem", "Don't overlook this place. Some of the best facials in Perth."),
            });

        await AddProvider("Silk & Stone Spa",
            "Boutique day spa in Dalkeith. Luxurious treatments in an elegant heritage building. Hot stone massage, body wraps, and signature facial rituals.",
            "Dalkeith", "6009", "@silkandstonespa",
            new Svc[] {
                new("Signature Stone Massage (90min)", "massage", 160, 200, null, 90),
                new("Luxury Body Wrap", "day-spa", 130, 170, null, 75),
                new("Rose Gold Facial Ritual", "facial", 140, 180, null, 60),
                new("Aromatherapy Journey (2hr)", "aromatherapy", 200, 260, null, 120),
                new("Couples Retreat Package", "day-spa", 400, 500, "per couple", 180),
                new("Champagne Spa Day", "day-spa", 450, 550, "includes lunch", 300),
            },
            new Rev[] {
                new(5, "Pure luxury", "The Champagne Spa Day was unforgettable. Absolutely world-class."),
                new(5, "Best spa in Perth", "The heritage building adds so much character. Treatments are divine."),
                new(5, "Anniversary treat", "Couples retreat was perfection. Already booked our next visit."),
                new(4, "Exquisite", "Rose gold facial left my skin looking 10 years younger."),
            });

        await AddProvider("Brows on Fleek",
            "Specialist brow studio offering microblading, ombre brows, and nano brows. Natural, flattering results by certified PMU artists.",
            "Canning Vale", "6155", "@browsonfleekperth",
            new Svc[] {
                new("Microblading", "microblading", 400, 550, "includes 6-week touch-up", 180),
                new("Ombre/Powder Brows", "microblading", 450, 600, "includes touch-up", 180),
                new("Nano Brows", "microblading", 500, 650, "includes touch-up", 180),
                new("Brow Lamination & Tint", "brow-lamination", 60, 75, null, 40),
                new("Brow Tint Only", "brow-tinting", 20, 25, null, 15),
            },
            new Rev[] {
                new(5, "Perfect brows at last!", "Microblading has changed my life. Perfect brows every day."),
                new(5, "So natural looking", "You can't tell they're tattooed. The artist is incredibly talented."),
                new(4, "Ombre brows are beautiful", "Love my powder brows. Healing was easy with the aftercare kit."),
                new(5, "Worth the investment", "Best money I've ever spent on beauty."),
            });

        await AddProvider("Tanned in Perth",
            "Professional spray tanning studio. Multiple shade options from natural glow to full glam. Competition tanning also available.",
            "Dianella", "6059", "@tannedinperth",
            new Svc[] {
                new("Natural Glow Spray Tan", "spray-tan", 30, 40, null, 15),
                new("Medium Bronze Spray Tan", "spray-tan", 35, 45, null, 15),
                new("Full Glam Dark Tan", "spray-tan", 40, 50, null, 20),
                new("Competition Tan", "spray-tan", 80, 120, "includes 2 coats", 45),
                new("Tan Party (3+ people)", "spray-tan", 30, 40, "per person", 15),
            },
            new Rev[] {
                new(4, "Great tan!", "Natural glow was perfect for everyday. No weird smell either."),
                new(5, "Competition ready", "Got my comp tan here. Even coverage and perfect colour."),
                new(5, "My favourite tan studio", "They use the best solution. Never streaky, always gorgeous."),
            });

        await AddProvider("Crystal Clear Skin",
            "Clinical aesthetics clinic in Mandurah. Treating acne, pigmentation, and anti-ageing with advanced technology. Dermal therapist on site.",
            "Mandurah", "6210", "@crystalclearskin_",
            new Svc[] {
                new("Acne Treatment Facial", "facial", 100, 130, null, 60),
                new("Pigmentation Correction Peel", "chemical-peel", 140, 180, null, 45),
                new("HydraFacial", "hydrafacial", 180, 220, null, 60),
                new("Diamond Microdermabrasion", "microdermabrasion", 100, 130, null, 40),
                new("Skin Analysis Consultation", "facial", 0, null, "free", 30),
            },
            new Rev[] {
                new(5, "Cleared my acne!", "After years of struggling, they finally got my skin clear."),
                new(5, "Pigmentation gone!", "The peel series reduced my sun spots dramatically."),
                new(4, "Professional clinic", "Very clinical and thorough approach. Great for real skin concerns."),
            });

        await AddProvider("The Beauty Edit",
            "Curated beauty experience in South Perth. Nails, brows, lashes, and facials all under one roof. Modern, Instagram-worthy space.",
            "South Perth", "6151", "@thebeautyedit_",
            new Svc[] {
                new("Gel Manicure", "gel-nails", 50, 65, null, 45),
                new("Builder Gel Overlay", "gel-nails", 70, 90, null, 60),
                new("Brow Lamination & Tint", "brow-lamination", 55, 70, null, 35),
                new("Lash Lift & Tint", "lash-lift", 70, 85, null, 45),
                new("Hydrating Facial", "facial", 80, 110, null, 45),
                new("Full Pamper Package", "facial", 170, 220, null, 120),
            },
            new Rev[] {
                new(5, "My happy place", "Everything under one roof and done beautifully. Gorgeous space."),
                new(5, "Pamper package is amazing", "Nails, brows, lashes, and a facial — felt like a new person!"),
                new(4, "Great all-rounder", "Consistent quality across all services. Very convenient."),
            });

        await AddProvider("Naked Skin Clinic",
            "Advanced skin clinic focused on results. Offering consultations, treatment plans, and ongoing skin management. Cosmelan specialist.",
            "East Perth", "6004", "@nakedskinclinic",
            new Svc[] {
                new("Comprehensive Skin Consultation", "skin-clinic", 50, 80, "redeemable on treatments", 45),
                new("Cosmelan Peel", "chemical-peel", 800, 1000, "includes aftercare kit", 60),
                new("Clinical Facial", "facial", 120, 160, null, 60),
                new("LED Therapy Session", "led-therapy", 50, 70, null, 25),
                new("Skin Needling", "microdermabrasion", 250, 350, null, 45),
            },
            new Rev[] {
                new(5, "Skin transformation!", "The Cosmelan peel transformed my melasma. Life-changing."),
                new(5, "Incredibly knowledgeable", "Best skin clinic. They create proper treatment plans."),
                new(4, "Seeing real results", "My skin has improved so much. Worth the investment."),
            });

        await AddProvider("Polished & Poised",
            "Elegant nail studio in Mosman Park. Specialising in Japanese gel, nail art, and natural nail care. Toxic-free products only.",
            "Mosman Park", "6012", "@polishedandpoised",
            new Svc[] {
                new("Japanese Gel Manicure", "gel-nails", 60, 80, null, 50),
                new("Natural Nail Manicure", "manicure", 40, 55, null, 35),
                new("Intricate Nail Art (per nail)", "nail-art", 10, 40, "per nail", 20),
                new("BIAB (Builder In A Bottle)", "gel-nails", 65, 85, null, 55),
                new("Luxury Hand Treatment", "manicure", 50, 65, null, 40),
            },
            new Rev[] {
                new(5, "Japanese gel is next level!", "Thinner, more natural, lasts longer than regular gel."),
                new(5, "Love the toxic-free approach", "A salon that cares about what they put on your nails."),
                new(4, "Stunning nail art", "The attention to detail is remarkable. True artistry."),
            });

        await AddProvider("Revive Reflexology",
            "Traditional reflexology and holistic therapies in Kalamunda. Foot, hand, and facial reflexology for wellness and stress relief.",
            "Kalamunda", "6076", "@revivereflexology",
            new Svc[] {
                new("Foot Reflexology (60min)", "reflexology", 70, 90, null, 60),
                new("Hand Reflexology (30min)", "reflexology", 40, 50, null, 30),
                new("Facial Reflexology", "reflexology", 60, 80, null, 45),
                new("Aromatherapy Massage", "aromatherapy", 85, 110, null, 60),
                new("Reflexology + Aromatherapy Combo", "reflexology", 120, 150, null, 90),
            },
            new Rev[] {
                new(5, "So therapeutic", "The foot reflexology is incredibly relaxing. Helped my headaches."),
                new(4, "Unique experience", "Only reflexology specialist in Perth. Very knowledgeable."),
                new(5, "Hidden gem in the hills", "Worth the drive to Kalamunda. Truly healing."),
            });

        await AddProvider("Luxe Lash Lounge",
            "Upscale lash studio in Hillarys. Volume, mega volume, and wet look lash extensions. Comfortable private treatment rooms.",
            "Hillarys", "6025", "@luxelashlounge",
            new Svc[] {
                new("Classic Lash Extensions", "lash-extensions", 120, 150, null, 90),
                new("Volume Lash Extensions", "lash-extensions", 170, 200, null, 120),
                new("Mega Volume/Wet Look", "lash-extensions", 200, 240, null, 150),
                new("Lash Lift & Tint", "lash-lift", 75, 90, null, 50),
                new("Brow Lamination", "brow-lamination", 55, 70, null, 35),
                new("Lash Infill (3 weeks)", "lash-extensions", 80, 100, null, 60),
            },
            new Rev[] {
                new(5, "Best lashes I've ever had", "The volume set is absolute perfection. Light and fluffy."),
                new(5, "Luxurious experience", "Private room, heated bed, soft music. Fell asleep!"),
                new(4, "Consistently great", "Been getting lashes done here for a year. Always happy."),
            });

        await AddProvider("Perth Brow Studio",
            "Dedicated brow studio specialising in permanent makeup. Feather touch, ombre, and combination brows. Award-winning PMU artist.",
            "Scarborough", "6019", "@perthbrowstudio",
            new Svc[] {
                new("Feather Touch Brows", "microblading", 450, 600, "includes touch-up", 180),
                new("Combination Brows", "microblading", 500, 650, "includes touch-up", 180),
                new("Brow Lamination + Shape", "brow-lamination", 60, 75, null, 40),
                new("Brow Wax & Tint", "eyebrow-waxing", 25, 35, null, 20),
                new("PMU Colour Boost", "microblading", 200, 300, "12+ months post initial", 120),
            },
            new Rev[] {
                new(5, "Award-winning for a reason!", "My feather touch brows look incredibly natural."),
                new(5, "Changed my mornings", "No more drawing brows every day. Perfect all the time."),
                new(5, "Combination brows are stunning", "Perfect blend of strokes and shading."),
                new(4, "Great experience", "Very thorough consultation. Felt very confident."),
            });

        await AddProvider("Golden Glow Beauty",
            "Affordable beauty services in Thornlie. Waxing, threading, facials, and tinting. No compromise on quality.",
            "Thornlie", "6108", "@goldenglowbeauty",
            new Svc[] {
                new("Full Face Threading", "eyebrow-threading", 25, 35, null, 20),
                new("Eyebrow Shape & Tint", "eyebrow-threading", 25, 35, null, 20),
                new("Brazilian Wax", "waxing", 40, 55, null, 25),
                new("Basic Facial", "facial", 50, 65, null, 30),
                new("Lash Tint", "lash-tinting", 20, 25, null, 15),
                new("Brow & Lash Tint Combo", "lash-tinting", 30, 40, null, 20),
            },
            new Rev[] {
                new(5, "Best prices in Perth!", "Amazing quality at unbeatable prices. Threading is so precise."),
                new(4, "Great value", "Affordable beauty services without cutting corners."),
                new(5, "Quick and professional", "In and out in 15 minutes with perfect brows."),
            });

        await AddProvider("Barefoot Beauty Co",
            "Eco-conscious beauty studio in Fremantle. Organic facials, natural waxing, and clean beauty products. Vegan and cruelty-free.",
            "South Fremantle", "6162", "@barefootbeautyco",
            new Svc[] {
                new("Organic Facial", "facial", 90, 120, null, 60),
                new("Sugar Waxing (Brazilian)", "waxing", 55, 70, null, 30),
                new("Organic Spray Tan", "spray-tan", 40, 55, null, 20),
                new("Natural Glow Facial", "facial", 70, 90, null, 40),
                new("Full Body Sugar Wax", "waxing", 130, 170, null, 75),
            },
            new Rev[] {
                new(5, "Love the eco approach!", "A salon that uses organic, cruelty-free products. Great for sensitive skin."),
                new(5, "Sugar waxing convert", "So much gentler than regular wax. Will never go back."),
                new(4, "Beautiful organic facial", "My skin felt amazing. Love their product range too."),
            });

        await AddProvider("The Nail Society",
            "Social nail studio in Balcatta. Nail art, gel extensions, and nail parties. BYO wine and snacks for evening appointments!",
            "Balcatta", "6021", "@thenailsociety_",
            new Svc[] {
                new("Gel X Extensions", "gel-nails", 70, 90, null, 60),
                new("Hard Gel Extensions", "acrylic-nails", 80, 100, null, 75),
                new("SNS Dip Powder", "sns-nails", 55, 70, null, 50),
                new("Nail Art Set", "nail-art", 75, 120, "full set with designs", 90),
                new("Nail Party (4+ guests)", "gel-nails", 50, 65, "per person, BYO", 50),
            },
            new Rev[] {
                new(5, "Nail party was so fun!", "Had my birthday nail party here. All my friends loved it!"),
                new(5, "Gel X queen", "Best Gel X extensions. Last 3+ weeks easily."),
                new(4, "Love the BYO vibe", "Wine and nails — what more could you want?"),
            });

        await AddProvider("Beauty Base Cannington",
            "Modern beauty salon offering a full range of services. Lash extensions, brows, nails, and facials in a stylish setting.",
            "Cannington", "6107", "@beautybasecannington",
            new Svc[] {
                new("Classic Lash Extensions", "lash-extensions", 100, 130, null, 80),
                new("Hybrid Lash Set", "lash-extensions", 140, 170, null, 100),
                new("Gel Manicure", "gel-nails", 45, 60, null, 40),
                new("Brow Lamination & Tint", "brow-lamination", 50, 65, null, 35),
                new("Deep Cleansing Facial", "facial", 70, 95, null, 45),
            },
            new Rev[] {
                new(5, "New favourite salon!", "Everything is done so well here. Lashes and nails in one visit."),
                new(4, "Stylish and professional", "Love the modern decor. Consistent and well-priced."),
                new(5, "Great for busy people", "Book all your beauty services at once. Efficient!"),
            });

        await AddProvider("Coco & Rose Beauty",
            "Intimate beauty studio in Inglewood. Specialising in bridal makeup, lash extensions, and event styling. By appointment only.",
            "Inglewood", "6052", "@cocoandrosebeauty",
            new Svc[] {
                new("Bridal Makeup (Trial)", "bridal-makeup", 130, 160, null, 90),
                new("Bridal Makeup (Day-Of)", "bridal-makeup", 200, 250, null, 75),
                new("Event Makeup", "makeup-artist", 100, 140, null, 60),
                new("Classic Lash Extensions", "lash-extensions", 120, 150, null, 90),
                new("Bridal Package (makeup + lashes)", "bridal-makeup", 280, 350, null, 150),
            },
            new Rev[] {
                new(5, "Dream bridal makeup!", "Made me feel beautiful. Photos turned out incredible."),
                new(5, "Event makeup perfection", "Flawless makeup that lasted all night."),
                new(5, "Bridal package is a must", "Makeup and lash extensions. Looked amazing."),
            });

        await AddProvider("The Wellness Collective",
            "Holistic wellness centre in Mundaring. Massage, float therapy, and natural healing treatments surrounded by Perth Hills bushland.",
            "Mundaring", "6073", "@thewellnesscollective",
            new Svc[] {
                new("Relaxation Massage (60min)", "massage", 85, 100, null, 60),
                new("Float Therapy (60min)", "float-therapy", 70, 90, null, 60),
                new("Reflexology (45min)", "reflexology", 55, 70, null, 45),
                new("Bush Therapy Walk + Massage", "aromatherapy", 120, 160, null, 120),
                new("Full Wellness Day", "day-spa", 250, 320, "float + massage + reflexology", 180),
            },
            new Rev[] {
                new(5, "Magical setting", "Massage surrounded by bushland is incredible. Transformative."),
                new(4, "Worth the drive", "Peaceful setting makes it so worthwhile."),
                new(5, "True holistic wellness", "The bush therapy walk + massage is unlike anything else."),
            });

        await AddProvider("Pristine Skin Studio",
            "Results-driven skin treatments in Currambine. Cosmelan, laser genesis, and clinical-grade facials. Free skin assessments.",
            "Currambine", "6028", "@pristineskinstudio",
            new Svc[] {
                new("Skin Assessment", "skin-clinic", 0, null, "free", 30),
                new("Clinical Facial", "facial", 110, 140, null, 60),
                new("Laser Genesis", "skin-clinic", 200, 280, null, 30),
                new("Jessner Peel", "chemical-peel", 130, 170, null, 40),
                new("LED Light Therapy", "led-therapy", 45, 60, null, 25),
            },
            new Rev[] {
                new(5, "Skin is glowing!", "Laser genesis made a difference. My pores are smaller."),
                new(4, "Thorough approach", "Loved the free skin assessment. Very detailed."),
                new(5, "Finally clear skin", "Their treatment plan has finally got my skin clear."),
            });

        await AddProvider("Velvet Touch Waxing",
            "Specialist waxing studio in Bentley. Male and female waxing. Using premium strip and hard wax for the most comfortable experience.",
            "Bentley", "6102", "@velvettouchwaxing",
            new Svc[] {
                new("Brazilian Wax (Women)", "waxing", 45, 60, null, 25),
                new("Brazilian Wax (Men)", "waxing", 55, 75, null, 30),
                new("Full Leg Wax", "waxing", 40, 55, null, 25),
                new("Back Wax (Men)", "waxing", 40, 55, null, 25),
                new("Brow Wax & Shape", "eyebrow-waxing", 18, 25, null, 10),
                new("Full Body Wax", "waxing", 100, 140, null, 60),
            },
            new Rev[] {
                new(5, "Least painful Brazilian!", "They use such good wax. Quick and virtually painless."),
                new(4, "Great for men too", "A place that caters to male waxing professionally."),
                new(5, "My regular waxer", "Been coming for 2 years. Always fast and professional."),
            });

        await AddProvider("Indigo Hair Collective",
            "Creative hair colour specialists. Vivids, pastels, colour corrections, and precision cuts. Vegan colour available.",
            "Mount Lawley", "6050", "@indigohaircollective",
            new Svc[] {
                new("Vivid/Fashion Colour", "hair-colouring", 200, 400, "varies by complexity", 180),
                new("Pastel Colour", "hair-colouring", 250, 380, null, 150),
                new("Colour Correction", "hair-colouring", 300, 500, "consult required", 240),
                new("Precision Cut", "hair-salon", 70, 100, null, 60),
                new("Lived-In Balayage", "balayage", 250, 350, null, 180),
            },
            new Rev[] {
                new(5, "Rainbow hair dreams!", "My pink and purple vivid colour is exactly what I wanted."),
                new(5, "Colour correction wizards", "Fixed a disaster from another salon. Patient and skilled."),
                new(4, "Creative colour experts", "The pastel lavender is beautiful. Faded gracefully too."),
                new(5, "Finally found my colourist", "Nobody else touches my hair. True artists."),
            });

        await AddProvider("Glam Squad Perth",
            "Mobile makeup and hair styling team for weddings, formals, and events across Perth. Team of 5 experienced artists.",
            "Perth CBD", "6000", "@glamsquadperth",
            new Svc[] {
                new("Formal/Event Makeup", "makeup-artist", 90, 130, null, 50),
                new("Formal Hair Styling", "hair-salon", 80, 120, null, 50),
                new("Bridal Makeup", "bridal-makeup", 180, 250, null, 75),
                new("Bridal Hair Styling", "hair-salon", 150, 200, null, 60),
                new("Makeup + Hair Combo", "makeup-artist", 150, 220, null, 90),
                new("Bridal Party (per person)", "bridal-makeup", 120, 160, "per person", 60),
            },
            new Rev[] {
                new(5, "Made prom night special", "My daughter looked stunning. Professional and punctual."),
                new(5, "Wedding day heroes", "Entire bridal party done beautifully and on schedule."),
                new(5, "Event glam", "Hired the team for a gala. Everyone looked amazing."),
            });

        await AddProvider("Karma Beauty Lounge",
            "Laid-back beauty lounge in Maylands. Nails, brows, lashes, and spray tans. Good vibes, great music, beautiful results.",
            "Maylands", "6051", "@karmabeautylounge",
            new Svc[] {
                new("Gel Manicure", "gel-nails", 45, 60, null, 40),
                new("BIAB Nails", "gel-nails", 65, 80, null, 55),
                new("Brow Lamination & Tint", "brow-lamination", 50, 65, null, 35),
                new("Lash Lift & Tint", "lash-lift", 65, 80, null, 40),
                new("Spray Tan", "spray-tan", 35, 45, null, 15),
            },
            new Rev[] {
                new(5, "Best vibes in Perth", "Love the atmosphere. Great music, lovely staff, perfect nails."),
                new(4, "Chill and professional", "Very relaxed but the work is top-notch. My regular spot."),
                new(5, "BIAB convert!", "Builder gel nails look so natural and strong."),
            });

        await AddProvider("Pure Skin Aesthetics",
            "Medical-grade aesthetics clinic in Subiaco. Injectable treatments, laser skin rejuvenation, and advanced facials by registered nurses.",
            "Subiaco", "6008", "@pureskinaesthetics",
            new Svc[] {
                new("Lip Enhancement (1ml)", "lip-filler", 380, 480, "per ml", 45),
                new("Anti-Wrinkle Treatment", "botox", 250, 550, "per area", 30),
                new("Dermal Filler (cheek/chin)", "dermal-filler", 550, 750, "per ml", 45),
                new("Skin Booster Treatment", "skin-clinic", 300, 450, null, 45),
                new("Laser Skin Rejuvenation", "skin-clinic", 200, 350, "per session", 30),
            },
            new Rev[] {
                new(5, "Best injector in Perth", "So skilled. My lips look perfect — enhanced but natural."),
                new(5, "Trustworthy clinic", "Love that it's nurse-led. Feel very safe."),
                new(4, "Great anti-wrinkle results", "Lines gone but I can still move my face. Perfect balance."),
                new(5, "Skin boosters are amazing", "My skin has an incredible glow. Game changer."),
            });

        await AddProvider("Nail Hype Studio",
            "Trendsetting nail studio in Fremantle. Known for avant-garde nail art, 3D designs, and custom press-on nails.",
            "Fremantle", "6160", "@nailhypestudio",
            new Svc[] {
                new("Editorial Nail Art Set", "nail-art", 100, 180, null, 90),
                new("3D Nail Art", "nail-art", 120, 200, null, 120),
                new("Custom Press-On Set", "nail-art", 80, 140, "custom designs", 0),
                new("Gel Extension + Art", "gel-nails", 90, 150, null, 75),
                new("Acrylic Sculpted Set", "acrylic-nails", 85, 120, null, 70),
            },
            new Rev[] {
                new(5, "Art on my nails!", "The 3D designs are mind-blowing. True wearable art."),
                new(5, "Vogue-worthy nails", "The creativity is unmatched."),
                new(5, "Custom press-ons!", "Perfect for special events. Salon-grade quality."),
                new(4, "Worth the splurge", "Not cheap but you're paying for real artistry."),
            });

        await AddProvider("Hair by Hannah",
            "Freelance hairstylist in Wanneroo. Specialising in balayage, blonde specialist, and textured cuts. Salon suite experience.",
            "Wanneroo", "6065", "@hairbyhannah_perth",
            new Svc[] {
                new("Balayage & Toner", "balayage", 230, 330, null, 150),
                new("Full Blonde", "hair-colouring", 200, 300, null, 120),
                new("Root Touch-Up & Toner", "hair-colouring", 100, 150, null, 60),
                new("Textured Cut & Style", "hair-salon", 70, 90, null, 60),
                new("Olaplex Bonding Treatment", "hair-salon", 40, 60, "add-on", 20),
            },
            new Rev[] {
                new(5, "Blonde specialist!", "Hannah is the queen of blondes. Healthy AND bright."),
                new(5, "Best balayage", "Natural, dimensional, and beautiful. Exactly what I wanted."),
                new(4, "Love the private suite", "Great personalised experience. No rush."),
            });

        await AddProvider("Aura Beauty Studio",
            "Premium multi-service beauty studio in Gosnells. Expert aestheticians offering facials, peels, IPL, and dermal treatments.",
            "Gosnells", "6110", "@aurabeautystudio_",
            new Svc[] {
                new("Signature Glow Facial", "facial", 95, 120, null, 50),
                new("Lactic Acid Peel", "chemical-peel", 100, 130, null, 35),
                new("IPL Skin Rejuvenation", "skin-clinic", 150, 250, "per area", 30),
                new("LED Light Therapy", "led-therapy", 45, 60, null, 25),
                new("Vitamin Infusion Facial", "facial", 120, 160, null, 60),
            },
            new Rev[] {
                new(5, "Skin goals achieved!", "The vitamin infusion facial is incredible. Instant glow."),
                new(4, "Great local clinic", "Happy to have a quality skin clinic in Gosnells."),
                new(5, "IPL worked wonders", "Redness and broken capillaries almost gone after 4 sessions."),
            });

        await AddProvider("Sunset Nails Hillarys",
            "Beachside nail salon in Hillarys Boat Harbour. Gel, acrylics, and pedicures with a view. Perfect for a seaside pamper session.",
            "Hillarys", "6025", "@sunsetnailshillarys",
            new Svc[] {
                new("Gel Manicure", "gel-nails", 45, 60, null, 40),
                new("Acrylic Full Set", "acrylic-nails", 70, 90, null, 65),
                new("Coastal Spa Pedicure", "pedicure", 60, 80, null, 50),
                new("Gel Pedicure", "gel-nails", 55, 70, null, 45),
                new("Mani + Pedi Combo", "gel-nails", 85, 110, null, 75),
            },
            new Rev[] {
                new(5, "Nails with a view!", "Getting a pedicure overlooking the ocean is unbeatable."),
                new(4, "Great location", "Perfect stop after lunch at the harbour."),
                new(5, "My favourite nail spot", "The coastal pedicure is heavenly. Highly recommend!"),
            });

        await AddProvider("Lux Beauty Bar Joondalup",
            "Walk-in beauty bar in Joondalup. Quick services: brow bar, express nails, lash tinting, and threading.",
            "Joondalup", "6027", "@luxbeautybarjnp",
            new Svc[] {
                new("Express Brow Thread & Tint", "eyebrow-threading", 25, 35, null, 15),
                new("Express Gel Nails", "gel-nails", 35, 50, null, 30),
                new("Lash Tint", "lash-tinting", 20, 25, null, 15),
                new("Brow Tint Only", "brow-tinting", 15, 20, null, 10),
                new("Full Face Threading", "eyebrow-threading", 30, 40, null, 20),
            },
            new Rev[] {
                new(5, "Perfect while shopping!", "Quick brow tidy between shops. Always great."),
                new(4, "Convenient location", "Right in the shopping centre. Good prices."),
                new(5, "Fast and precise", "Threading done in minutes. Very accurate."),
            });

        // Update category provider counts
        foreach (var cat in subs)
        {
            cat.ProviderCount = await context.ProviderServices
                .Where(ps => ps.CategoryId == cat.Id && ps.Provider.Status == ProviderStatus.Approved)
                .Select(ps => ps.ProviderId).Distinct().CountAsync();
        }
        foreach (var cat in parents)
        {
            var childIds = subs.Where(c => c.ParentCategoryId == cat.Id).Select(c => c.Id).ToList();
            cat.ProviderCount = await context.ProviderServices
                .Where(ps => childIds.Contains(ps.CategoryId) && ps.Provider.Status == ProviderStatus.Approved)
                .Select(ps => ps.ProviderId).Distinct().CountAsync();
        }
        await context.SaveChangesAsync();
    }
}
