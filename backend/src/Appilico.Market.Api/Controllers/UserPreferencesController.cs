using Appilico.Market.Domain.Users;
using Appilico.Market.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserPreferencesController : ControllerBase
{
    private readonly AppDbContext _context;
    public UserPreferencesController(AppDbContext context) => _context = context;

    /// <summary>GET /api/userpreferences — returns the authenticated user's preferences.</summary>
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var pref = await _context.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);
        if (pref == null)
            return Ok(new { success = true, data = (object?)null });

        return Ok(new { success = true, data = MapPref(pref) });
    }

    /// <summary>PUT /api/userpreferences — upsert the authenticated user's preferences.</summary>
    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Upsert([FromBody] UpsertPreferenceRequest req)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var pref = await _context.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);
        if (pref == null)
        {
            pref = new UserPreference { UserId = userId };
            _context.UserPreferences.Add(pref);
        }

        if (req.PreferredSuburbSlug != null) pref.PreferredSuburbSlug = req.PreferredSuburbSlug;
        if (req.PreferredSuburbName != null) pref.PreferredSuburbName = req.PreferredSuburbName;
        if (req.PreferredPostCode != null) pref.PreferredPostCode = req.PreferredPostCode;
        if (req.UserLatitude.HasValue) pref.UserLatitude = req.UserLatitude;
        if (req.UserLongitude.HasValue) pref.UserLongitude = req.UserLongitude;
        if (req.FavouriteCategories != null) pref.FavouriteCategories = req.FavouriteCategories;
        if (req.LastMarketplaceType.HasValue) pref.LastMarketplaceType = req.LastMarketplaceType;
        pref.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { success = true, data = MapPref(pref) });
    }

    private static object MapPref(UserPreference p) => new
    {
        p.PreferredSuburbSlug,
        p.PreferredSuburbName,
        p.PreferredPostCode,
        p.UserLatitude,
        p.UserLongitude,
        p.FavouriteCategories,
        p.LastMarketplaceType,
        p.UpdatedAt
    };
}

public record UpsertPreferenceRequest(
    string? PreferredSuburbSlug,
    string? PreferredSuburbName,
    string? PreferredPostCode,
    double? UserLatitude,
    double? UserLongitude,
    string? FavouriteCategories,
    int? LastMarketplaceType);
