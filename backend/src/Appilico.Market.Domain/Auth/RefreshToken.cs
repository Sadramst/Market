using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Auth;

public class RefreshToken : BaseEntity
{
    public string Token { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public string? RevokedReason { get; set; }

    // Navigation
    public AppUser User { get; set; } = null!;
}
