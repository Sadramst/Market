using Appilico.Market.Application.Providers.Importing;
using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Locations;
using Appilico.Market.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.UnitTests.Providers;

public sealed class ProviderImportServiceTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly ProviderImportService _service;
    private readonly Guid _nailsCategoryId = Guid.NewGuid();
    private readonly Guid _subiacoId = Guid.NewGuid();

    public ProviderImportServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _service = new ProviderImportService(_context, new CsvProviderImportParser(), new ProviderImportValidator());

        SeedAsync().GetAwaiter().GetResult();
    }

    [Fact]
    public async Task PreviewAsync_MissingSourceAndContact_ReturnsValidationIssues()
    {
        var csv = "business_name,category_slugs,service_area_slugs\nTest Studio,nails,subiaco";

        var result = await _service.PreviewAsync(new ProviderImportCsvRequest { Csv = csv });

        Assert.True(result.Success);
        Assert.Equal(1, result.Data!.InvalidRows);
        Assert.Contains(result.Data.Issues, issue => issue.Field == "source_url");
        Assert.Contains(result.Data.Issues, issue => issue.Field == "contact");
    }

    [Fact]
    public async Task ImportAsync_ValidRow_CreatesPendingRealProviderWithServicesAndArea()
    {
        var csv = string.Join('\n',
            "business_name,category_slugs,service_area_slugs,services,source_name,source_url,website,instagram,phone,city,state,post_code,rating,review_count",
            "Subiaco Glow,nails,subiaco,gel manicure;pedicure,Google Business Profile,https://example.com/subiaco-glow,https://subiacoglow.example,@subiacoglow,(08) 9000 1111,Subiaco,WA,6008,4.7,28");

        var result = await _service.ImportAsync(new ProviderImportCsvRequest { Csv = csv, SourceName = "manual-vetted-csv" });

        Assert.True(result.Success);
        Assert.Equal(1, result.Data!.Created);

        var provider = await _context.Providers
            .Include(item => item.Services)
            .Include(item => item.ServiceAreas)
            .SingleAsync(item => item.Slug == "subiaco-glow");

        Assert.Equal(ProviderStatus.Pending, provider.Status);
        Assert.True(provider.HasRealData);
        Assert.Equal("manual-vetted-csv", provider.DataSource);
        Assert.Equal("https://instagram.com/subiacoglow", provider.InstagramUrl);
        Assert.Equal(2, provider.Services.Count);
        Assert.Contains(provider.ServiceAreas, area => area.SuburbId == _subiacoId);
        Assert.Contains("https://example.com/subiaco-glow", provider.AdminNotes);
    }

    [Fact]
    public async Task ImportAsync_ExistingSlug_UpdatesProviderWithoutCreatingDuplicate()
    {
        _context.Providers.Add(new Provider
        {
            Id = Guid.NewGuid(),
            UserId = "existing-user",
            BusinessName = "Existing Glow",
            Slug = "existing-glow",
            ProviderType = ProviderType.Beauty,
            Status = ProviderStatus.Pending,
            City = "Subiaco",
            State = "WA",
            HasRealData = false
        });
        await _context.SaveChangesAsync();

        var csv = string.Join('\n',
            "business_name,slug,category_slugs,service_area_slugs,source_url,website,phone",
            "Existing Glow,existing-glow,nails,subiaco,https://example.com/existing,https://existing.example,(08) 9000 2222");

        var result = await _service.ImportAsync(new ProviderImportCsvRequest { Csv = csv, ApproveImported = true });

        Assert.True(result.Success);
        Assert.Equal(1, result.Data!.Updated);
        Assert.Equal(1, await _context.Providers.CountAsync(item => item.Slug == "existing-glow"));

        var provider = await _context.Providers.SingleAsync(item => item.Slug == "existing-glow");
        Assert.True(provider.HasRealData);
        Assert.Equal(ProviderStatus.Approved, provider.Status);
        Assert.Equal("https://existing.example", provider.Website);
    }

    private async Task SeedAsync()
    {
        _context.Roles.Add(new IdentityRole { Id = Guid.NewGuid().ToString("N"), Name = UserRoles.Provider, NormalizedName = UserRoles.Provider.ToUpperInvariant() });
        _context.Categories.Add(new Category { Id = _nailsCategoryId, Name = "Nails", Slug = "nails", MarketplaceType = ProviderType.Beauty, IsActive = true });
        _context.Suburbs.Add(new Suburb { Id = _subiacoId, Name = "Subiaco", Slug = "subiaco", State = "WA", PostCode = "6008", IsActive = true });
        await _context.SaveChangesAsync();
    }

    public void Dispose() => _context.Dispose();
}
