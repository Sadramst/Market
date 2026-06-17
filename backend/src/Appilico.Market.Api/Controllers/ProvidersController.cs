using System.Security.Claims;
using Appilico.Market.Application.Providers.DTOs;
using Appilico.Market.Application.Providers.Services;
using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProvidersController : ControllerBase
{
    private readonly IProviderService _providerService;
    private readonly AppDbContext _context;

    public ProvidersController(IProviderService providerService, AppDbContext context)
    {
        _providerService = providerService;
        _context = context;
    }

    // --- Public ---

    [HttpGet("stats")]
    public async Task<IActionResult> GetPublicStats()
    {
        var providerCount = await _context.Providers.CountAsync(p => p.Status == ProviderStatus.Approved && p.ProviderType == ProviderType.Beauty);
        var suburbCount = await _context.Suburbs.CountAsync(s => s.IsActive);
        var categoryCount = await _context.Categories.CountAsync(c => c.IsActive && c.ParentCategoryId == null && c.MarketplaceType == ProviderType.Beauty);
        return Ok(new { success = true, data = new { providerCount, suburbCount, categoryCount } });
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] ProviderSearchRequest request)
    {
        var result = await _providerService.SearchAsync(request);
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> Featured([FromQuery] int limit = 6, [FromQuery] int? providerType = null)
    {
        // Featured algorithm: rating >= 4.7 AND reviewCount >= 50, ordered by rating & reviewCount
        var marketplaceType = providerType.HasValue ? (ProviderType)providerType.Value : ProviderType.Beauty;
        var featured = await _context.Providers
            .Include(p => p.Services).ThenInclude(s => s.Category)
            .Include(p => p.GalleryImages)
            .Where(p =>
                p.Status == ProviderStatus.Approved &&
                p.ProviderType == marketplaceType &&
                p.AverageRating >= 4.7m &&
                p.TotalReviews >= 50 &&
                p.HasRealData == true &&
                !EF.Functions.ILike(p.BusinessName, "%chiropract%") &&
                !EF.Functions.ILike(p.BusinessName, "%physio%") &&
                !EF.Functions.ILike(p.BusinessName, "%osteopath%") &&
                !EF.Functions.ILike(p.BusinessName, "%massage chair%")
            )
            .OrderByDescending(p => p.AverageRating)
            .ThenByDescending(p => p.TotalReviews)
            .Take(limit)
            .ToListAsync();

        var items = featured.Select(p => new
        {
            p.Id,
            p.BusinessName,
            p.Slug,
            p.Description,
            p.LogoUrl,
            p.CoverImageUrl,
            p.IsVerified,
            p.AverageRating,
            p.TotalReviews,
            p.City,
            p.State,
            p.FullAddress,
            p.Phone,
            p.Email,
            p.Website,
            p.Tagline,
            p.HasRealData,
            Categories = p.Services?.Select(s => s.Category?.Name ?? "").Distinct().Where(n => n != "").ToList() ?? new List<string>(),
            PrimaryImageUrl = p.GalleryImages?.FirstOrDefault(g => g.IsPrimary)?.ImageUrl
                ?? p.GalleryImages?.FirstOrDefault()?.ImageUrl,
            p.CreatedAt
        }).ToList();

        return Ok(new { success = true, data = items });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _providerService.GetBySlugAsync(slug);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet("{slug}/related")]
    public async Task<IActionResult> GetRelated(string slug, [FromQuery] int count = 6)
    {
        var result = await _providerService.GetRelatedAsync(slug, Math.Min(count, 12));
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet("{slug}/nearby")]
    public async Task<IActionResult> GetNearby(string slug, [FromQuery] int count = 6)
    {
        var result = await _providerService.GetNearbyAsync(slug, Math.Min(count, 12));
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet("id/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _providerService.GetByIdAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    // --- Claim System ---

    [HttpPost("{slug}/claim")]
    public async Task<IActionResult> ClaimListing(string slug, [FromBody] ClaimListingRequest request)
    {
        var result = await _providerService.ClaimListingAsync(slug, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    // --- Provider Owner ---

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProviderRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _providerService.CreateAsync(userId, request);
        return result.Success ? CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result) : BadRequest(result);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProviderRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _providerService.UpdateAsync(id, userId, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _providerService.DeleteAsync(id, userId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    // --- Services ---

    [Authorize]
    [HttpPost("{id:guid}/services")]
    public async Task<IActionResult> AddService(Guid id, [FromBody] CreateProviderServiceRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _providerService.AddServiceAsync(id, userId, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}/services/{serviceId:guid}")]
    public async Task<IActionResult> RemoveService(Guid id, Guid serviceId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _providerService.RemoveServiceAsync(id, serviceId, userId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    // --- Gallery ---

    [Authorize]
    [HttpPost("{id:guid}/gallery")]
    public async Task<IActionResult> AddGalleryImage(Guid id, IFormFile file, [FromForm] string? altText, [FromForm] string? caption)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        using var stream = file.OpenReadStream();
        var result = await _providerService.AddGalleryImageAsync(id, userId, stream, file.FileName, file.ContentType, altText, caption);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}/gallery/{imageId:guid}")]
    public async Task<IActionResult> RemoveGalleryImage(Guid id, Guid imageId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _providerService.RemoveGalleryImageAsync(id, imageId, userId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    // --- Admin ---

    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
    [HttpGet("admin/list")]
    public async Task<IActionResult> AdminList([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? status = null, [FromQuery] int? marketplaceType = null)
    {
        var result = await _providerService.AdminListAsync(page, pageSize, status, marketplaceType);
        return Ok(result);
    }

    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
    [HttpPut("admin/{id:guid}/promote")]
    public async Task<IActionResult> AdminPromote(Guid id, [FromBody] AdminPromoteRequest request)
    {
        var result = await _providerService.AdminPromoteAsync(id, request.IsFeatured);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
    [HttpPut("admin/{id:guid}")]
    public async Task<IActionResult> AdminUpdate(Guid id, [FromBody] AdminUpdateProviderRequest request)
    {
        var result = await _providerService.AdminUpdateAsync(id, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
    [HttpPut("admin/{id:guid}/status")]
    public async Task<IActionResult> AdminUpdateStatus(Guid id, [FromBody] AdminProviderActionRequest request)
    {
        var result = await _providerService.AdminUpdateStatusAsync(id, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
