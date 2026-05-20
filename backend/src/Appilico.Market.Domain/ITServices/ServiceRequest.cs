using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.ITServices;

public class ServiceRequest : BaseEntity
{
    public string CustomerId { get; set; } = string.Empty; // AppUser Id
    public Guid CategoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public string? BudgetNote { get; set; }
    public ServiceRequestStatus Status { get; set; } = ServiceRequestStatus.Open;
    public string? AttachmentUrls { get; set; } // JSON array of URLs
    public DateTime? Deadline { get; set; }
    public string? Location { get; set; } // Remote, on-site, hybrid

    // Navigation
    public AppUser Customer { get; set; } = null!;
    public Categories.Category Category { get; set; } = null!;
    public ICollection<ServiceOffer> Offers { get; set; } = [];
}

public class ServiceOffer : BaseEntity
{
    public Guid ServiceRequestId { get; set; }
    public Guid ProviderId { get; set; }
    public decimal ProposedPrice { get; set; }
    public string? Message { get; set; }
    public int? EstimatedDays { get; set; }
    public ServiceOfferStatus Status { get; set; } = ServiceOfferStatus.Pending;

    // Navigation
    public ServiceRequest ServiceRequest { get; set; } = null!;
    public Provider Provider { get; set; } = null!;
}

public enum ServiceRequestStatus
{
    Open = 0,
    InProgress = 1,
    Completed = 2,
    Cancelled = 3,
    Closed = 4
}

public enum ServiceOfferStatus
{
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
    Withdrawn = 3
}
