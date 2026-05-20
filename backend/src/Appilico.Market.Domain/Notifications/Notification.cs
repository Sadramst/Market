using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Notifications;

public class Notification : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string? ActionUrl { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }

    // Reference to the entity that triggered the notification
    public string? ReferenceType { get; set; } // e.g., "Review", "Follow", "Message"
    public Guid? ReferenceId { get; set; }

    // Navigation
    public AppUser User { get; set; } = null!;

    // TODO: Push notification integration (FCM/APNs)
    // TODO: Email notification preferences per type
    // TODO: SMS notification abstraction
}

public enum NotificationType
{
    System = 0,
    NewFollower = 1,
    NewReview = 2,
    NewMessage = 3,
    ProviderApproved = 4,
    ProviderRejected = 5,
    NewInquiry = 6,
    ReviewApproved = 7,
    ReviewRejected = 8,
    Report = 9
}
