using Appilico.Market.Application.Admin.Services;
using Appilico.Market.Domain.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
public class AdminController : ControllerBase
{
    private readonly IAdminDashboardService _dashboardService;

    public AdminController(IAdminDashboardService dashboardService) => _dashboardService = dashboardService;

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var result = await _dashboardService.GetStatsAsync();
        return Ok(result);
    }
}