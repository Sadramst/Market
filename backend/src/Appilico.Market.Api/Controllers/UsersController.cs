using Appilico.Market.Application.Admin.Services;
using Appilico.Market.Domain.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
public class UsersController : ControllerBase
{
    private readonly IAdminUserService _userService;

    public UsersController(IAdminUserService userService) => _userService = userService;

    [HttpGet]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? search = null,
        [FromQuery] string? role = null,
        [FromQuery] string? status = null)
    {
        var result = await _userService.GetUsersAsync(page, pageSize, search, role, status);
        return Ok(result);
    }
}