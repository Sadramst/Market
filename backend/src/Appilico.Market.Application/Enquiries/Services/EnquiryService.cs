using Appilico.Market.Domain.Common;
using Appilico.Market.Domain.Enquiries;
using Appilico.Market.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Enquiries.Services;

public class EnquiryDto
{
    public Guid Id { get; set; }
    public Guid ProviderId { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? ServiceInterest { get; set; }
    public EnquiryStatus Status { get; set; }
    public string? ProviderReply { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime? RepliedAt { get; set; }
}

public class CreateEnquiryRequest
{
    public Guid ProviderId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? ServiceInterest { get; set; }
}

public interface IEnquiryService
{
    Task<ApiResponse<EnquiryDto>> CreateAsync(CreateEnquiryRequest request);
    Task<ApiResponse<PaginatedResponse<EnquiryDto>>> GetByProviderAsync(Guid providerId, string userId, int page, int pageSize);
    Task<ApiResponse<PaginatedResponse<EnquiryDto>>> GetAllAsync(int page, int pageSize, string? status);
    Task<ApiResponse<EnquiryDto>> MarkAsReadAsync(Guid enquiryId, string userId);
    Task<ApiResponse<EnquiryDto>> ReplyAsync(Guid enquiryId, string userId, string reply);
    Task<ApiResponse<EnquiryDto>> ArchiveAsync(Guid enquiryId, string userId);
}

public class EnquiryService : IEnquiryService
{
    private readonly AppDbContext _context;

    public EnquiryService(AppDbContext context) => _context = context;

    public async Task<ApiResponse<EnquiryDto>> CreateAsync(CreateEnquiryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName) || request.CustomerName.Length < 2)
            return ApiResponse<EnquiryDto>.Fail("Name is required (minimum 2 characters)");

        if (string.IsNullOrWhiteSpace(request.CustomerEmail) || !request.CustomerEmail.Contains('@'))
            return ApiResponse<EnquiryDto>.Fail("A valid email address is required");

        if (string.IsNullOrWhiteSpace(request.Message) || request.Message.Length < 20)
            return ApiResponse<EnquiryDto>.Fail("Message must be at least 20 characters");

        if (request.Message.Length > 500)
            return ApiResponse<EnquiryDto>.Fail("Message must be 500 characters or less");

        var provider = await _context.Providers.FindAsync(request.ProviderId);
        if (provider == null)
            return ApiResponse<EnquiryDto>.Fail("Provider not found");

        var enquiry = new Enquiry
        {
            ProviderId = request.ProviderId,
            CustomerName = request.CustomerName.Trim(),
            CustomerEmail = request.CustomerEmail.Trim().ToLowerInvariant(),
            CustomerPhone = request.CustomerPhone?.Trim(),
            Message = request.Message.Trim(),
            ServiceInterest = request.ServiceInterest?.Trim(),
            Status = EnquiryStatus.New,
        };

        _context.Enquiries.Add(enquiry);
        await _context.SaveChangesAsync();

        return ApiResponse<EnquiryDto>.Ok(MapToDto(enquiry, provider.BusinessName), "Enquiry sent successfully");
    }

    public async Task<ApiResponse<PaginatedResponse<EnquiryDto>>> GetByProviderAsync(Guid providerId, string userId, int page, int pageSize)
    {
        var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Id == providerId && p.UserId == userId);
        if (provider == null)
            return ApiResponse<PaginatedResponse<EnquiryDto>>.Fail("Provider not found or unauthorized");

        var query = _context.Enquiries
            .Include(e => e.Provider)
            .Where(e => e.ProviderId == providerId && !e.IsDeleted)
            .OrderByDescending(e => e.CreatedAt);

        var totalCount = await query.CountAsync();
        var enquiries = await query
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync();

        return ApiResponse<PaginatedResponse<EnquiryDto>>.Ok(new PaginatedResponse<EnquiryDto>
        {
            Items = enquiries.Select(e => MapToDto(e, e.Provider.BusinessName)).ToList(),
            Pagination = new PaginationMeta(page, pageSize, totalCount)
        });
    }

    public async Task<ApiResponse<PaginatedResponse<EnquiryDto>>> GetAllAsync(int page, int pageSize, string? status)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Enquiries
            .Include(e => e.Provider)
            .AsQueryable();

        if (Enum.TryParse<EnquiryStatus>(status, true, out var parsedStatus))
            query = query.Where(e => e.Status == parsedStatus);

        var totalCount = await query.CountAsync();
        var enquiries = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return ApiResponse<PaginatedResponse<EnquiryDto>>.Ok(new PaginatedResponse<EnquiryDto>
        {
            Items = enquiries.Select(e => MapToDto(e, e.Provider.BusinessName)).ToList(),
            Pagination = new PaginationMeta(page, pageSize, totalCount)
        });
    }

    public async Task<ApiResponse<EnquiryDto>> MarkAsReadAsync(Guid enquiryId, string userId)
    {
        var enquiry = await GetOwnedEnquiry(enquiryId, userId);
        if (enquiry == null)
            return ApiResponse<EnquiryDto>.Fail("Enquiry not found or unauthorized");

        if (enquiry.Status == EnquiryStatus.New)
        {
            enquiry.Status = EnquiryStatus.Read;
            enquiry.ReadAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return ApiResponse<EnquiryDto>.Ok(MapToDto(enquiry, enquiry.Provider.BusinessName));
    }

    public async Task<ApiResponse<EnquiryDto>> ReplyAsync(Guid enquiryId, string userId, string reply)
    {
        if (string.IsNullOrWhiteSpace(reply))
            return ApiResponse<EnquiryDto>.Fail("Reply message is required");

        var enquiry = await GetOwnedEnquiry(enquiryId, userId);
        if (enquiry == null)
            return ApiResponse<EnquiryDto>.Fail("Enquiry not found or unauthorized");

        enquiry.ProviderReply = reply.Trim();
        enquiry.RepliedAt = DateTime.UtcNow;
        enquiry.Status = EnquiryStatus.Replied;
        await _context.SaveChangesAsync();

        return ApiResponse<EnquiryDto>.Ok(MapToDto(enquiry, enquiry.Provider.BusinessName), "Reply sent");
    }

    public async Task<ApiResponse<EnquiryDto>> ArchiveAsync(Guid enquiryId, string userId)
    {
        var enquiry = await GetOwnedEnquiry(enquiryId, userId);
        if (enquiry == null)
            return ApiResponse<EnquiryDto>.Fail("Enquiry not found or unauthorized");

        enquiry.Status = EnquiryStatus.Archived;
        await _context.SaveChangesAsync();

        return ApiResponse<EnquiryDto>.Ok(MapToDto(enquiry, enquiry.Provider.BusinessName));
    }

    private async Task<Enquiry?> GetOwnedEnquiry(Guid enquiryId, string userId)
    {
        return await _context.Enquiries
            .Include(e => e.Provider)
            .FirstOrDefaultAsync(e => e.Id == enquiryId && e.Provider.UserId == userId && !e.IsDeleted);
    }

    private static EnquiryDto MapToDto(Enquiry e, string providerName) => new()
    {
        Id = e.Id,
        ProviderId = e.ProviderId,
        ProviderName = providerName,
        CustomerName = e.CustomerName,
        CustomerEmail = e.CustomerEmail,
        CustomerPhone = e.CustomerPhone,
        Message = e.Message,
        ServiceInterest = e.ServiceInterest,
        Status = e.Status,
        ProviderReply = e.ProviderReply,
        CreatedAt = e.CreatedAt,
        ReadAt = e.ReadAt,
        RepliedAt = e.RepliedAt,
    };
}
