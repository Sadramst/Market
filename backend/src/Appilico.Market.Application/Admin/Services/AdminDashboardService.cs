using Appilico.Market.Domain;
using Appilico.Market.Domain.Common;
using Appilico.Market.Domain.Enquiries;
using Appilico.Market.Domain.Moderation;
using Appilico.Market.Domain.Reviews;
using Appilico.Market.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Admin.Services;

public class AdminDashboardStatsDto
{
    public int TotalProviders { get; set; }
    public int ApprovedProviders { get; set; }
    public int PendingProviders { get; set; }
    public int SuspendedProviders { get; set; }
    public int RejectedProviders { get; set; }
    public int BeautyProviders { get; set; }
    public int ItProviders { get; set; }
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int AdminUsers { get; set; }
    public int TotalReviews { get; set; }
    public int PendingReviews { get; set; }
    public int ApprovedReviews { get; set; }
    public int RejectedReviews { get; set; }
    public int TotalEnquiries { get; set; }
    public int NewEnquiries { get; set; }
    public int RepliedEnquiries { get; set; }
    public int TotalReports { get; set; }
    public int PendingReports { get; set; }
    public int Categories { get; set; }
    public int Suburbs { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public List<AdminActivityDto> RecentActivity { get; set; } = [];
}

public class AdminActivityDto
{
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Detail { get; set; }
    public string? Status { get; set; }
    public DateTime OccurredAt { get; set; }
}

public interface IAdminDashboardService
{
    Task<ApiResponse<AdminDashboardStatsDto>> GetStatsAsync();
}

public class AdminDashboardService : IAdminDashboardService
{
    private readonly AppDbContext _context;

    public AdminDashboardService(AppDbContext context) => _context = context;

    public async Task<ApiResponse<AdminDashboardStatsDto>> GetStatsAsync()
    {
        var adminRoleIds = await _context.Roles
            .Where(r => r.Name == "SuperAdmin" || r.Name == "Moderator")
            .Select(r => r.Id)
            .ToListAsync();

        var stats = new AdminDashboardStatsDto
        {
            TotalProviders = await _context.Providers.CountAsync(),
            ApprovedProviders = await _context.Providers.CountAsync(p => p.Status == ProviderStatus.Approved),
            PendingProviders = await _context.Providers.CountAsync(p => p.Status == ProviderStatus.Pending),
            SuspendedProviders = await _context.Providers.CountAsync(p => p.Status == ProviderStatus.Suspended),
            RejectedProviders = await _context.Providers.CountAsync(p => p.Status == ProviderStatus.Rejected),
            BeautyProviders = await _context.Providers.CountAsync(p => p.ProviderType == ProviderType.Beauty),
            ItProviders = await _context.Providers.CountAsync(p => p.ProviderType == ProviderType.ITService),
            TotalUsers = await _context.Users.CountAsync(u => !u.IsDeleted),
            ActiveUsers = await _context.Users.CountAsync(u => !u.IsDeleted && u.IsActive),
            AdminUsers = await _context.UserRoles.CountAsync(ur => adminRoleIds.Contains(ur.RoleId)),
            TotalReviews = await _context.Reviews.CountAsync(),
            PendingReviews = await _context.Reviews.CountAsync(r => r.Status == ReviewStatus.Pending),
            ApprovedReviews = await _context.Reviews.CountAsync(r => r.Status == ReviewStatus.Approved),
            RejectedReviews = await _context.Reviews.CountAsync(r => r.Status == ReviewStatus.Rejected),
            TotalEnquiries = await _context.Enquiries.CountAsync(),
            NewEnquiries = await _context.Enquiries.CountAsync(e => e.Status == EnquiryStatus.New),
            RepliedEnquiries = await _context.Enquiries.CountAsync(e => e.Status == EnquiryStatus.Replied),
            TotalReports = await _context.Reports.CountAsync(),
            PendingReports = await _context.Reports.CountAsync(r => r.Status == ReportStatus.Pending),
            Categories = await _context.Categories.CountAsync(c => c.IsActive),
            Suburbs = await _context.Suburbs.CountAsync(),
            GeneratedAt = DateTime.UtcNow
        };

        stats.RecentActivity = await BuildRecentActivityAsync();
        return ApiResponse<AdminDashboardStatsDto>.Ok(stats);
    }

    private async Task<List<AdminActivityDto>> BuildRecentActivityAsync()
    {
        var providerRows = await _context.Providers
            .OrderByDescending(p => p.CreatedAt)
            .Take(5)
            .ToListAsync();

        var providers = providerRows.Select(p => new AdminActivityDto
        {
            Type = "Provider",
            Title = p.BusinessName,
            Detail = p.City,
            Status = p.Status.ToString(),
            OccurredAt = p.CreatedAt
        });

        var reviewRows = await _context.Reviews
            .Include(r => r.Provider)
            .OrderByDescending(r => r.CreatedAt)
            .Take(5)
            .ToListAsync();

        var reviews = reviewRows.Select(r => new AdminActivityDto
        {
            Type = "Review",
            Title = r.Provider.BusinessName,
            Detail = r.Comment,
            Status = r.Status.ToString(),
            OccurredAt = r.CreatedAt
        });

        var enquiryRows = await _context.Enquiries
            .Include(e => e.Provider)
            .OrderByDescending(e => e.CreatedAt)
            .Take(5)
            .ToListAsync();

        var enquiries = enquiryRows.Select(e => new AdminActivityDto
        {
            Type = "Enquiry",
            Title = e.Provider.BusinessName,
            Detail = e.CustomerName,
            Status = e.Status.ToString(),
            OccurredAt = e.CreatedAt
        });

        return providers.Concat(reviews).Concat(enquiries)
            .OrderByDescending(a => a.OccurredAt)
            .Take(10)
            .ToList();
    }
}