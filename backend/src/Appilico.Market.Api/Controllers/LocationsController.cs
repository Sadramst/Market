using Appilico.Market.Domain.Common;
using Appilico.Market.Domain.Locations;
using Appilico.Market.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public LocationsController(AppDbContext context) => _context = context;

    [HttpGet("suburbs")]
    public async Task<IActionResult> GetSuburbs([FromQuery] string? search, [FromQuery] string? state)
    {
        var query = _context.Suburbs.Where(s => s.IsActive).AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(s => s.Name.ToLower().Contains(search.ToLower()));

        if (!string.IsNullOrEmpty(state))
            query = query.Where(s => s.State == state);

        var suburbs = await query.OrderBy(s => s.Name).Take(500).ToListAsync();

        var dtos = suburbs.Select(s => new
        {
            s.Id,
            s.Name,
            s.Slug,
            s.State,
            s.PostCode,
            s.ProviderCount
        });

        return Ok(ApiResponse<object>.Ok(dtos));
    }

    [HttpGet("suburbs/{slug}")]
    public async Task<IActionResult> GetSuburbBySlug(string slug)
    {
        var suburb = await _context.Suburbs.FirstOrDefaultAsync(s => s.Slug == slug && s.IsActive);
        if (suburb == null)
            return NotFound(ApiResponse<object>.Fail("Suburb not found"));

        return Ok(ApiResponse<object>.Ok(new
        {
            suburb.Id,
            suburb.Name,
            suburb.Slug,
            suburb.State,
            suburb.PostCode,
            suburb.ProviderCount
        }));
    }

    /// <summary>
    /// Returns the closest Perth suburb to the given lat/lng coordinates.
    /// Used by the geolocation feature on the front-end.
    /// </summary>
    [HttpGet("suburbs/nearest")]
    public async Task<IActionResult> GetNearestSuburb([FromQuery] double lat, [FromQuery] double lng)
    {
        // Haversine approximation: degrees → km
        // We select only suburbs with known coordinates and find the closest.
        var suburbs = await _context.Suburbs
            .Where(s => s.IsActive && s.Latitude.HasValue && s.Longitude.HasValue)
            .ToListAsync();

        if (!suburbs.Any())
            return NotFound(ApiResponse<object>.Fail("No suburbs with coordinates found"));

        var nearest = suburbs
            .OrderBy(s => HaversineKm(lat, lng, s.Latitude ?? 0, s.Longitude ?? 0))
            .First();

        return Ok(ApiResponse<object>.Ok(new
        {
            nearest.Id,
            nearest.Name,
            nearest.Slug,
            nearest.State,
            nearest.PostCode,
            nearest.ProviderCount,
            DistanceKm = Math.Round(HaversineKm(lat, lng, nearest.Latitude ?? 0, nearest.Longitude ?? 0), 2)
        }));
    }

    private static double HaversineKm(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2)
              + Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180)
              * Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    }
}
