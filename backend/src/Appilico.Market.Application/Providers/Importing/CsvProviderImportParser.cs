using System.Globalization;
using System.Text;
using Appilico.Market.Domain;

namespace Appilico.Market.Application.Providers.Importing;

public interface IProviderImportParser
{
    IReadOnlyList<ProviderImportRecord> Parse(string csv);
}

public sealed class CsvProviderImportParser : IProviderImportParser
{
    public IReadOnlyList<ProviderImportRecord> Parse(string csv)
    {
        var rows = ReadRows(csv);
        if (rows.Count < 2)
        {
            return [];
        }

        var headers = rows[0]
            .Select((header, index) => new { Header = NormalizeHeader(header), Index = index })
            .Where(item => !string.IsNullOrWhiteSpace(item.Header))
            .GroupBy(item => item.Header)
            .ToDictionary(group => group.Key, group => group.First().Index, StringComparer.OrdinalIgnoreCase);

        var records = new List<ProviderImportRecord>();
        for (var index = 1; index < rows.Count; index++)
        {
            var row = rows[index];
            if (row.All(string.IsNullOrWhiteSpace))
            {
                continue;
            }

            records.Add(new ProviderImportRecord(
                RowNumber: index + 1,
                BusinessName: Get(row, headers, "business_name", "name", "business"),
                Slug: NullIfWhiteSpace(Get(row, headers, "slug")),
                ProviderType: ParseProviderType(Get(row, headers, "provider_type", "marketplace", "marketplace_type")),
                CategorySlugs: SplitList(Get(row, headers, "category_slugs", "categories", "category")),
                ServiceAreaSlugs: SplitList(Get(row, headers, "service_area_slugs", "service_areas", "suburbs", "suburb_slugs")),
                ServiceNames: SplitList(Get(row, headers, "service_names", "services")),
                Description: NullIfWhiteSpace(Get(row, headers, "description", "about")),
                Tagline: NullIfWhiteSpace(Get(row, headers, "tagline", "headline")),
                Phone: NullIfWhiteSpace(Get(row, headers, "phone", "telephone", "mobile")),
                Email: NullIfWhiteSpace(Get(row, headers, "email")),
                Website: NormalizeUrl(Get(row, headers, "website", "site", "url")),
                InstagramUrl: NormalizeSocialUrl(Get(row, headers, "instagram", "instagram_url"), "instagram.com"),
                FacebookUrl: NormalizeSocialUrl(Get(row, headers, "facebook", "facebook_url"), "facebook.com"),
                FullAddress: NullIfWhiteSpace(Get(row, headers, "address", "full_address")),
                City: NullIfWhiteSpace(Get(row, headers, "city", "suburb")),
                State: NullIfWhiteSpace(Get(row, headers, "state")),
                PostalCode: NullIfWhiteSpace(Get(row, headers, "post_code", "postcode", "postal_code")),
                SourceName: NullIfWhiteSpace(Get(row, headers, "source_name", "data_source")),
                SourceUrl: NormalizeUrl(Get(row, headers, "source_url", "source")),
                BusinessHoursJson: NullIfWhiteSpace(Get(row, headers, "business_hours_json", "hours")),
                AverageRating: ParseDouble(Get(row, headers, "rating", "average_rating")),
                TotalReviews: ParseInt(Get(row, headers, "review_count", "total_reviews", "reviews")),
                IsFeatured: ParseBool(Get(row, headers, "featured", "is_featured")),
                IsVerified: ParseBool(Get(row, headers, "verified", "is_verified"))));
        }

        return records;
    }

    private static string Get(IReadOnlyList<string> row, IReadOnlyDictionary<string, int> headers, params string[] names)
    {
        foreach (var name in names)
        {
            if (headers.TryGetValue(name, out var index) && index < row.Count)
            {
                return row[index].Trim();
            }
        }

        return string.Empty;
    }

    private static List<List<string>> ReadRows(string csv)
    {
        var rows = new List<List<string>>();
        var row = new List<string>();
        var field = new StringBuilder();
        var inQuotes = false;

        for (var index = 0; index < csv.Length; index++)
        {
            var current = csv[index];
            if (current == '"')
            {
                if (inQuotes && index + 1 < csv.Length && csv[index + 1] == '"')
                {
                    field.Append('"');
                    index++;
                    continue;
                }

                inQuotes = !inQuotes;
                continue;
            }

            if (current == ',' && !inQuotes)
            {
                row.Add(field.ToString());
                field.Clear();
                continue;
            }

            if ((current == '\n' || current == '\r') && !inQuotes)
            {
                row.Add(field.ToString());
                field.Clear();
                if (row.Any(value => !string.IsNullOrWhiteSpace(value)))
                {
                    rows.Add(row);
                }

                row = [];
                if (current == '\r' && index + 1 < csv.Length && csv[index + 1] == '\n')
                {
                    index++;
                }

                continue;
            }

            field.Append(current);
        }

        row.Add(field.ToString());
        if (row.Any(value => !string.IsNullOrWhiteSpace(value)))
        {
            rows.Add(row);
        }

        return rows;
    }

    private static string NormalizeHeader(string value) => value.Trim().ToLowerInvariant().Replace(" ", "_").Replace("-", "_");

    private static string? NullIfWhiteSpace(string value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static IReadOnlyList<string> SplitList(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return [];
        }

        return value
            .Split([';', '|', ','], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(item => item.ToLowerInvariant().Replace(" ", "-"))
            .Where(item => !string.IsNullOrWhiteSpace(item))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static string? NormalizeUrl(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();
        if (trimmed.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || trimmed.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            return trimmed;
        }

        return trimmed.Contains('.') ? $"https://{trimmed}" : trimmed;
    }

    private static string? NormalizeSocialUrl(string value, string host)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();
        if (trimmed.StartsWith("@", StringComparison.Ordinal))
        {
            return $"https://{host}/{trimmed[1..]}";
        }

        if (trimmed.StartsWith(host, StringComparison.OrdinalIgnoreCase))
        {
            return $"https://{trimmed}";
        }

        return NormalizeUrl(trimmed);
    }

    private static ProviderType ParseProviderType(string value)
    {
        if (Enum.TryParse<ProviderType>(value, true, out var providerType))
        {
            return providerType;
        }

        return string.Equals(value, "it", StringComparison.OrdinalIgnoreCase)
            || string.Equals(value, "services", StringComparison.OrdinalIgnoreCase)
            || string.Equals(value, "itservice", StringComparison.OrdinalIgnoreCase)
            ? ProviderType.ITService
            : ProviderType.Beauty;
    }

    private static double? ParseDouble(string value) => double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var result) ? result : null;

    private static int? ParseInt(string value) => int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var result) ? result : null;

    private static bool ParseBool(string value) => value.Equals("true", StringComparison.OrdinalIgnoreCase)
        || value.Equals("yes", StringComparison.OrdinalIgnoreCase)
        || value.Equals("1", StringComparison.OrdinalIgnoreCase);
}
