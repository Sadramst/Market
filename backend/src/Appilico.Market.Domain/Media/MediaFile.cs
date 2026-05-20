using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Media;

public class MediaFile : BaseEntity
{
    public string FileName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public string? AltText { get; set; }
    public string UploadedBy { get; set; } = string.Empty; // AppUser Id
    public string? Folder { get; set; } // Logical grouping

    // TODO: Cloudflare R2 integration
    // TODO: Image optimization pipeline
    // TODO: CDN URL generation
    // TODO: AI-generated alt text
    // TODO: Image moderation scanning
}
