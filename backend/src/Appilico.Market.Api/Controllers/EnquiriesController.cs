using System.Security.Claims;
using Appilico.Market.Application.Enquiries.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnquiriesController : ControllerBase
{
    private readonly IEnquiryService _enquiryService;

    public EnquiriesController(IEnquiryService enquiryService) => _enquiryService = enquiryService;

    /// <summary>Submit an enquiry to a provider (public, no auth required)</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEnquiryRequest request)
    {
        var result = await _enquiryService.CreateAsync(request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>Get enquiries for the current provider (auth required)</summary>
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetMyEnquiries([FromQuery] Guid providerId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _enquiryService.GetByProviderAsync(providerId, userId, page, pageSize);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>Mark an enquiry as read</summary>
    [Authorize]
    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _enquiryService.MarkAsReadAsync(id, userId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>Reply to an enquiry</summary>
    [Authorize]
    [HttpPost("{id:guid}/reply")]
    public async Task<IActionResult> Reply(Guid id, [FromBody] ReplyRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _enquiryService.ReplyAsync(id, userId, request.Message);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>Archive an enquiry</summary>
    [Authorize]
    [HttpPatch("{id:guid}/archive")]
    public async Task<IActionResult> Archive(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _enquiryService.ArchiveAsync(id, userId);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}

public record ReplyRequest(string Message);
