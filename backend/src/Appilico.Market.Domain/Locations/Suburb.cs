using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Locations;

public class Suburb : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty; // WA, VIC, NSW, etc.
    public string PostCode { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public int ProviderCount { get; set; } // Denormalized for performance
    public bool IsActive { get; set; } = true;

    // SEO
    public string? SeoDescription { get; set; }

    // Navigation
    public ICollection<ProviderServiceArea> ServiceAreas { get; set; } = [];
    public ICollection<Seo.SeoPage> SeoPages { get; set; } = [];

    // TODO: AI-generated suburb descriptions for SEO
    // TODO: Nearby suburbs linking for internal SEO
    // TODO: Population/demographics data for analytics
}
