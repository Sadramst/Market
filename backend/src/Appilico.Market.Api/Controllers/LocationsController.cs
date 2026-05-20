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

        var suburbs = await query.OrderBy(s => s.Name).Take(50).ToListAsync();

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
}
