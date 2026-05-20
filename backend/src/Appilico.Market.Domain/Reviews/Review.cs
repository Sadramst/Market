using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Reviews;

public class Review : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public Guid ProviderId { get; set; }
    public int Rating { get; set; } // 1-5
    public string? Title { get; set; }
    public string? Comment { get; set; }
    public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
    public string? AdminNotes { get; set; }
    public string? ProviderReply { get; set; }
    public DateTime? ProviderRepliedAt { get; set; }

    // Navigation
    public AppUser User { get; set; } = null!;
    public Provider Provider { get; set; } = null!;

    // TODO: Review photo attachments
    // TODO: Review helpful/unhelpful voting
    // TODO: AI moderation of review content
    // TODO: Verified customer badge for reviews
}

public enum ReviewStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2
}
