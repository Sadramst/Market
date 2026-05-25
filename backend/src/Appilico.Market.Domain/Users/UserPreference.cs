namespace Appilico.Market.Domain.Users;

/// <summary>
/// Stores a user's persistent location and marketplace preferences.
/// One row per user. Upserted on each update.
/// </summary>
public class UserPreference
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } = string.Empty;

    // Preferred location (set by geolocation or manual suburb selection)
    public string? PreferredSuburbSlug { get; set; }
    public string? PreferredSuburbName { get; set; }
    public string? PreferredPostCode { get; set; }
    public double? UserLatitude { get; set; }
    public double? UserLongitude { get; set; }

    // Preferred categories (comma-separated slugs, ordered by recency)
    public string? FavouriteCategories { get; set; }

    // Last seen marketplace (0=Beauty, 1=IT)
    public int? LastMarketplaceType { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Auth.AppUser? User { get; set; }
}
