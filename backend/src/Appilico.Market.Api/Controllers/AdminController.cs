using Appilico.Market.Application.Admin.Services;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Moderator}")]
public class AdminController : ControllerBase
{
    private readonly IAdminDashboardService _dashboardService;
    private readonly AppDbContext _context;

    public AdminController(IAdminDashboardService dashboardService, AppDbContext context)
    {
        _dashboardService = dashboardService;
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var result = await _dashboardService.GetStatsAsync();
        return Ok(result);
    }

    /// <summary>Platform-wide analytics summary for the admin dashboard.</summary>
    [HttpGet("analytics/summary")]
    public async Task<IActionResult> GetAnalyticsSummary(
        [FromQuery] string period = "7d",
        [FromQuery] int? marketplaceType = null)
    {
        var startDate = PeriodToDate(period);

        var events = _context.UserBehaviorEvents
            .Where(e => e.OccurredAt >= startDate);

        if (marketplaceType.HasValue)
            events = events.Where(e => e.MarketplaceType == marketplaceType.Value);

        var totalPageViews = await events.CountAsync(e => e.EventType == "view_provider");
        var totalSearches = await events.CountAsync(e => e.EventType == "search");
        var totalEnquiries = await events.CountAsync(e => e.EventType == "enquiry");
        var totalWebsiteClicks = await events.CountAsync(e => e.EventType == "click_website");
        var totalContactClicks = await events.CountAsync(e => e.EventType == "click_contact");

        var dailyViews = await events
            .Where(e => e.EventType == "view_provider")
            .GroupBy(e => e.OccurredAt.Date)
            .Select(g => new { date = g.Key, count = g.Count() })
            .OrderBy(x => x.date)
            .ToListAsync();

        var topCategories = await events
            .Where(e => (e.EventType == "view_category" || e.EventType == "view_provider") && e.CategorySlug != null)
            .GroupBy(e => e.CategorySlug!)
            .Select(g => new { category = g.Key, views = g.Count() })
            .OrderByDescending(x => x.views)
            .Take(10)
            .ToListAsync();

        var topSuburbs = await events
            .Where(e => (e.EventType == "view_suburb" || e.EventType == "view_provider") && e.SuburbSlug != null)
            .GroupBy(e => e.SuburbSlug!)
            .Select(g => new { suburb = g.Key, views = g.Count() })
            .OrderByDescending(x => x.views)
            .Take(10)
            .ToListAsync();

        var referrers = await events
            .Where(e => e.ReferrerPage != null)
            .GroupBy(e => e.ReferrerPage!.Contains("google") ? "google"
                        : e.ReferrerPage.Contains("instagram") ? "instagram"
                        : e.ReferrerPage.Contains("facebook") ? "facebook"
                        : e.ReferrerPage.Contains("appilico") ? "internal"
                        : "direct")
            .Select(g => new { source = g.Key, count = g.Count() })
            .OrderByDescending(x => x.count)
            .ToListAsync();

        return Ok(new
        {
            totalPageViews,
            totalSearches,
            totalEnquiries,
            totalWebsiteClicks,
            totalContactClicks,
            dailyViews,
            topCategories,
            topSuburbs,
            referrers,
        });
    }

    /// <summary>Per-provider analytics (views, clicks, enquiries).</summary>
    [HttpGet("analytics/provider/{providerId:guid}")]
    public async Task<IActionResult> GetProviderAnalytics(Guid providerId, [FromQuery] string period = "30d")
    {
        var startDate = PeriodToDate(period);
        var days = (DateTime.UtcNow - startDate).Days;
        var prevStart = startDate.AddDays(-days);

        var events = _context.UserBehaviorEvents
            .Where(e => e.EntitySlug != null && e.OccurredAt >= startDate);

        // Get provider slug
        var provider = await _context.Providers.FindAsync(providerId);
        if (provider == null) return NotFound();

        var providerEvents = events.Where(e => e.EntitySlug == provider.Slug);
        var prevEvents = _context.UserBehaviorEvents
            .Where(e => e.EntitySlug == provider.Slug && e.OccurredAt >= prevStart && e.OccurredAt < startDate);

        var currViews = await providerEvents.CountAsync(e => e.EventType == "view_provider");
        var prevViews = await prevEvents.CountAsync(e => e.EventType == "view_provider");

        var dailyViews = await providerEvents
            .Where(e => e.EventType == "view_provider")
            .GroupBy(e => e.OccurredAt.Date)
            .Select(g => new { date = g.Key, count = g.Count() })
            .OrderBy(x => x.date)
            .ToListAsync();

        var sources = await providerEvents
            .Where(e => e.EventType == "view_provider" && e.ReferrerPage != null)
            .GroupBy(e => e.ReferrerPage!.Contains("google") ? "google"
                        : e.ReferrerPage.Contains("instagram") ? "instagram"
                        : e.ReferrerPage.Contains("facebook") ? "facebook"
                        : e.ReferrerPage.Contains("appilico") ? "internal"
                        : "direct")
            .Select(g => new { source = g.Key, count = g.Count() })
            .OrderByDescending(x => x.count)
            .ToListAsync();

        return Ok(new
        {
            profileViews = currViews,
            viewsTrend = prevViews > 0 ? Math.Round((double)(currViews - prevViews) / prevViews * 100, 1) : 0,
            contactClicks = await providerEvents.CountAsync(e => e.EventType == "click_contact"),
            websiteClicks = await providerEvents.CountAsync(e => e.EventType == "click_website"),
            enquiries = await providerEvents.CountAsync(e => e.EventType == "enquiry"),
            dailyViews,
            sources,
        });
    }

    /// <summary>Leaderboard of top-viewed providers.</summary>
    [HttpGet("analytics/top-providers")]
    public async Task<IActionResult> GetTopProviders([FromQuery] string period = "7d", [FromQuery] int limit = 20)
    {
        var startDate = PeriodToDate(period);

        var topSlugs = await _context.UserBehaviorEvents
            .Where(e => e.EventType == "view_provider" && e.EntitySlug != null && e.OccurredAt >= startDate)
            .GroupBy(e => e.EntitySlug!)
            .Select(g => new { slug = g.Key, views = g.Count() })
            .OrderByDescending(x => x.views)
            .Take(limit)
            .ToListAsync();

        var slugList = topSlugs.Select(t => t.slug).ToList();
        var providers = await _context.Providers
            .Where(p => slugList.Contains(p.Slug))
            .Select(p => new { p.Id, p.Slug, p.BusinessName, p.City })
            .ToListAsync();

        var result = topSlugs.Select(t =>
        {
            var p = providers.FirstOrDefault(x => x.Slug == t.slug);
            return new
            {
                providerId = p?.Id,
                businessName = p?.BusinessName ?? t.slug,
                suburb = p?.City ?? "",
                views = t.views,
            };
        });

        return Ok(result);
    }

    /// <summary>Export providers for outreach (CSV-ready JSON).</summary>
    [HttpGet("outreach/export")]
    public async Task<IActionResult> ExportOutreach([FromQuery] string? category = null, [FromQuery] string? suburb = null, [FromQuery] bool unclaimedOnly = true)
    {
        var query = _context.Providers
            .Where(p => p.Status == Domain.ProviderStatus.Approved);

        if (unclaimedOnly)
            query = query.Where(p => !p.IsClaimed);
        if (!string.IsNullOrWhiteSpace(suburb))
            query = query.Where(p => p.City != null && p.City.ToLower() == suburb.ToLower());

        var providers = await query
            .OrderBy(p => p.BusinessName)
            .Select(p => new
            {
                p.Id,
                p.BusinessName,
                p.Slug,
                p.City,
                p.PostalCode,
                p.Phone,
                p.Email,
                p.Website,
                p.InstagramUrl,
                p.FacebookUrl,
                isClaimed = p.IsClaimed,
                status = p.Status.ToString(),
                p.AverageRating,
                p.TotalReviews,
                dataSource = p.DataSource,
            })
            .ToListAsync();

        return Ok(new { total = providers.Count, providers });
    }

    private static DateTime PeriodToDate(string period) => period switch
    {
        "1d" => DateTime.UtcNow.AddDays(-1),
        "30d" => DateTime.UtcNow.AddDays(-30),
        "90d" => DateTime.UtcNow.AddDays(-90),
        _ => DateTime.UtcNow.AddDays(-7),
    };
}