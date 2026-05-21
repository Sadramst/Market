using Appilico.Market.Application.Providers.DTOs;
using Appilico.Market.Domain;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Locations;
using Appilico.Market.Infrastructure.Data;
using Appilico.Market.Infrastructure.Services.Storage;
using Microsoft.EntityFrameworkCore;
using Moq;
using ProviderSvc = Appilico.Market.Application.Providers.Services.ProviderService;

namespace Appilico.Market.UnitTests.Providers;

public class ProviderServiceTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly ProviderSvc _service;

    public ProviderServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        var mockStorage = new Mock<IStorageService>();
        _service = new ProviderSvc(_context, mockStorage.Object);

        SeedTestData().GetAwaiter().GetResult();
    }

    private async Task SeedTestData()
    {
        // Seed categories
        var nailsCat = new Category { Id = Guid.NewGuid(), Name = "Nails", Slug = "nails", MarketplaceType = ProviderType.Beauty, IsActive = true };
        var hairCat = new Category { Id = Guid.NewGuid(), Name = "Hair", Slug = "hair", MarketplaceType = ProviderType.Beauty, IsActive = true };
        _context.Categories.AddRange(nailsCat, hairCat);

        // Seed suburbs
        var subiaco = new Suburb { Id = Guid.NewGuid(), Name = "Subiaco", Slug = "subiaco", State = "WA", PostCode = "6008", IsActive = true };
        var perth = new Suburb { Id = Guid.NewGuid(), Name = "Perth", Slug = "perth", State = "WA", PostCode = "6000", IsActive = true };
        _context.Suburbs.AddRange(subiaco, perth);

        // Seed providers
        var provider1 = new Provider
        {
            Id = Guid.NewGuid(),
            UserId = "user1",
            BusinessName = "Test Nails Studio",
            Slug = "test-nails-studio",
            Description = "A wonderful nail studio in Subiaco",
            ProviderType = ProviderType.Beauty,
            Status = ProviderStatus.Approved,
            City = "Subiaco",
            State = "WA",
            AverageRating = 4.8,
            TotalReviews = 50,
            IsFeatured = true,
            HasRealData = true,
            IsClaimed = false,
            DataSource = "seeded",
            Phone = "(08) 9380 4677",
            Website = "https://www.testnails.com.au",
            InstagramUrl = "https://instagram.com/testnails",
        };

        var provider2 = new Provider
        {
            Id = Guid.NewGuid(),
            UserId = "user2",
            BusinessName = "Perth Hair Salon",
            Slug = "perth-hair-salon",
            Description = "Expert hair services in Perth CBD",
            ProviderType = ProviderType.Beauty,
            Status = ProviderStatus.Approved,
            City = "Perth",
            State = "WA",
            AverageRating = 4.5,
            TotalReviews = 30,
            IsFeatured = false,
            HasRealData = true,
            IsClaimed = true,
            ClaimedByUserId = "user2",
            ClaimedAt = DateTime.UtcNow.AddDays(-10),
            DataSource = "seeded",
        };

        var provider3 = new Provider
        {
            Id = Guid.NewGuid(),
            UserId = "user3",
            BusinessName = "Pending Beauty",
            Slug = "pending-beauty",
            ProviderType = ProviderType.Beauty,
            Status = ProviderStatus.Pending,
            City = "Subiaco",
            State = "WA",
            HasRealData = false,
            DataSource = "seeded",
        };

        _context.Providers.AddRange(provider1, provider2, provider3);

        // Seed services for provider1
        _context.ProviderServices.AddRange(
            new Domain.ProviderService { Id = Guid.NewGuid(), ProviderId = provider1.Id, CategoryId = nailsCat.Id, Name = "Gel Manicure", PriceFrom = 65, DurationMinutes = 45, IsActive = true, SortOrder = 0 },
            new Domain.ProviderService { Id = Guid.NewGuid(), ProviderId = provider1.Id, CategoryId = nailsCat.Id, Name = "Pedicure", PriceFrom = 75, DurationMinutes = 60, IsActive = true, SortOrder = 1 }
        );

        // Seed service area
        _context.ProviderServiceAreas.Add(new ProviderServiceArea { ProviderId = provider1.Id, SuburbId = subiaco.Id });

        await _context.SaveChangesAsync();
    }

    // ===== GET BY SLUG =====

    [Fact]
    public async Task GetBySlug_ExistingProvider_ReturnsSuccess()
    {
        var result = await _service.GetBySlugAsync("test-nails-studio");

        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal("Test Nails Studio", result.Data.BusinessName);
        Assert.Equal("test-nails-studio", result.Data.Slug);
        Assert.Equal(4.8, result.Data.AverageRating);
        Assert.Equal(50, result.Data.TotalReviews);
    }

    [Fact]
    public async Task GetBySlug_NonExistentProvider_ReturnsFail()
    {
        var result = await _service.GetBySlugAsync("does-not-exist");

        Assert.False(result.Success);
        Assert.Equal("Provider not found", result.Message);
    }

    [Fact]
    public async Task GetBySlug_ReturnsExternalLinks()
    {
        var result = await _service.GetBySlugAsync("test-nails-studio");

        Assert.True(result.Success);
        Assert.Equal("(08) 9380 4677", result.Data!.Phone);
        Assert.Equal("https://www.testnails.com.au", result.Data.Website);
        Assert.Equal("https://instagram.com/testnails", result.Data.InstagramUrl);
    }

    [Fact]
    public async Task GetBySlug_ReturnsClaimStatus()
    {
        var result = await _service.GetBySlugAsync("test-nails-studio");
        Assert.False(result.Data!.IsClaimed);

        var result2 = await _service.GetBySlugAsync("perth-hair-salon");
        Assert.True(result2.Data!.IsClaimed);
    }

    [Fact]
    public async Task GetBySlug_ReturnsServices()
    {
        var result = await _service.GetBySlugAsync("test-nails-studio");

        Assert.NotNull(result.Data);
        Assert.Equal(2, result.Data.Services.Count);
        Assert.Contains(result.Data.Services, s => s.Name == "Gel Manicure" && s.PriceFrom == 65);
        Assert.Contains(result.Data.Services, s => s.Name == "Pedicure" && s.PriceFrom == 75);
    }

    // ===== SEARCH =====

    [Fact]
    public async Task Search_ReturnsOnlyApprovedProviders()
    {
        var request = new ProviderSearchRequest { MarketplaceType = ProviderType.Beauty, PageSize = 20 };
        var result = await _service.SearchAsync(request);

        Assert.True(result.Success);
        var items = result.Data!.Items;
        // Only approved providers (provider1 and provider2, not pending provider3)
        Assert.Equal(2, items.Count);
        Assert.DoesNotContain(items, p => p.Slug == "pending-beauty");
    }

    [Fact]
    public async Task Search_ByCity_FiltersCorrectly()
    {
        var request = new ProviderSearchRequest { City = "Perth", MarketplaceType = ProviderType.Beauty };
        var result = await _service.SearchAsync(request);

        Assert.True(result.Success);
        Assert.Single(result.Data!.Items);
        Assert.Equal("Perth Hair Salon", result.Data.Items[0].BusinessName);
    }

    [Fact]
    public async Task Search_BySearchTerm_FiltersCorrectly()
    {
        var request = new ProviderSearchRequest { SearchTerm = "nails", MarketplaceType = ProviderType.Beauty };
        var result = await _service.SearchAsync(request);

        Assert.True(result.Success);
        Assert.Single(result.Data!.Items);
        Assert.Equal("Test Nails Studio", result.Data.Items[0].BusinessName);
    }

    [Fact]
    public async Task Search_Featured_ReturnsOnlyFeatured()
    {
        var request = new ProviderSearchRequest { IsFeatured = true, MarketplaceType = ProviderType.Beauty };
        var result = await _service.SearchAsync(request);

        Assert.True(result.Success);
        Assert.Single(result.Data!.Items);
        Assert.Equal("Test Nails Studio", result.Data.Items[0].BusinessName);
    }

    [Fact]
    public async Task Search_SortByRating_OrdersCorrectly()
    {
        var request = new ProviderSearchRequest { SortBy = "rating", SortDescending = true, MarketplaceType = ProviderType.Beauty };
        var result = await _service.SearchAsync(request);

        Assert.True(result.Success);
        Assert.True(result.Data!.Items[0].AverageRating >= result.Data.Items[1].AverageRating);
    }

    [Fact]
    public async Task Search_Pagination_WorksCorrectly()
    {
        var request = new ProviderSearchRequest { Page = 1, PageSize = 1, MarketplaceType = ProviderType.Beauty };
        var result = await _service.SearchAsync(request);

        Assert.True(result.Success);
        Assert.Single(result.Data!.Items);
        Assert.Equal(2, result.Data.Pagination!.TotalCount);
        Assert.Equal(2, result.Data.Pagination.TotalPages);
    }

    // ===== CLAIM =====

    [Fact]
    public async Task ClaimListing_UnclaimedProvider_Succeeds()
    {
        var request = new ClaimListingRequest
        {
            FullName = "Test Owner",
            Email = "owner@testnails.com.au",
            Phone = "0412 345 678",
            Role = "owner",
            Message = "I am the owner"
        };

        var result = await _service.ClaimListingAsync("test-nails-studio", request);

        Assert.True(result.Success);
        Assert.Contains("submitted", result.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ClaimListing_AlreadyClaimed_Fails()
    {
        var request = new ClaimListingRequest
        {
            FullName = "Another Person",
            Email = "other@example.com",
            Phone = "0400 000 000",
            Role = "owner"
        };

        var result = await _service.ClaimListingAsync("perth-hair-salon", request);

        Assert.False(result.Success);
        Assert.Contains("already been claimed", result.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ClaimListing_NonExistentProvider_Fails()
    {
        var request = new ClaimListingRequest
        {
            FullName = "Test",
            Email = "test@test.com",
            Phone = "0400 000 000",
            Role = "owner"
        };

        var result = await _service.ClaimListingAsync("non-existent-business", request);

        Assert.False(result.Success);
        Assert.Contains("not found", result.Message, StringComparison.OrdinalIgnoreCase);
    }

    // ===== DTO MAPPING =====

    [Fact]
    public async Task GetBySlug_MapsAllDtoFieldsCorrectly()
    {
        var result = await _service.GetBySlugAsync("test-nails-studio");

        Assert.NotNull(result.Data);
        var dto = result.Data;
        Assert.Equal("Subiaco", dto.City);
        Assert.Equal("WA", dto.State);
        Assert.True(dto.IsFeatured);
        Assert.True(dto.HasRealData);
        Assert.False(dto.IsClaimed);
    }

    [Fact]
    public async Task Search_ListDto_IncludesCategories()
    {
        var request = new ProviderSearchRequest { SearchTerm = "nails", MarketplaceType = ProviderType.Beauty };
        var result = await _service.SearchAsync(request);

        Assert.True(result.Success);
        var item = result.Data!.Items[0];
        Assert.Contains("Nails", item.Categories);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
