using Appilico.Market.Application.Categories.DTOs;
using Appilico.Market.Domain;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Common;
using Appilico.Market.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Categories.Services;

public interface ICategoryService
{
    Task<ApiResponse<List<CategoryDto>>> GetByMarketplaceAsync(ProviderType type);
    Task<ApiResponse<CategoryDto>> GetBySlugAsync(string slug);
}

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context) => _context = context;

    public async Task<ApiResponse<List<CategoryDto>>> GetByMarketplaceAsync(ProviderType type)
    {
        var categories = await _context.Categories
            .Where(c => c.MarketplaceType == type && c.ParentCategoryId == null && c.IsActive)
            .Include(c => c.SubCategories.Where(sc => sc.IsActive))
            .OrderBy(c => c.SortOrder)
            .ToListAsync();

        var dtos = categories.Select(MapToDto).ToList();
        return ApiResponse<List<CategoryDto>>.Ok(dtos);
    }

    public async Task<ApiResponse<CategoryDto>> GetBySlugAsync(string slug)
    {
        var category = await _context.Categories
            .Include(c => c.SubCategories.Where(sc => sc.IsActive))
            .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive);

        if (category == null)
            return ApiResponse<CategoryDto>.Fail("Category not found");

        return ApiResponse<CategoryDto>.Ok(MapToDto(category));
    }

    private static CategoryDto MapToDto(Category c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Slug = c.Slug,
        IconName = c.IconName,
        MarketplaceType = c.MarketplaceType,
        ParentCategoryId = c.ParentCategoryId,
        SortOrder = c.SortOrder,
        ProviderCount = c.ProviderCount,
        SubCategories = c.SubCategories?.OrderBy(sc => sc.SortOrder).Select(MapToDto).ToList() ?? []
    };
}
