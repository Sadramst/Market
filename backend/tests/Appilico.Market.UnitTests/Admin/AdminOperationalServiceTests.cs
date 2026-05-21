using Appilico.Market.Application.Admin.Services;
using Appilico.Market.Application.Reviews.Services;
using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Enquiries;
using Appilico.Market.Domain.Locations;
using Appilico.Market.Domain.Moderation;
using Appilico.Market.Domain.Reviews;
using Appilico.Market.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.UnitTests.Admin;

public class AdminOperationalServiceTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly Provider _provider;

    public AdminOperationalServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _provider = SeedDataAsync().GetAwaiter().GetResult();
    }

    [Fact]
    public async Task DashboardStats_ReturnsOperationalCounts()
    {
        var service = new AdminDashboardService(_context);

        var result = await service.GetStatsAsync();

        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal(2, result.Data.TotalProviders);
        Assert.Equal(1, result.Data.ApprovedProviders);
        Assert.Equal(1, result.Data.PendingProviders);
        Assert.Equal(1, result.Data.BeautyProviders);
        Assert.Equal(1, result.Data.ItProviders);
        Assert.Equal(2, result.Data.TotalReviews);
        Assert.Equal(1, result.Data.PendingReviews);
        Assert.Equal(1, result.Data.TotalEnquiries);
        Assert.Equal(1, result.Data.NewEnquiries);
        Assert.Equal(1, result.Data.TotalReports);
        Assert.Equal(1, result.Data.PendingReports);
        Assert.NotEmpty(result.Data.RecentActivity);
    }

    [Fact]
    public async Task ReviewAdminList_FiltersByStatusAndIncludesProviderName()
    {
        var service = new ReviewService(_context);

        var result = await service.GetAllAsync(page: 1, pageSize: 20, status: "Pending");

        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Single(result.Data.Items);
        Assert.Equal(ReviewStatus.Pending, result.Data.Items[0].Status);
        Assert.Equal(_provider.BusinessName, result.Data.Items[0].ProviderName);
    }

    [Fact]
    public async Task PublicReviews_CanSubmitMultipleAnonymousReviewsForSameProvider()
    {
        var service = new ReviewService(_context);

        var first = await service.CreatePublicAsync(new CreatePublicReviewRequest
        {
            ProviderId = _provider.Id,
            AuthorName = "Ava",
            Rating = 5,
            Comment = "Lovely team and a very polished service experience."
        });

        var second = await service.CreatePublicAsync(new CreatePublicReviewRequest
        {
            ProviderId = _provider.Id,
            AuthorName = "Mia",
            Rating = 4,
            Comment = "Friendly staff and the appointment felt calm and professional."
        });

        Assert.True(first.Success);
        Assert.True(second.Success);
        Assert.True(await _context.Reviews.CountAsync(r => r.ProviderId == _provider.Id && r.UserId == "anonymous") >= 2);
    }

    private async Task<Provider> SeedDataAsync()
    {
        var adminRole = new IdentityRole(UserRoles.SuperAdmin) { Id = "role-admin", NormalizedName = UserRoles.SuperAdmin.ToUpperInvariant() };
        _context.Roles.Add(adminRole);

        _context.Users.AddRange(
            new AppUser { Id = "admin-user", UserName = "admin@appilico.com.au", Email = "admin@appilico.com.au", FirstName = "Admin", LastName = "User", IsActive = true },
            new AppUser { Id = "customer-user", UserName = "customer@appilico.com.au", Email = "customer@appilico.com.au", FirstName = "Customer", LastName = "User", IsActive = true },
            new AppUser { Id = "anonymous", UserName = "anonymous-reviews@appilico.internal", Email = "anonymous-reviews@appilico.internal", FirstName = "Guest", LastName = "Reviewer", IsActive = false }
        );
        _context.UserRoles.Add(new IdentityUserRole<string> { UserId = "admin-user", RoleId = adminRole.Id });

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Nails",
            Slug = "nails",
            MarketplaceType = ProviderType.Beauty,
            IsActive = true
        };
        _context.Categories.Add(category);

        _context.Suburbs.Add(new Suburb
        {
            Id = Guid.NewGuid(),
            Name = "Subiaco",
            Slug = "subiaco",
            State = "WA",
            PostCode = "6008",
            IsActive = true
        });

        var beautyProvider = new Provider
        {
            Id = Guid.NewGuid(),
            UserId = "provider-user",
            BusinessName = "Studio Luxe Nails",
            Slug = "studio-luxe-nails",
            ProviderType = ProviderType.Beauty,
            Status = ProviderStatus.Approved,
            City = "Subiaco",
            State = "WA",
            DataSource = "test"
        };

        var itProvider = new Provider
        {
            Id = Guid.NewGuid(),
            UserId = "it-provider-user",
            BusinessName = "Perth Cloud Studio",
            Slug = "perth-cloud-studio",
            ProviderType = ProviderType.ITService,
            Status = ProviderStatus.Pending,
            City = "Perth",
            State = "WA",
            DataSource = "test"
        };
        _context.Providers.AddRange(beautyProvider, itProvider);

        _context.Reviews.AddRange(
            new Review { Id = Guid.NewGuid(), ProviderId = beautyProvider.Id, UserId = "customer-user", Rating = 5, Title = "Great", Comment = "Excellent work", Status = ReviewStatus.Approved },
            new Review { Id = Guid.NewGuid(), ProviderId = beautyProvider.Id, UserId = "anonymous", Rating = 4, Title = "Pending reviewer", Comment = "Waiting for moderation", Status = ReviewStatus.Pending }
        );

        _context.Enquiries.Add(new Enquiry
        {
            Id = Guid.NewGuid(),
            ProviderId = beautyProvider.Id,
            CustomerName = "Local Customer",
            CustomerEmail = "local@example.com",
            Message = "I would like to book a premium appointment next week.",
            Status = EnquiryStatus.New
        });

        _context.Reports.Add(new Report
        {
            Id = Guid.NewGuid(),
            ReporterId = "customer-user",
            TargetType = ReportTargetType.Provider,
            TargetId = beautyProvider.Id,
            Reason = ReportReason.MisleadingInfo,
            Status = ReportStatus.Pending
        });

        await _context.SaveChangesAsync();
        return beautyProvider;
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}