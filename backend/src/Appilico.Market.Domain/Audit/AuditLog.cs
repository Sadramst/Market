using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Audit;

public class AuditLog : BaseEntity
{
    public string? UserId { get; set; }
    public string Action { get; set; } = string.Empty; // e.g., "ProviderApproved", "ReviewDeleted"
    public string EntityType { get; set; } = string.Empty;
    public Guid? EntityId { get; set; }
    public string? OldValues { get; set; } // JSON
    public string? NewValues { get; set; } // JSON
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}
