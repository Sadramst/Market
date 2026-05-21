using Appilico.Market.Application.Providers.Importing;
using Appilico.Market.Domain.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/provider-imports")]
[Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
public class ProviderImportsController : ControllerBase
{
    private readonly IProviderImportService _providerImportService;

    public ProviderImportsController(IProviderImportService providerImportService) => _providerImportService = providerImportService;

    [HttpPost("preview")]
    public async Task<IActionResult> Preview([FromBody] ProviderImportCsvRequest request)
    {
        var result = await _providerImportService.PreviewAsync(request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("run")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<IActionResult> Run([FromBody] ProviderImportCsvRequest request)
    {
        var result = await _providerImportService.ImportAsync(request);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
