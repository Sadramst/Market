using Appilico.Market.Domain;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Locations;

namespace Appilico.Market.Application.Providers.Importing;

public interface IProviderImportValidator
{
    ProviderImportValidationResult Validate(
        ProviderImportRecord record,
        string slug,
        IReadOnlyDictionary<string, Category> categoriesBySlug,
        IReadOnlyDictionary<string, Suburb> suburbsBySlug);
}

public sealed class ProviderImportValidator : IProviderImportValidator
{
    public ProviderImportValidationResult Validate(
        ProviderImportRecord record,
        string slug,
        IReadOnlyDictionary<string, Category> categoriesBySlug,
        IReadOnlyDictionary<string, Suburb> suburbsBySlug)
    {
        var issues = new List<ProviderImportIssueDto>();

        Required(record.RowNumber, record.BusinessName, "business_name", "Business name is required.", issues);
        Required(record.RowNumber, slug, "slug", "Slug could not be generated.", issues);
        Required(record.RowNumber, record.SourceUrl, "source_url", "A source URL is required for every real provider record.", issues);

        if (record.CategorySlugs.Count == 0)
        {
            issues.Add(Error(record.RowNumber, "category_slugs", "At least one category slug is required."));
        }

        foreach (var categorySlug in record.CategorySlugs.Where(categorySlug => !categoriesBySlug.ContainsKey(categorySlug)))
        {
            issues.Add(Error(record.RowNumber, "category_slugs", $"Unknown category slug '{categorySlug}'."));
        }

        foreach (var suburbSlug in record.ServiceAreaSlugs.Where(suburbSlug => !suburbsBySlug.ContainsKey(suburbSlug)))
        {
            issues.Add(Error(record.RowNumber, "service_area_slugs", $"Unknown service area slug '{suburbSlug}'."));
        }

        if (record.ServiceAreaSlugs.Count == 0 && string.IsNullOrWhiteSpace(record.City))
        {
            issues.Add(Warning(record.RowNumber, "service_area_slugs", "No service area or city was supplied, so suburb search coverage will be weak."));
        }

        if (string.IsNullOrWhiteSpace(record.Phone)
            && string.IsNullOrWhiteSpace(record.Email)
            && string.IsNullOrWhiteSpace(record.Website)
            && string.IsNullOrWhiteSpace(record.InstagramUrl)
            && string.IsNullOrWhiteSpace(record.FacebookUrl))
        {
            issues.Add(Error(record.RowNumber, "contact", "At least one public contact channel is required."));
        }

        CheckUrl(record.RowNumber, "website", record.Website, issues);
        CheckUrl(record.RowNumber, "instagram", record.InstagramUrl, issues);
        CheckUrl(record.RowNumber, "facebook", record.FacebookUrl, issues);
        CheckUrl(record.RowNumber, "source_url", record.SourceUrl, issues);

        if (!string.IsNullOrWhiteSpace(record.Phone) && record.Phone.Length > 20)
        {
            issues.Add(Error(record.RowNumber, "phone", "Phone must be 20 characters or fewer."));
        }

        if (record.AverageRating is < 0 or > 5)
        {
            issues.Add(Error(record.RowNumber, "rating", "Rating must be between 0 and 5."));
        }

        if (record.TotalReviews < 0)
        {
            issues.Add(Error(record.RowNumber, "review_count", "Review count cannot be negative."));
        }

        return new ProviderImportValidationResult(issues, CalculateQualityScore(record, issues));
    }

    private static void Required(int rowNumber, string? value, string field, string message, List<ProviderImportIssueDto> issues)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            issues.Add(Error(rowNumber, field, message));
        }
    }

    private static void CheckUrl(int rowNumber, string field, string? value, List<ProviderImportIssueDto> issues)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return;
        }

        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri) || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
        {
            issues.Add(Error(rowNumber, field, $"{field} must be an absolute http or https URL."));
        }
    }

    private static int CalculateQualityScore(ProviderImportRecord record, IReadOnlyCollection<ProviderImportIssueDto> issues)
    {
        var score = 25;
        score += string.IsNullOrWhiteSpace(record.Phone) ? 0 : 10;
        score += string.IsNullOrWhiteSpace(record.Website) ? 0 : 10;
        score += string.IsNullOrWhiteSpace(record.InstagramUrl) ? 0 : 10;
        score += string.IsNullOrWhiteSpace(record.FullAddress) ? 0 : 10;
        score += string.IsNullOrWhiteSpace(record.Description) ? 0 : 10;
        score += record.ServiceNames.Count == 0 ? 0 : 10;
        score += record.ServiceAreaSlugs.Count == 0 ? 0 : 10;
        score += string.IsNullOrWhiteSpace(record.SourceUrl) ? 0 : 15;
        score -= issues.Count(issue => issue.Severity == ProviderImportIssueSeverity.Error) * 20;
        score -= issues.Count(issue => issue.Severity == ProviderImportIssueSeverity.Warning) * 5;
        return Math.Clamp(score, 0, 100);
    }

    private static ProviderImportIssueDto Error(int rowNumber, string field, string message) => new()
    {
        RowNumber = rowNumber,
        Field = field,
        Message = message,
        Severity = ProviderImportIssueSeverity.Error
    };

    private static ProviderImportIssueDto Warning(int rowNumber, string field, string message) => new()
    {
        RowNumber = rowNumber,
        Field = field,
        Message = message,
        Severity = ProviderImportIssueSeverity.Warning
    };
}
