using System.Text.Json;
using System.Text.RegularExpressions;
using Appilico.Market.Domain.Categories;

namespace Appilico.Market.Infrastructure.Data.Seed;

public static partial class DatabaseSeeder
{
    private class GooglePlaceDto
    {
        public string businessName { get; set; } = string.Empty;
        public string slug { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public double averageRating { get; set; }
        public int totalReviews { get; set; }
        public string? phoneNumber { get; set; }
        public string? website { get; set; }
        public string? address { get; set; }
        public string suburb { get; set; } = string.Empty;
        public string[] categories { get; set; } = Array.Empty<string>();
    }

    private static RealBiz[] GenerateBulkProviders()
    {
        var jsonPath = Path.Combine(AppContext.BaseDirectory, "Data", "Seed", "google_providers.json");
        if (!File.Exists(jsonPath))
        {
            return Array.Empty<RealBiz>();
        }

        var jsonStr = File.ReadAllText(jsonPath);
        var googlePlaces = JsonSerializer.Deserialize<List<GooglePlaceDto>>(jsonStr) ?? new List<GooglePlaceDto>();

        var businesses = new List<RealBiz>();
        var postcodeRegex = new Regex(@"WA\s+(\d{4})");

        foreach (var place in googlePlaces)
        {
            var postCode = string.Empty;
            if (!string.IsNullOrEmpty(place.address))
            {
                var match = postcodeRegex.Match(place.address);
                if (match.Success)
                {
                    postCode = match.Groups[1].Value;
                }
            }

            var categorySlug = place.categories.FirstOrDefault()?.ToLower() ?? "nails";
            
            // Map category exact to what's expected if needed, e.g. "brows" -> "brows", "lashes" -> "lashes", "skin" -> "skin-care", "nails" -> "nails"
            if (categorySlug == "skin") categorySlug = "skin-care";
            else if (categorySlug == "brows") categorySlug = "brows";
            else if (categorySlug == "lashes") categorySlug = "lashes";
            else categorySlug = "nails"; // default to nails

            businesses.Add(new RealBiz(
                Name: string.IsNullOrWhiteSpace(place.businessName) ? "Unknown Business" : place.businessName,
                Slug: place.slug,
                CategorySlug: categorySlug,
                Suburb: place.suburb,
                PostCode: postCode,
                Address: place.address,
                Phone: place.phoneNumber,
                Website: place.website,
                Instagram: null,
                Rating: place.averageRating,
                ReviewCount: place.totalReviews,
                Description: place.description,
                Services: new[] { "Consultation $50", "Signature Service $85" } // default placeholder
            ));
        }

        return businesses.ToArray();
    }
}
