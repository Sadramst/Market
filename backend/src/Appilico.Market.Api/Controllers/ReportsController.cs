using System.Security.Claims;
using Appilico.Market.Application.Reports.Services;
using Appilico.Market.Domain.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService) => _reportService = reportService;

    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] string? status = null)
    {
        var result = await _reportService.GetAllAsync(page, pageSize, status);
        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReportRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _reportService.CreateAsync(userId, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] ResolveReportRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _reportService.UpdateStatusAsync(id, userId, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}