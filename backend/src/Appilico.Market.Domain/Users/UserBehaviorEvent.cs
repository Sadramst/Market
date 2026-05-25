namespace Appilico.Market.Domain.Users;

/// <summary>
/// Tracks anonymous and authenticated user behavior for ML-based personalisation.
/// Lightweight event log — one row per event.
/// </summary>
public class UserBehaviorEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Nullable for anonymous sessions (stored by sessionId)
    public string? UserId { get; set; }
    public string? SessionId { get; set; }

    // Event classification
    public string EventType { get; set; } = string.Empty; // "search","view_provider","view_category","click_contact","book","favourite","enquiry"
    public string? EntityType { get; set; }  // "provider","category","suburb"
    public string? EntitySlug { get; set; }  // slug of the thing seen/clicked
    public string? CategorySlug { get; set; }
    public string? SuburbSlug { get; set; }
    public int? MarketplaceType { get; set; } // 0=Beauty, 1=IT

    // Context
    public string? SearchQuery { get; set; }
    public string? ReferrerPage { get; set; }
    public string? UserAgent { get; set; }

    // Geolocation at time of event
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
}
