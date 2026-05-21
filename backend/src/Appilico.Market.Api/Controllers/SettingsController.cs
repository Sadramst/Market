using Appilico.Market.Application.Settings.Services;
using Appilico.Market.Domain.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
public class SettingsController : ControllerBase
{
    private readonly IAppSettingService _settings;

    public SettingsController(IAppSettingService settings) => _settings = settings;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _settings.GetAllAsync();
        return Ok(result);
    }

    [Authorize(Roles = UserRoles.SuperAdmin)]
    [HttpPut("{key}")]
    public async Task<IActionResult> Update(string key, [FromBody] UpdateAppSettingRequest request)
    {
        var result = await _settings.UpdateAsync(key, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}