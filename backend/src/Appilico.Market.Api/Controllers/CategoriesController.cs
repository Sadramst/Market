using Appilico.Market.Application.Categories.Services;
using Appilico.Market.Domain;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService) => _categoryService = categoryService;

    [HttpGet("beauty")]
    public async Task<IActionResult> GetBeautyCategories()
    {
        var result = await _categoryService.GetByMarketplaceAsync(ProviderType.Beauty);
        return Ok(result);
    }

    [HttpGet("it")]
    public async Task<IActionResult> GetITCategories()
    {
        var result = await _categoryService.GetByMarketplaceAsync(ProviderType.ITService);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _categoryService.GetBySlugAsync(slug);
        return result.Success ? Ok(result) : NotFound(result);
    }
}
