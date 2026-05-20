using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain;

public class ProviderGalleryImage : BaseEntity
{
    public Guid ProviderId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? AltText { get; set; }
    public string? Caption { get; set; }
    public int SortOrder { get; set; }
    public bool IsPrimary { get; set; }

    // Navigation
    public Provider Provider { get; set; } = null!;

    // TODO: Video support for future reels/video system
    // TODO: AI-generated alt text
    // TODO: Image moderation AI pipeline
}
