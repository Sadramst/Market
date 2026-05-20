using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Categories;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? IconName { get; set; } // Lucide icon name
    public Guid? ParentCategoryId { get; set; }
    public ProviderType MarketplaceType { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public int ProviderCount { get; set; } // Denormalized for performance

    // Navigation
    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = [];
    public ICollection<ProviderService> ProviderServices { get; set; } = [];

    // TODO: AI-generated category descriptions
    // TODO: Category trending/popularity scoring
    // TODO: Category-specific SEO content
}
