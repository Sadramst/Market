using Appilico.Market.Domain.Common;
using Appilico.Market.Domain.Moderation;
using Appilico.Market.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Reports.Services;

public class ReportDto
{
    public Guid Id { get; set; }
    public string ReporterId { get; set; } = string.Empty;
    public string ReporterName { get; set; } = string.Empty;
    public string ReporterEmail { get; set; } = string.Empty;
    public ReportTargetType TargetType { get; set; }
    public Guid TargetId { get; set; }
    public string? TargetLabel { get; set; }
    public ReportReason Reason { get; set; }
    public string? Description { get; set; }
    public ReportStatus Status { get; set; }
    public string? ResolutionNotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}

public class CreateReportRequest
{
    public ReportTargetType TargetType { get; set; }
    public Guid TargetId { get; set; }
    public ReportReason Reason { get; set; }
    public string? Description { get; set; }
}

public class ResolveReportRequest
{
    public ReportStatus Status { get; set; }
    public string? ResolutionNotes { get; set; }
}

public interface IReportService
{
    Task<ApiResponse<PaginatedResponse<ReportDto>>> GetAllAsync(int page, int pageSize, string? status);
    Task<ApiResponse<ReportDto>> CreateAsync(string reporterId, CreateReportRequest request);
    Task<ApiResponse<ReportDto>> UpdateStatusAsync(Guid reportId, string adminUserId, ResolveReportRequest request);
}

public class ReportService : IReportService
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context) => _context = context;

    public async Task<ApiResponse<PaginatedResponse<ReportDto>>> GetAllAsync(int page, int pageSize, string? status)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Reports
            .Include(r => r.Reporter)
            .AsQueryable();

        if (Enum.TryParse<ReportStatus>(status, true, out var parsedStatus))
            query = query.Where(r => r.Status == parsedStatus);

        var totalCount = await query.CountAsync();
        var reports = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = new List<ReportDto>();
        foreach (var report in reports)
            items.Add(await MapToDtoAsync(report));

        return ApiResponse<PaginatedResponse<ReportDto>>.Ok(new PaginatedResponse<ReportDto>
        {
            Items = items,
            Pagination = new PaginationMeta(page, pageSize, totalCount)
        });
    }

    public async Task<ApiResponse<ReportDto>> CreateAsync(string reporterId, CreateReportRequest request)
    {
        if (request.TargetId == Guid.Empty)
            return ApiResponse<ReportDto>.Fail("Report target is required");

        var targetExists = await TargetExistsAsync(request.TargetType, request.TargetId);
        if (!targetExists)
            return ApiResponse<ReportDto>.Fail("Report target not found");

        var report = new Report
        {
            ReporterId = reporterId,
            TargetType = request.TargetType,
            TargetId = request.TargetId,
            Reason = request.Reason,
            Description = request.Description?.Trim(),
            Status = ReportStatus.Pending
        };

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        report = await _context.Reports.Include(r => r.Reporter).FirstAsync(r => r.Id == report.Id);
        return ApiResponse<ReportDto>.Ok(await MapToDtoAsync(report), "Report submitted");
    }

    public async Task<ApiResponse<ReportDto>> UpdateStatusAsync(Guid reportId, string adminUserId, ResolveReportRequest request)
    {
        var report = await _context.Reports
            .Include(r => r.Reporter)
            .FirstOrDefaultAsync(r => r.Id == reportId);

        if (report == null)
            return ApiResponse<ReportDto>.Fail("Report not found");

        report.Status = request.Status;
        report.ResolutionNotes = request.ResolutionNotes?.Trim();

        if (request.Status is ReportStatus.Resolved or ReportStatus.Dismissed)
        {
            report.ResolvedBy = adminUserId;
            report.ResolvedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return ApiResponse<ReportDto>.Ok(await MapToDtoAsync(report));
    }

    private async Task<bool> TargetExistsAsync(ReportTargetType targetType, Guid targetId)
    {
        return targetType switch
        {
            ReportTargetType.Provider => await _context.Providers.AnyAsync(p => p.Id == targetId),
            ReportTargetType.Review => await _context.Reviews.AnyAsync(r => r.Id == targetId),
            ReportTargetType.GalleryImage => await _context.ProviderGalleryImages.AnyAsync(g => g.Id == targetId),
            ReportTargetType.Message => await _context.Messages.AnyAsync(m => m.Id == targetId),
            _ => false
        };
    }

    private async Task<ReportDto> MapToDtoAsync(Report report)
    {
        return new ReportDto
        {
            Id = report.Id,
            ReporterId = report.ReporterId,
            ReporterName = report.Reporter == null ? "Unknown" : $"{report.Reporter.FirstName} {report.Reporter.LastName}".Trim(),
            ReporterEmail = report.Reporter?.Email ?? string.Empty,
            TargetType = report.TargetType,
            TargetId = report.TargetId,
            TargetLabel = await ResolveTargetLabelAsync(report.TargetType, report.TargetId),
            Reason = report.Reason,
            Description = report.Description,
            Status = report.Status,
            ResolutionNotes = report.ResolutionNotes,
            CreatedAt = report.CreatedAt,
            ResolvedAt = report.ResolvedAt
        };
    }

    private async Task<string?> ResolveTargetLabelAsync(ReportTargetType targetType, Guid targetId)
    {
        return targetType switch
        {
            ReportTargetType.Provider => await _context.Providers
                .Where(p => p.Id == targetId)
                .Select(p => p.BusinessName)
                .FirstOrDefaultAsync(),
            ReportTargetType.Review => await _context.Reviews
                .Include(r => r.Provider)
                .Where(r => r.Id == targetId)
                .Select(r => r.Provider.BusinessName)
                .FirstOrDefaultAsync(),
            ReportTargetType.GalleryImage => "Provider gallery image",
            ReportTargetType.Message => "Message",
            _ => null
        };
    }
}