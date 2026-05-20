using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Moderation;

public class Report : BaseEntity
{
    public string ReporterId { get; set; } = string.Empty; // AppUser Id
    public ReportTargetType TargetType { get; set; }
    public Guid TargetId { get; set; } // Provider Id, Review Id, etc.
    public ReportReason Reason { get; set; }
    public string? Description { get; set; }
    public ReportStatus Status { get; set; } = ReportStatus.Pending;
    public string? ResolvedBy { get; set; }
    public string? ResolutionNotes { get; set; }
    public DateTime? ResolvedAt { get; set; }

    // Navigation
    public AppUser Reporter { get; set; } = null!;

    // TODO: AI moderation auto-flagging
    // TODO: Reporter reputation scoring
}

public enum ReportTargetType
{
    Provider = 0,
    Review = 1,
    Message = 2,
    GalleryImage = 3
}

public enum ReportReason
{
    Spam = 0,
    Inappropriate = 1,
    FakeProfile = 2,
    Harassment = 3,
    MisleadingInfo = 4,
    Copyright = 5,
    Other = 99
}

public enum ReportStatus
{
    Pending = 0,
    Reviewing = 1,
    Resolved = 2,
    Dismissed = 3
}
