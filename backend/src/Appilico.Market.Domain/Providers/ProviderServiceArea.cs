using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain;

public class ProviderServiceArea : BaseEntity
{
    public Guid ProviderId { get; set; }
    public Guid SuburbId { get; set; }

    // Navigation
    public Provider Provider { get; set; } = null!;
    public Locations.Suburb Suburb { get; set; } = null!;
}
