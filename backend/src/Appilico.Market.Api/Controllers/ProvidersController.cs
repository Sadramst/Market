using System.Security.Claims;
using Appilico.Market.Application.Providers.DTOs;
using Appilico.Market.Application.Providers.Services;
using Appilico.Market.Domain.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProvidersController : ControllerBase
{
    private readonly IProviderService _providerService;

    public ProvidersController(IProviderService providerService) => _providerService = providerService;

    // --- Public ---

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] ProviderSearchRequest request)
    {
        var result = await _providerService.SearchAsync(request);
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> Featured([FromQuery] int limit = 6, [FromQuery] int? providerType = null)
    {
        var request = new ProviderSearchRequest
        {
            IsFeatured = true,
            PageSize = limit,
            SortBy = "rating",
            SortDescending = true
        };
        if (providerType.HasValue)
            request.MarketplaceType = (Appilico.Market.Domain.ProviderType)providerType.Value;
        var result = await _providerService.SearchAsync(request);
        return Ok(result);
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
    public async Task<IActionResult> AdminList([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? status = null)
    {
        var result = await _providerService.AdminListAsync(page, pageSize, status);
        return Ok(result);
    }

    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
    [HttpPut("admin/{id:guid}/status")]
    public async Task<IActionResult> AdminUpdateStatus(Guid id, [FromBody] AdminProviderActionRequest request)
    {
        var result = await _providerService.AdminUpdateStatusAsync(id, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
