using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Social;

public class Follow : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public Guid ProviderId { get; set; }

    // Navigation
    public AppUser User { get; set; } = null!;
    public Provider Provider { get; set; } = null!;
}

public class Favorite : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public Guid ProviderId { get; set; }

    // Navigation
    public AppUser User { get; set; } = null!;
    public Provider Provider { get; set; } = null!;

    // TODO: Favorite collections/lists
}
