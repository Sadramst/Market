using Appilico.Market.Domain.Common;
using Appilico.Market.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Admin.Services;

public class AdminUserListItemDto
{
    public string Id { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; }
    public bool EmailConfirmed { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? ProviderId { get; set; }
    public List<string> Roles { get; set; } = [];
}

public interface IAdminUserService
{
    Task<ApiResponse<PaginatedResponse<AdminUserListItemDto>>> GetUsersAsync(int page, int pageSize, string? search, string? role, string? status);
}

public class AdminUserService : IAdminUserService
{
    private readonly AppDbContext _context;

    public AdminUserService(AppDbContext context) => _context = context;

    public async Task<ApiResponse<PaginatedResponse<AdminUserListItemDto>>> GetUsersAsync(int page, int pageSize, string? search, string? role, string? status)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Users
            .Where(u => !u.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(u =>
                u.Email!.ToLower().Contains(term) ||
                u.FirstName.ToLower().Contains(term) ||
                u.LastName.ToLower().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            if (status.Equals("active", StringComparison.OrdinalIgnoreCase))
                query = query.Where(u => u.IsActive);
            if (status.Equals("inactive", StringComparison.OrdinalIgnoreCase))
                query = query.Where(u => !u.IsActive);
        }

        if (!string.IsNullOrWhiteSpace(role))
        {
            var roleId = await _context.Roles
                .Where(r => r.Name == role)
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            if (!string.IsNullOrEmpty(roleId))
            {
                var userIds = await _context.UserRoles
                    .Where(ur => ur.RoleId == roleId)
                    .Select(ur => ur.UserId)
                    .ToListAsync();

                query = query.Where(u => userIds.Contains(u.Id));
            }
        }

        var totalCount = await query.CountAsync();
        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var userIdsOnPage = users.Select(u => u.Id).ToList();
        var rolesByUserId = await _context.UserRoles
            .Where(ur => userIdsOnPage.Contains(ur.UserId))
            .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => new { ur.UserId, RoleName = r.Name ?? string.Empty })
            .GroupBy(x => x.UserId)
            .ToDictionaryAsync(g => g.Key, g => g.Select(x => x.RoleName).Where(x => x != string.Empty).ToList());

        var providerIdsByUserId = await _context.Providers
            .Where(p => userIdsOnPage.Contains(p.UserId))
            .Select(p => new { p.UserId, p.Id })
            .ToDictionaryAsync(p => p.UserId, p => (Guid?)p.Id);

        var items = users.Select(u => new AdminUserListItemDto
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            FullName = $"{u.FirstName} {u.LastName}".Trim(),
            Email = u.Email ?? string.Empty,
            PhoneNumber = u.PhoneNumber,
            IsActive = u.IsActive,
            EmailConfirmed = u.EmailConfirmed,
            CreatedAt = u.CreatedAt,
            ProviderId = providerIdsByUserId.GetValueOrDefault(u.Id),
            Roles = rolesByUserId.GetValueOrDefault(u.Id) ?? []
        }).ToList();

        return ApiResponse<PaginatedResponse<AdminUserListItemDto>>.Ok(new PaginatedResponse<AdminUserListItemDto>
        {
            Items = items,
            Pagination = new PaginationMeta(page, pageSize, totalCount)
        });
    }
}