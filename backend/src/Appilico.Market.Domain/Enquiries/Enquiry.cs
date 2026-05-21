using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Enquiries;

public class Enquiry : BaseEntity
{
    public Guid ProviderId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? ServiceInterest { get; set; }
    public EnquiryStatus Status { get; set; } = EnquiryStatus.New;
    public DateTime? ReadAt { get; set; }
    public DateTime? RepliedAt { get; set; }
    public string? ProviderReply { get; set; }

    // Navigation
    public Provider Provider { get; set; } = null!;
}

public enum EnquiryStatus
{
    New = 0,
    Read = 1,
    Replied = 2,
    Archived = 3
}
