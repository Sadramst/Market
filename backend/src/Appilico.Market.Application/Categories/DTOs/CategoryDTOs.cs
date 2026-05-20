using Appilico.Market.Domain;

namespace Appilico.Market.Application.Categories.DTOs;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? IconName { get; set; }
    public ProviderType MarketplaceType { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public int SortOrder { get; set; }
    public int ProviderCount { get; set; }
    public List<CategoryDto> SubCategories { get; set; } = [];
}
