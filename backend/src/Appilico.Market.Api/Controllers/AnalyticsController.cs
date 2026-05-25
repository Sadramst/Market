using Appilico.Market.Domain.Users;
using Appilico.Market.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Appilico.Market.Api.Controllers;

/// <summary>
/// Lightweight event-tracking endpoint for user behaviour analytics / ML personalization.
/// Works for both authenticated and anonymous users (sessionId-based).
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _context;
    public AnalyticsController(AppDbContext context) => _context = context;

    /// <summary>POST /api/analytics/event — log a single user behaviour event.</summary>
    [HttpPost("event")]
    public async Task<IActionResult> TrackEvent([FromBody] TrackEventRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.EventType))
            return BadRequest(new { success = false, message = "EventType is required" });

        var userId = User.Identity?.IsAuthenticated == true
            ? User.FindFirstValue(ClaimTypes.NameIdentifier)
            : null;

        var ev = new UserBehaviorEvent
        {
            UserId = userId,
            SessionId = req.SessionId,
            EventType = req.EventType.ToLower().Trim(),
            EntityType = req.EntityType,
            EntitySlug = req.EntitySlug,
            CategorySlug = req.CategorySlug,
            SuburbSlug = req.SuburbSlug,
            MarketplaceType = req.MarketplaceType,
            SearchQuery = req.SearchQuery,
            ReferrerPage = req.ReferrerPage,
            UserAgent = Request.Headers.UserAgent.ToString()[..Math.Min(256, Request.Headers.UserAgent.ToString().Length)],
            Latitude = req.Latitude,
            Longitude = req.Longitude,
            OccurredAt = DateTime.UtcNow
        };

        _context.UserBehaviorEvents.Add(ev);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, data = new { ev.Id } });
    }

    /// <summary>POST /api/analytics/batch — log multiple events at once (e.g. on page unload).</summary>
    [HttpPost("batch")]
    public async Task<IActionResult> TrackBatch([FromBody] List<TrackEventRequest> events)
    {
        if (events == null || events.Count == 0)
            return BadRequest(new { success = false, message = "Events list is empty" });

        if (events.Count > 50)
            return BadRequest(new { success = false, message = "Max 50 events per batch" });

        var userId = User.Identity?.IsAuthenticated == true
            ? User.FindFirstValue(ClaimTypes.NameIdentifier)
            : null;

        var uaHeader = Request.Headers.UserAgent.ToString();
        var ua = uaHeader[..Math.Min(256, uaHeader.Length)];
        var now = DateTime.UtcNow;

        var entities = events
            .Where(r => !string.IsNullOrWhiteSpace(r.EventType))
            .Select(r => new UserBehaviorEvent
            {
                UserId = userId,
                SessionId = r.SessionId,
                EventType = r.EventType!.ToLower().Trim(),
                EntityType = r.EntityType,
                EntitySlug = r.EntitySlug,
                CategorySlug = r.CategorySlug,
                SuburbSlug = r.SuburbSlug,
                MarketplaceType = r.MarketplaceType,
                SearchQuery = r.SearchQuery,
                ReferrerPage = r.ReferrerPage,
                UserAgent = ua,
                Latitude = r.Latitude,
                Longitude = r.Longitude,
                OccurredAt = now
            }).ToList();

        _context.UserBehaviorEvents.AddRange(entities);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, data = new { Count = entities.Count } });
    }
}

public record TrackEventRequest(
    string? SessionId,
    string? EventType,
    string? EntityType,
    string? EntitySlug,
    string? CategorySlug,
    string? SuburbSlug,
    int? MarketplaceType,
    string? SearchQuery,
    string? ReferrerPage,
    double? Latitude,
    double? Longitude);
