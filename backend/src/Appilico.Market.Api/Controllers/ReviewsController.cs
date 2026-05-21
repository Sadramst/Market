using System.Security.Claims;
using Appilico.Market.Application.Reviews.Services;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService) => _reviewService = reviewService;

    [HttpGet("provider/{providerId:guid}")]
    public async Task<IActionResult> GetByProvider(Guid providerId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _reviewService.GetByProviderAsync(providerId, page, pageSize);
        return Ok(result);
    }

    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
    [HttpGet("admin/all")]
    public async Task<IActionResult> AdminGetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string? status = null)
    {
        var result = await _reviewService.GetAllAsync(page, pageSize, status);
        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _reviewService.CreateAsync(userId, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>Submit a public review (no auth required)</summary>
    [HttpPost("public")]
    public async Task<IActionResult> CreatePublic([FromBody] CreatePublicReviewRequest request)
    {
        var result = await _reviewService.CreatePublicAsync(request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize]
    [HttpPost("{id:guid}/reply")]
    public async Task<IActionResult> Reply(Guid id, [FromBody] string reply)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _reviewService.ReplyAsync(id, userId, reply);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
    [HttpPut("admin/{id:guid}/status")]
    public async Task<IActionResult> AdminUpdateStatus(Guid id, [FromBody] ReviewStatusUpdateRequest request)
    {
        var result = await _reviewService.AdminUpdateStatusAsync(id, request.Status);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}

public record ReviewStatusUpdateRequest(ReviewStatus Status);
