using System.Text;
using System.Text.RegularExpressions;
using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Common;
using Appilico.Market.Domain.Locations;
using Appilico.Market.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Providers.Importing;

public interface IProviderImportService
{
    Task<ApiResponse<ProviderImportResultDto>> PreviewAsync(ProviderImportCsvRequest request);
    Task<ApiResponse<ProviderImportResultDto>> ImportAsync(ProviderImportCsvRequest request);
}

public sealed class ProviderImportService : IProviderImportService
{
    private readonly AppDbContext _context;
    private readonly IProviderImportParser _parser;
    private readonly IProviderImportValidator _validator;

    public ProviderImportService(AppDbContext context, IProviderImportParser parser, IProviderImportValidator validator)
    {
        _context = context;
        _parser = parser;
        _validator = validator;
    }

    public Task<ApiResponse<ProviderImportResultDto>> PreviewAsync(ProviderImportCsvRequest request) => BuildResultAsync(request, importRecords: false);

    public Task<ApiResponse<ProviderImportResultDto>> ImportAsync(ProviderImportCsvRequest request) => BuildResultAsync(request, importRecords: true);

    private async Task<ApiResponse<ProviderImportResultDto>> BuildResultAsync(ProviderImportCsvRequest request, bool importRecords)
    {
        if (string.IsNullOrWhiteSpace(request.Csv))
        {
            return ApiResponse<ProviderImportResultDto>.Fail("CSV content is required.");
        }

        var records = _parser.Parse(request.Csv);
        if (records.Count == 0)
        {
            return ApiResponse<ProviderImportResultDto>.Fail("CSV must include a header row and at least one provider row.");
        }

        var categoriesBySlug = await _context.Categories
            .AsNoTracking()
            .ToDictionaryAsync(category => category.Slug, StringComparer.OrdinalIgnoreCase);

        var suburbsBySlug = await _context.Suburbs
            .AsNoTracking()
            .ToDictionaryAsync(suburb => suburb.Slug, StringComparer.OrdinalIgnoreCase);

        var existingProviders = await _context.Providers
            .IgnoreQueryFilters()
            .Include(provider => provider.Services)
            .Include(provider => provider.ServiceAreas)
            .ToDictionaryAsync(provider => provider.Slug, StringComparer.OrdinalIgnoreCase);

        var result = new ProviderImportResultDto { TotalRows = records.Count };
        var seenSlugs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var record in records)
        {
            var slug = GenerateSlug(record.Slug ?? record.BusinessName);
            var validation = _validator.Validate(record, slug, categoriesBySlug, suburbsBySlug);
            var issues = validation.Issues.ToList();

            if (!seenSlugs.Add(slug))
            {
                issues.Add(new ProviderImportIssueDto
                {
                    RowNumber = record.RowNumber,
                    Field = "slug",
                    Message = $"Duplicate slug '{slug}' in this import file.",
                    Severity = ProviderImportIssueSeverity.Error
                });
            }

            var hasErrors = issues.Any(issue => issue.Severity == ProviderImportIssueSeverity.Error);
            var willUpdate = existingProviders.ContainsKey(slug);
            var row = new ProviderImportPreviewRowDto
            {
                RowNumber = record.RowNumber,
                BusinessName = record.BusinessName,
                Slug = slug,
                City = record.City ?? string.Empty,
                Status = hasErrors ? "rejected" : willUpdate ? "update" : "create",
                QualityScore = hasErrors ? Math.Min(validation.QualityScore, 50) : validation.QualityScore,
                WillUpdate = willUpdate,
                HasErrors = hasErrors,
                Issues = issues
            };

            result.Rows.Add(row);
            result.Issues.AddRange(issues);

            if (hasErrors)
            {
                result.InvalidRows++;
                if (importRecords)
                {
                    result.Skipped++;
                }
                continue;
            }

            result.ValidRows++;

            if (!importRecords)
            {
                continue;
            }

            if (willUpdate && !request.UpdateExisting)
            {
                result.Skipped++;
                row.Status = "skipped";
                continue;
            }

            await UpsertProviderAsync(record, slug, request, categoriesBySlug, suburbsBySlug, existingProviders);
            if (willUpdate)
            {
                result.Updated++;
            }
            else
            {
                result.Created++;
            }
        }

        if (importRecords && (result.Created > 0 || result.Updated > 0))
        {
            await _context.SaveChangesAsync();
        }

        return ApiResponse<ProviderImportResultDto>.Ok(result, importRecords ? "Provider import completed." : "Provider import preview generated.");
    }

    private async Task UpsertProviderAsync(
        ProviderImportRecord record,
        string slug,
        ProviderImportCsvRequest request,
        IReadOnlyDictionary<string, Category> categoriesBySlug,
        IReadOnlyDictionary<string, Suburb> suburbsBySlug,
        Dictionary<string, Provider> existingProviders)
    {
        var isNew = !existingProviders.TryGetValue(slug, out var provider);
        if (provider is null)
        {
            provider = new Provider
            {
                Id = Guid.NewGuid(),
                Slug = slug,
                UserId = await CreateShadowUserAsync(slug, record.BusinessName),
                Status = request.ApproveImported ? ProviderStatus.Approved : ProviderStatus.Pending,
                ProviderType = record.ProviderType,
                IsClaimed = false
            };
            _context.Providers.Add(provider);
            existingProviders[slug] = provider;
        }
        else if (provider.Status == ProviderStatus.Pending && request.ApproveImported)
        {
            provider.Status = ProviderStatus.Approved;
            provider.ApprovedAt = DateTime.UtcNow;
        }

        provider.BusinessName = record.BusinessName.Trim();
        provider.Description = record.Description ?? provider.Description;
        provider.Tagline = record.Tagline ?? provider.Tagline;
        provider.Phone = record.Phone ?? provider.Phone;
        provider.Email = record.Email ?? provider.Email;
        provider.Website = record.Website ?? provider.Website;
        provider.InstagramUrl = record.InstagramUrl ?? provider.InstagramUrl;
        provider.FacebookUrl = record.FacebookUrl ?? provider.FacebookUrl;
        provider.FullAddress = record.FullAddress ?? provider.FullAddress;
        provider.City = record.City ?? ResolveCity(record, suburbsBySlug) ?? provider.City;
        provider.State = record.State ?? provider.State ?? "WA";
        provider.PostalCode = record.PostalCode ?? provider.PostalCode;
        provider.ProviderType = record.ProviderType;
        provider.BusinessHoursJson = record.BusinessHoursJson ?? provider.BusinessHoursJson;
        provider.HasRealData = true;
        provider.IsVerified = record.IsVerified || provider.IsVerified;
        provider.IsFeatured = record.IsFeatured || provider.IsFeatured;
        provider.DataSource = request.SourceName ?? record.SourceName ?? provider.DataSource ?? "csv-import";
        provider.AdminNotes = BuildAdminNotes(provider.AdminNotes, request.SourceName ?? record.SourceName, record.SourceUrl);

        if (record.AverageRating.HasValue)
        {
            provider.AverageRating = record.AverageRating.Value;
        }

        if (record.TotalReviews.HasValue)
        {
            provider.TotalReviews = record.TotalReviews.Value;
        }

        if (isNew && provider.Status == ProviderStatus.Approved)
        {
            provider.ApprovedAt = DateTime.UtcNow;
        }

        await SyncServicesAsync(provider, record, request, categoriesBySlug);
        await SyncServiceAreasAsync(provider, record, request, suburbsBySlug);
    }

    private async Task<string> CreateShadowUserAsync(string slug, string businessName)
    {
        var emailSlug = slug.Length > 50 ? slug[..50] : slug;
        var email = $"listing.{emailSlug}@appilico-import.internal";
        var existingUser = await _context.Users.FirstOrDefaultAsync(user => user.Email == email);
        if (existingUser is not null)
        {
            return existingUser.Id;
        }

        var user = new AppUser
        {
            Id = Guid.NewGuid().ToString("N"),
            UserName = email,
            NormalizedUserName = email.ToUpperInvariant(),
            Email = email,
            NormalizedEmail = email.ToUpperInvariant(),
            FirstName = "Imported",
            LastName = businessName.Length > 50 ? businessName[..50] : businessName,
            EmailConfirmed = true,
            IsActive = false
        };

        _context.Users.Add(user);

        var role = await _context.Roles.FirstOrDefaultAsync(role => role.Name == UserRoles.Provider);
        if (role is not null)
        {
            _context.UserRoles.Add(new IdentityUserRole<string> { UserId = user.Id, RoleId = role.Id });
        }

        return user.Id;
    }

    private async Task SyncServicesAsync(Provider provider, ProviderImportRecord record, ProviderImportCsvRequest request, IReadOnlyDictionary<string, Category> categoriesBySlug)
    {
        if (request.ReplaceServices && provider.Services.Count > 0)
        {
            _context.ProviderServices.RemoveRange(provider.Services);
            provider.Services.Clear();
        }

        var categories = record.CategorySlugs
            .Where(categoriesBySlug.ContainsKey)
            .Select(slug => categoriesBySlug[slug])
            .ToList();

        if (categories.Count == 0)
        {
            return;
        }

        var serviceNames = record.ServiceNames.Count > 0 ? record.ServiceNames : categories.Select(category => category.Name).ToList();
        for (var index = 0; index < serviceNames.Count; index++)
        {
            var serviceName = serviceNames[index];
            var category = categories[Math.Min(index, categories.Count - 1)];
            var service = new ProviderService
            {
                Id = Guid.NewGuid(),
                ProviderId = provider.Id,
                CategoryId = category.Id,
                Name = ToTitle(serviceName),
                Description = record.Tagline,
                PriceFrom = ExtractPrice(serviceName),
                DurationMinutes = 60,
                IsActive = true
            };
            _context.ProviderServices.Add(service);
        }

        await Task.CompletedTask;
    }

    private async Task SyncServiceAreasAsync(Provider provider, ProviderImportRecord record, ProviderImportCsvRequest request, IReadOnlyDictionary<string, Suburb> suburbsBySlug)
    {
        if (request.ReplaceServiceAreas && provider.ServiceAreas.Count > 0)
        {
            _context.ProviderServiceAreas.RemoveRange(provider.ServiceAreas);
            provider.ServiceAreas.Clear();
        }

        var suburbSlugs = record.ServiceAreaSlugs.ToList();
        if (suburbSlugs.Count == 0 && !string.IsNullOrWhiteSpace(record.City))
        {
            var citySlug = GenerateSlug(record.City);
            if (suburbsBySlug.ContainsKey(citySlug))
            {
                suburbSlugs.Add(citySlug);
            }
        }

        foreach (var suburb in suburbSlugs.Where(suburbsBySlug.ContainsKey).Select(slug => suburbsBySlug[slug]).DistinctBy(suburb => suburb.Id))
        {
            var serviceArea = new ProviderServiceArea
            {
                Id = Guid.NewGuid(),
                ProviderId = provider.Id,
                SuburbId = suburb.Id
            };
            _context.ProviderServiceAreas.Add(serviceArea);
        }

        await Task.CompletedTask;
    }

    private static string? ResolveCity(ProviderImportRecord record, IReadOnlyDictionary<string, Suburb> suburbsBySlug)
    {
        var firstSuburbSlug = record.ServiceAreaSlugs.FirstOrDefault();
        return firstSuburbSlug is not null && suburbsBySlug.TryGetValue(firstSuburbSlug, out var suburb) ? suburb.Name : null;
    }

    private static string BuildAdminNotes(string? existingNotes, string? sourceName, string? sourceUrl)
    {
        var source = string.Join(" | ", new[] { sourceName, sourceUrl }.Where(value => !string.IsNullOrWhiteSpace(value)));
        if (string.IsNullOrWhiteSpace(source))
        {
            return existingNotes ?? string.Empty;
        }

        var note = $"Imported source: {source} | Checked at: {DateTime.UtcNow:O}";
        if (string.IsNullOrWhiteSpace(existingNotes))
        {
            return note;
        }

        return existingNotes.Contains(source, StringComparison.OrdinalIgnoreCase) ? existingNotes : $"{existingNotes}\n{note}";
    }

    private static decimal? ExtractPrice(string serviceName)
    {
        var match = Regex.Match(serviceName, @"\$\s*(\d+(?:\.\d{1,2})?)");
        return match.Success && decimal.TryParse(match.Groups[1].Value, out var price) ? price : null;
    }

    private static string GenerateSlug(string value)
    {
        var normalized = Regex.Replace(value.ToLowerInvariant(), @"[^a-z0-9\s-]", string.Empty);
        normalized = Regex.Replace(normalized, @"\s+", "-").Trim('-');
        return Regex.Replace(normalized, @"-+", "-");
    }

    private static string ToTitle(string value)
    {
        var words = value.Replace('-', ' ').Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var builder = new StringBuilder();
        foreach (var word in words)
        {
            if (builder.Length > 0)
            {
                builder.Append(' ');
            }

            builder.Append(char.ToUpperInvariant(word[0]));
            if (word.Length > 1)
            {
                builder.Append(word[1..]);
            }
        }

        return builder.ToString();
    }
}
