using System.Security.Claims;
using Appilico.Market.Application.Social.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SocialController : ControllerBase
{
    private readonly ISocialService _socialService;

    public SocialController(ISocialService socialService) => _socialService = socialService;

    [HttpPost("follow/{providerId:guid}")]
    public async Task<IActionResult> Follow(Guid providerId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _socialService.FollowProviderAsync(userId, providerId);
        return Ok(result);
    }

    [HttpDelete("follow/{providerId:guid}")]
    public async Task<IActionResult> Unfollow(Guid providerId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _socialService.UnfollowProviderAsync(userId, providerId);
        return Ok(result);
    }

    [HttpPost("favorite/{providerId:guid}")]
    public async Task<IActionResult> Favorite(Guid providerId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _socialService.FavoriteProviderAsync(userId, providerId);
        return Ok(result);
    }

    [HttpDelete("favorite/{providerId:guid}")]
    public async Task<IActionResult> Unfavorite(Guid providerId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _socialService.UnfavoriteProviderAsync(userId, providerId);
        return Ok(result);
    }

    [HttpGet("follows")]
    public async Task<IActionResult> GetFollows()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _socialService.GetUserFollowsAsync(userId);
        return Ok(result);
    }

    [HttpGet("favorites")]
    public async Task<IActionResult> GetFavorites()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _socialService.GetUserFavoritesAsync(userId);
        return Ok(result);
    }
}
