namespace Appilico.Market.Infrastructure.Services.Storage;

/// <summary>
/// Local file system storage for development.
/// TODO: Replace with Cloudflare R2 for production.
/// </summary>
public class LocalStorageService : IStorageService
{
    private readonly string _basePath;
    private readonly string _baseUrl;

    public LocalStorageService(string basePath = "wwwroot/uploads", string baseUrl = "/uploads")
    {
        _basePath = basePath;
        _baseUrl = baseUrl;
    }

    public async Task<StorageResult> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null)
    {
        var folderPath = folder != null ? Path.Combine(_basePath, folder) : _basePath;
        Directory.CreateDirectory(folderPath);

        var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
        var filePath = Path.Combine(folderPath, uniqueFileName);

        using var fileStream = new FileStream(filePath, FileMode.Create);
        await stream.CopyToAsync(fileStream);

        var url = folder != null
            ? $"{_baseUrl}/{folder}/{uniqueFileName}"
            : $"{_baseUrl}/{uniqueFileName}";

        return new StorageResult(url, null, uniqueFileName, stream.Length);
    }

    public Task<bool> DeleteAsync(string fileUrl)
    {
        var relativePath = fileUrl.Replace(_baseUrl, _basePath).Replace("/", Path.DirectorySeparatorChar.ToString());
        if (File.Exists(relativePath))
        {
            File.Delete(relativePath);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }
}
