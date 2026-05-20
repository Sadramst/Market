namespace Appilico.Market.Infrastructure.Services.Storage;

public interface IStorageService
{
    Task<StorageResult> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null);
    Task<bool> DeleteAsync(string fileUrl);
    // TODO: Cloudflare R2 implementation
    // TODO: Image optimization/resize on upload
    // TODO: CDN URL generation
}

public record StorageResult(string Url, string? ThumbnailUrl, string FileName, long SizeBytes);
