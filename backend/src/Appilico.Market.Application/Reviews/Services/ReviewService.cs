using Appilico.Market.Domain.Common;
using Appilico.Market.Domain.Reviews;
using Appilico.Market.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Reviews.Services;

public class ReviewDto
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string? UserAvatar { get; set; }
    public Guid ProviderId { get; set; }
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string? Comment { get; set; }
    public ReviewStatus Status { get; set; }
    public string? ProviderReply { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewRequest
{
    public Guid ProviderId { get; set; }
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string? Comment { get; set; }
}

public interface IReviewService
{
    Task<ApiResponse<PaginatedResponse<ReviewDto>>> GetByProviderAsync(Guid providerId, int page, int pageSize);
    Task<ApiResponse<ReviewDto>> CreateAsync(string userId, CreateReviewRequest request);
    Task<ApiResponse<ReviewDto>> ReplyAsync(Guid reviewId, string userId, string reply);
    Task<ApiResponse<ReviewDto>> AdminUpdateStatusAsync(Guid reviewId, ReviewStatus status);
}

public class ReviewService : IReviewService
{
    private readonly AppDbContext _context;

    public ReviewService(AppDbContext context) => _context = context;

    public async Task<ApiResponse<PaginatedResponse<ReviewDto>>> GetByProviderAsync(Guid providerId, int page, int pageSize)
    {
        var query = _context.Reviews
            .Include(r => r.User)
            .Where(r => r.ProviderId == providerId && r.Status == ReviewStatus.Approved)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();
        var reviews = await query
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync();

        return ApiResponse<PaginatedResponse<ReviewDto>>.Ok(new PaginatedResponse<ReviewDto>
        {
            Items = reviews.Select(MapToDto).ToList(),
            Pagination = new PaginationMeta
            {
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                PageSize = pageSize,
                TotalCount = totalCount
            }
        });
    }

    public async Task<ApiResponse<ReviewDto>> CreateAsync(string userId, CreateReviewRequest request)
    {
        // Check if user already reviewed this provider
        var existing = await _context.Reviews
            .AnyAsync(r => r.UserId == userId && r.ProviderId == request.ProviderId && !r.IsDeleted);
        if (existing)
            return ApiResponse<ReviewDto>.Fail("You have already reviewed this provider");

        var review = new Review
        {
            UserId = userId,
            ProviderId = request.ProviderId,
            Rating = Math.Clamp(request.Rating, 1, 5),
            Title = request.Title,
            Comment = request.Comment,
            Status = ReviewStatus.Pending
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        // Update provider average rating
        await UpdateProviderRating(request.ProviderId);

        return ApiResponse<ReviewDto>.Ok(MapToDto(review), "Review submitted for moderation");
    }

    public async Task<ApiResponse<ReviewDto>> ReplyAsync(Guid reviewId, string userId, string reply)
    {
        var review = await _context.Reviews
            .Include(r => r.Provider)
            .FirstOrDefaultAsync(r => r.Id == reviewId);

        if (review == null)
            return ApiResponse<ReviewDto>.Fail("Review not found");

        if (review.Provider?.UserId != userId)
            return ApiResponse<ReviewDto>.Fail("Only the provider owner can reply");

        review.ProviderReply = reply;
        review.ProviderRepliedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<ReviewDto>.Ok(MapToDto(review));
    }

    public async Task<ApiResponse<ReviewDto>> AdminUpdateStatusAsync(Guid reviewId, ReviewStatus status)
    {
        var review = await _context.Reviews.Include(r => r.User).FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review == null)
            return ApiResponse<ReviewDto>.Fail("Review not found");

        review.Status = status;
        await _context.SaveChangesAsync();

        // Recalculate rating if approved/rejected
        await UpdateProviderRating(review.ProviderId);

        return ApiResponse<ReviewDto>.Ok(MapToDto(review));
    }

    private async Task UpdateProviderRating(Guid providerId)
    {
        var provider = await _context.Providers.FindAsync(providerId);
        if (provider == null) return;

        var approvedReviews = await _context.Reviews
            .Where(r => r.ProviderId == providerId && r.Status == ReviewStatus.Approved)
            .ToListAsync();

        provider.TotalReviews = approvedReviews.Count;
        provider.AverageRating = approvedReviews.Count > 0
            ? Math.Round(approvedReviews.Average(r => r.Rating), 1)
            : 0;

        await _context.SaveChangesAsync();
    }

    private static ReviewDto MapToDto(Review r) => new()
    {
        Id = r.Id,
        UserId = r.UserId,
        UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Anonymous",
        UserAvatar = r.User?.Avatar,
        ProviderId = r.ProviderId,
        Rating = r.Rating,
        Title = r.Title,
        Comment = r.Comment,
        Status = r.Status,
        ProviderReply = r.ProviderReply,
        CreatedAt = r.CreatedAt
    };
}
