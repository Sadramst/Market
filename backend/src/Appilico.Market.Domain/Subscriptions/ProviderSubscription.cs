using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Subscriptions;

public class ProviderSubscription : BaseEntity
{
    public Guid ProviderId { get; set; }
    public SubscriptionPlan Plan { get; set; } = SubscriptionPlan.Free;
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public string? StripePriceId { get; set; }
    public DateTime? CurrentPeriodStart { get; set; }
    public DateTime? CurrentPeriodEnd { get; set; }
    public bool CancelAtPeriodEnd { get; set; }
    public DateTime? CancelledAt { get; set; }

    public Provider Provider { get; set; } = null!;
}

public enum SubscriptionPlan
{
    Free = 0,
    Pro = 1,
    Premium = 2
}

public enum SubscriptionStatus
{
    Incomplete = 0,
    Active = 1,
    PastDue = 2,
    Cancelled = 3,
    Unpaid = 4,
    Trialing = 5,
    Paused = 6
}