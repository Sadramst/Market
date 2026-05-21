using Appilico.Market.Domain;
using Appilico.Market.Domain.Audit;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Categories;
using Appilico.Market.Domain.Enquiries;
using Appilico.Market.Domain.ITServices;
using Appilico.Market.Domain.Locations;
using Appilico.Market.Domain.Media;
using Appilico.Market.Domain.Messaging;
using Appilico.Market.Domain.Moderation;
using Appilico.Market.Domain.Notifications;
using Appilico.Market.Domain.Reviews;
using Appilico.Market.Domain.Seo;
using Appilico.Market.Domain.Settings;
using Appilico.Market.Domain.Social;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Auth
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    // Providers
    public DbSet<Provider> Providers => Set<Provider>();
    public DbSet<ProviderService> ProviderServices => Set<ProviderService>();
    public DbSet<ProviderGalleryImage> ProviderGalleryImages => Set<ProviderGalleryImage>();
    public DbSet<ProviderServiceArea> ProviderServiceAreas => Set<ProviderServiceArea>();

    // Categories
    public DbSet<Category> Categories => Set<Category>();

    // Locations
    public DbSet<Suburb> Suburbs => Set<Suburb>();

    // Reviews
    public DbSet<Review> Reviews => Set<Review>();

    // Social
    public DbSet<Follow> Follows => Set<Follow>();
    public DbSet<Favorite> Favorites => Set<Favorite>();

    // Messaging
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<Message> Messages => Set<Message>();

    // Notifications
    public DbSet<Notification> Notifications => Set<Notification>();

    // SEO
    public DbSet<SeoPage> SeoPages => Set<SeoPage>();

    // Moderation
    public DbSet<Report> Reports => Set<Report>();

    // Media
    public DbSet<MediaFile> MediaFiles => Set<MediaFile>();

    // Settings
    public DbSet<AppSetting> AppSettings => Set<AppSetting>();

    // Audit
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    // IT Services
    public DbSet<ServiceRequest> ServiceRequests => Set<ServiceRequest>();
    public DbSet<ServiceOffer> ServiceOffers => Set<ServiceOffer>();

    // Enquiries
    public DbSet<Enquiry> Enquiries => Set<Enquiry>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Apply all configurations from this assembly
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Global query filter for soft delete
        builder.Entity<Provider>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProviderService>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProviderGalleryImage>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Category>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Review>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Follow>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Favorite>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Conversation>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Message>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Notification>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<SeoPage>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Report>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ServiceRequest>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ServiceOffer>().HasQueryFilter(e => !e.IsDeleted);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<Domain.Common.BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
