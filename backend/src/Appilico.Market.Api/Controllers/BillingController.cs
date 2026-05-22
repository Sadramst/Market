using System.Security.Claims;
using Appilico.Market.Application.Subscriptions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BillingController : ControllerBase
{
    private readonly IProviderSubscriptionService _subscriptionService;
    private readonly IConfiguration _configuration;

    public BillingController(IProviderSubscriptionService subscriptionService, IConfiguration configuration)
    {
        _subscriptionService = subscriptionService;
        _configuration = configuration;
    }

    [Authorize]
    [HttpGet("providers/{providerId:guid}/subscription")]
    public async Task<IActionResult> GetProviderSubscription(Guid providerId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _subscriptionService.GetByProviderAsync(providerId, userId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("stripe/subscription")]
    public async Task<IActionResult> UpsertStripeSubscription([FromBody] UpsertProviderSubscriptionRequest request)
    {
        var configuredSecret = _configuration["Billing:WebhookSecret"];
        var suppliedSecret = Request.Headers["X-Appilico-Webhook-Secret"].FirstOrDefault();
        if (string.IsNullOrWhiteSpace(configuredSecret))
            return StatusCode(503, "Billing webhook secret is not configured.");
        if (!string.Equals(configuredSecret, suppliedSecret, StringComparison.Ordinal))
            return Unauthorized();

        var result = await _subscriptionService.UpsertFromStripeAsync(request);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}