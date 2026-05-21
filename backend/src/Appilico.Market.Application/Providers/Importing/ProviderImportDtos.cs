using Appilico.Market.Domain;

namespace Appilico.Market.Application.Providers.Importing;

public sealed class ProviderImportCsvRequest
{
    public string Csv { get; set; } = string.Empty;
    public string? SourceName { get; set; }
    public bool ApproveImported { get; set; }
    public bool UpdateExisting { get; set; } = true;
    public bool ReplaceServices { get; set; } = true;
    public bool ReplaceServiceAreas { get; set; } = true;
}

public sealed class ProviderImportResultDto
{
    public int TotalRows { get; set; }
    public int ValidRows { get; set; }
    public int InvalidRows { get; set; }
    public int Created { get; set; }
    public int Updated { get; set; }
    public int Skipped { get; set; }
    public List<ProviderImportPreviewRowDto> Rows { get; set; } = [];
    public List<ProviderImportIssueDto> Issues { get; set; } = [];
}

public sealed class ProviderImportPreviewRowDto
{
    public int RowNumber { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int QualityScore { get; set; }
    public bool WillUpdate { get; set; }
    public bool HasErrors { get; set; }
    public List<ProviderImportIssueDto> Issues { get; set; } = [];
}

public sealed class ProviderImportIssueDto
{
    public int RowNumber { get; set; }
    public string Field { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Severity { get; set; } = ProviderImportIssueSeverity.Error;
}

public static class ProviderImportIssueSeverity
{
    public const string Error = "error";
    public const string Warning = "warning";
}

public sealed record ProviderImportRecord(
    int RowNumber,
    string BusinessName,
    string? Slug,
    ProviderType ProviderType,
    IReadOnlyList<string> CategorySlugs,
    IReadOnlyList<string> ServiceAreaSlugs,
    IReadOnlyList<string> ServiceNames,
    string? Description,
    string? Tagline,
    string? Phone,
    string? Email,
    string? Website,
    string? InstagramUrl,
    string? FacebookUrl,
    string? FullAddress,
    string? City,
    string? State,
    string? PostalCode,
    string? SourceName,
    string? SourceUrl,
    string? BusinessHoursJson,
    double? AverageRating,
    int? TotalReviews,
    bool IsFeatured,
    bool IsVerified);

public sealed record ProviderImportValidationResult(
    IReadOnlyList<ProviderImportIssueDto> Issues,
    int QualityScore)
{
    public bool HasErrors => Issues.Any(issue => issue.Severity == ProviderImportIssueSeverity.Error);
}
