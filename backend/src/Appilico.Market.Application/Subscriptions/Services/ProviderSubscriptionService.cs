using Appilico.Market.Domain.Common;
using Appilico.Market.Domain.Subscriptions;
using Appilico.Market.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Subscriptions.Services;

public class ProviderSubscriptionDto
{
    public Guid Id { get; set; }
    public Guid ProviderId { get; set; }
    public SubscriptionPlan Plan { get; set; }
    public SubscriptionStatus Status { get; set; }
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public string? StripePriceId { get; set; }
    public DateTime? CurrentPeriodStart { get; set; }
    public DateTime? CurrentPeriodEnd { get; set; }
    public bool CancelAtPeriodEnd { get; set; }
    public DateTime? CancelledAt { get; set; }
}

public class UpsertProviderSubscriptionRequest
{
    public Guid ProviderId { get; set; }
    public SubscriptionPlan Plan { get; set; }
    public SubscriptionStatus Status { get; set; }
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public string? StripePriceId { get; set; }
    public DateTime? CurrentPeriodStart { get; set; }
    public DateTime? CurrentPeriodEnd { get; set; }
    public bool CancelAtPeriodEnd { get; set; }
    public DateTime? CancelledAt { get; set; }
}

public interface IProviderSubscriptionService
{
    Task<ApiResponse<ProviderSubscriptionDto>> GetByProviderAsync(Guid providerId, string userId);
    Task<ApiResponse<ProviderSubscriptionDto>> UpsertFromStripeAsync(UpsertProviderSubscriptionRequest request);
}

public class ProviderSubscriptionService : IProviderSubscriptionService
{
    private readonly AppDbContext _context;

    public ProviderSubscriptionService(AppDbContext context) => _context = context;

    public async Task<ApiResponse<ProviderSubscriptionDto>> GetByProviderAsync(Guid providerId, string userId)
    {
        var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Id == providerId && (p.UserId == userId || p.ClaimedByUserId == userId));
        if (provider == null)
            return ApiResponse<ProviderSubscriptionDto>.Fail("Provider not found");

        var subscription = await _context.ProviderSubscriptions
            .Where(s => s.ProviderId == providerId)
            .OrderByDescending(s => s.CreatedAt)
            .FirstOrDefaultAsync();

        return ApiResponse<ProviderSubscriptionDto>.Ok(subscription == null
            ? new ProviderSubscriptionDto { ProviderId = providerId, Plan = SubscriptionPlan.Free, Status = SubscriptionStatus.Active }
            : MapToDto(subscription));
    }

    public async Task<ApiResponse<ProviderSubscriptionDto>> UpsertFromStripeAsync(UpsertProviderSubscriptionRequest request)
    {
        var providerExists = await _context.Providers.AnyAsync(p => p.Id == request.ProviderId);
        if (!providerExists)
            return ApiResponse<ProviderSubscriptionDto>.Fail("Provider not found");

        ProviderSubscription? subscription = null;
        if (!string.IsNullOrWhiteSpace(request.StripeSubscriptionId))
        {
            subscription = await _context.ProviderSubscriptions
                .FirstOrDefaultAsync(s => s.StripeSubscriptionId == request.StripeSubscriptionId);
        }

        subscription ??= await _context.ProviderSubscriptions
            .Where(s => s.ProviderId == request.ProviderId)
            .OrderByDescending(s => s.CreatedAt)
            .FirstOrDefaultAsync();

        if (subscription == null)
        {
            subscription = new ProviderSubscription { ProviderId = request.ProviderId };
            _context.ProviderSubscriptions.Add(subscription);
        }

        subscription.Plan = request.Plan;
        subscription.Status = request.Status;
        subscription.StripeCustomerId = request.StripeCustomerId;
        subscription.StripeSubscriptionId = request.StripeSubscriptionId;
        subscription.StripePriceId = request.StripePriceId;
        subscription.CurrentPeriodStart = request.CurrentPeriodStart;
        subscription.CurrentPeriodEnd = request.CurrentPeriodEnd;
        subscription.CancelAtPeriodEnd = request.CancelAtPeriodEnd;
        subscription.CancelledAt = request.CancelledAt;

        await _context.SaveChangesAsync();
        return ApiResponse<ProviderSubscriptionDto>.Ok(MapToDto(subscription));
    }

    private static ProviderSubscriptionDto MapToDto(ProviderSubscription subscription) => new()
    {
        Id = subscription.Id,
        ProviderId = subscription.ProviderId,
        Plan = subscription.Plan,
        Status = subscription.Status,
        StripeCustomerId = subscription.StripeCustomerId,
        StripeSubscriptionId = subscription.StripeSubscriptionId,
        StripePriceId = subscription.StripePriceId,
        CurrentPeriodStart = subscription.CurrentPeriodStart,
        CurrentPeriodEnd = subscription.CurrentPeriodEnd,
        CancelAtPeriodEnd = subscription.CancelAtPeriodEnd,
        CancelledAt = subscription.CancelledAt
    };
}