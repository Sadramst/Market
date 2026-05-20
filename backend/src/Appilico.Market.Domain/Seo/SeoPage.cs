using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Seo;

public class SeoPage : BaseEntity
{
    public string PageType { get; set; } = string.Empty; // "suburb", "category", "suburb-category"
    public string Slug { get; set; } = string.Empty; // URL path slug
    public string Title { get; set; } = string.Empty;
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string? H1 { get; set; }
    public string? Content { get; set; } // SEO body content
    public string? SchemaJson { get; set; } // schema.org JSON-LD
    public ProviderType MarketplaceType { get; set; }
    public bool IsPublished { get; set; } = true;
    public int ProviderCount { get; set; } // Denormalized

    // Foreign keys (nullable — not all pages have both)
    public Guid? SuburbId { get; set; }
    public Guid? CategoryId { get; set; }

    // Navigation
    public Locations.Suburb? Suburb { get; set; }
    public Categories.Category? Category { get; set; }

    // TODO: AI-generated SEO content
    // TODO: A/B testing for titles/descriptions
    // TODO: Performance tracking (impressions, clicks)
    // TODO: Auto-update provider counts on schedule
}
