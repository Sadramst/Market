using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain;

public class ProviderService : BaseEntity
{
    public Guid ProviderId { get; set; }
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? PriceFrom { get; set; }
    public decimal? PriceTo { get; set; }
    public string? PriceNote { get; set; } // e.g., "from", "per hour", "varies"
    public int? DurationMinutes { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }

    // Navigation
    public Provider Provider { get; set; } = null!;
    public Categories.Category Category { get; set; } = null!;

    // TODO: Booking integration when booking module is built
    // TODO: AI-powered pricing recommendations
}
