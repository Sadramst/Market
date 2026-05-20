using Appilico.Market.Domain;
using Appilico.Market.Domain.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Appilico.Market.Infrastructure.Data.Configurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.Property(u => u.FirstName).HasMaxLength(100).IsRequired();
        builder.Property(u => u.LastName).HasMaxLength(100).IsRequired();
        builder.Property(u => u.Avatar).HasMaxLength(500);
    }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasIndex(t => t.Token).IsUnique();
        builder.Property(t => t.Token).HasMaxLength(500).IsRequired();
        builder.HasOne(t => t.User).WithMany(u => u.RefreshTokens).HasForeignKey(t => t.UserId);
    }
}

public class ProviderConfiguration : IEntityTypeConfiguration<Provider>
{
    public void Configure(EntityTypeBuilder<Provider> builder)
    {
        builder.HasIndex(p => p.Slug).IsUnique();
        builder.HasIndex(p => p.Status);
        builder.HasIndex(p => p.ProviderType);
        builder.HasIndex(p => p.IsFeatured);

        builder.Property(p => p.BusinessName).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Slug).HasMaxLength(250).IsRequired();
        builder.Property(p => p.Description).HasMaxLength(2000);
        builder.Property(p => p.Phone).HasMaxLength(20);
        builder.Property(p => p.Email).HasMaxLength(200);
        builder.Property(p => p.Website).HasMaxLength(500);
        builder.Property(p => p.LogoUrl).HasMaxLength(500);
        builder.Property(p => p.CoverImageUrl).HasMaxLength(500);
        builder.Property(p => p.AddressLine1).HasMaxLength(200);
        builder.Property(p => p.AddressLine2).HasMaxLength(200);
        builder.Property(p => p.City).HasMaxLength(100);
        builder.Property(p => p.State).HasMaxLength(10);
        builder.Property(p => p.PostalCode).HasMaxLength(10);
        builder.Property(p => p.InstagramUrl).HasMaxLength(500);
        builder.Property(p => p.FacebookUrl).HasMaxLength(500);
        builder.Property(p => p.TikTokUrl).HasMaxLength(500);
        builder.Property(p => p.LinkedInUrl).HasMaxLength(500);
        builder.Property(p => p.GitHubUrl).HasMaxLength(500);

        builder.HasOne(p => p.User).WithOne(u => u.Provider).HasForeignKey<Provider>(p => p.UserId);

        // Full-text search index (PostgreSQL)
        // TODO: Migrate to Elasticsearch/OpenSearch for advanced search
        builder.HasIndex(p => new { p.BusinessName, p.City }).HasMethod("gin")
            .IsTsVectorExpressionIndex("english");
    }
}

public class ProviderServiceConfiguration : IEntityTypeConfiguration<ProviderService>
{
    public void Configure(EntityTypeBuilder<ProviderService> builder)
    {
        builder.Property(s => s.Name).HasMaxLength(200).IsRequired();
        builder.Property(s => s.Description).HasMaxLength(1000);
        builder.Property(s => s.PriceFrom).HasPrecision(10, 2);
        builder.Property(s => s.PriceTo).HasPrecision(10, 2);
        builder.Property(s => s.PriceNote).HasMaxLength(100);

        builder.HasOne(s => s.Provider).WithMany(p => p.Services).HasForeignKey(s => s.ProviderId);
        builder.HasOne(s => s.Category).WithMany(c => c.ProviderServices).HasForeignKey(s => s.CategoryId);
    }
}

public class ProviderGalleryImageConfiguration : IEntityTypeConfiguration<ProviderGalleryImage>
{
    public void Configure(EntityTypeBuilder<ProviderGalleryImage> builder)
    {
        builder.Property(i => i.ImageUrl).HasMaxLength(500).IsRequired();
        builder.Property(i => i.ThumbnailUrl).HasMaxLength(500);
        builder.Property(i => i.AltText).HasMaxLength(200);
        builder.Property(i => i.Caption).HasMaxLength(500);

        builder.HasOne(i => i.Provider).WithMany(p => p.GalleryImages).HasForeignKey(i => i.ProviderId);
    }
}

public class ProviderServiceAreaConfiguration : IEntityTypeConfiguration<ProviderServiceArea>
{
    public void Configure(EntityTypeBuilder<ProviderServiceArea> builder)
    {
        builder.HasIndex(sa => new { sa.ProviderId, sa.SuburbId }).IsUnique();
        builder.HasOne(sa => sa.Provider).WithMany(p => p.ServiceAreas).HasForeignKey(sa => sa.ProviderId);
        builder.HasOne(sa => sa.Suburb).WithMany(s => s.ServiceAreas).HasForeignKey(sa => sa.SuburbId);
    }
}

public class CategoryConfiguration : IEntityTypeConfiguration<Domain.Categories.Category>
{
    public void Configure(EntityTypeBuilder<Domain.Categories.Category> builder)
    {
        builder.HasIndex(c => c.Slug).IsUnique();
        builder.HasIndex(c => c.MarketplaceType);

        builder.Property(c => c.Name).HasMaxLength(100).IsRequired();
        builder.Property(c => c.Slug).HasMaxLength(150).IsRequired();
        builder.Property(c => c.Description).HasMaxLength(500);
        builder.Property(c => c.ImageUrl).HasMaxLength(500);
        builder.Property(c => c.IconName).HasMaxLength(50);

        builder.HasOne(c => c.ParentCategory).WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class SuburbConfiguration : IEntityTypeConfiguration<Domain.Locations.Suburb>
{
    public void Configure(EntityTypeBuilder<Domain.Locations.Suburb> builder)
    {
        builder.HasIndex(s => s.Slug).IsUnique();
        builder.HasIndex(s => s.State);
        builder.HasIndex(s => s.PostCode);

        builder.Property(s => s.Name).HasMaxLength(100).IsRequired();
        builder.Property(s => s.Slug).HasMaxLength(150).IsRequired();
        builder.Property(s => s.State).HasMaxLength(10).IsRequired();
        builder.Property(s => s.PostCode).HasMaxLength(10).IsRequired();
        builder.Property(s => s.SeoDescription).HasMaxLength(500);
    }
}

public class ReviewConfiguration : IEntityTypeConfiguration<Domain.Reviews.Review>
{
    public void Configure(EntityTypeBuilder<Domain.Reviews.Review> builder)
    {
        builder.HasIndex(r => new { r.UserId, r.ProviderId }).IsUnique();
        builder.HasIndex(r => r.Status);

        builder.Property(r => r.Title).HasMaxLength(200);
        builder.Property(r => r.Comment).HasMaxLength(2000);
        builder.Property(r => r.AdminNotes).HasMaxLength(500);

        builder.HasOne(r => r.User).WithMany(u => u.Reviews).HasForeignKey(r => r.UserId);
        builder.HasOne(r => r.Provider).WithMany(p => p.Reviews).HasForeignKey(r => r.ProviderId);
    }
}

public class FollowConfiguration : IEntityTypeConfiguration<Domain.Social.Follow>
{
    public void Configure(EntityTypeBuilder<Domain.Social.Follow> builder)
    {
        builder.HasIndex(f => new { f.UserId, f.ProviderId }).IsUnique();
        builder.HasOne(f => f.User).WithMany(u => u.Follows).HasForeignKey(f => f.UserId);
        builder.HasOne(f => f.Provider).WithMany(p => p.Followers).HasForeignKey(f => f.ProviderId);
    }
}

public class FavoriteConfiguration : IEntityTypeConfiguration<Domain.Social.Favorite>
{
    public void Configure(EntityTypeBuilder<Domain.Social.Favorite> builder)
    {
        builder.HasIndex(f => new { f.UserId, f.ProviderId }).IsUnique();
        builder.HasOne(f => f.User).WithMany(u => u.Favorites).HasForeignKey(f => f.UserId);
        builder.HasOne(f => f.Provider).WithMany().HasForeignKey(f => f.ProviderId);
    }
}

public class ConversationConfiguration : IEntityTypeConfiguration<Domain.Messaging.Conversation>
{
    public void Configure(EntityTypeBuilder<Domain.Messaging.Conversation> builder)
    {
        builder.HasIndex(c => new { c.ProviderId, c.CustomerId });
        builder.Property(c => c.Subject).HasMaxLength(200);

        builder.HasOne(c => c.Provider).WithMany(p => p.Conversations).HasForeignKey(c => c.ProviderId);
        builder.HasOne(c => c.Customer).WithMany().HasForeignKey(c => c.CustomerId);
    }
}

public class MessageConfiguration : IEntityTypeConfiguration<Domain.Messaging.Message>
{
    public void Configure(EntityTypeBuilder<Domain.Messaging.Message> builder)
    {
        builder.Property(m => m.Content).HasMaxLength(5000).IsRequired();
        builder.HasOne(m => m.Conversation).WithMany(c => c.Messages).HasForeignKey(m => m.ConversationId);
        builder.HasOne(m => m.Sender).WithMany().HasForeignKey(m => m.SenderId);
    }
}

public class NotificationConfiguration : IEntityTypeConfiguration<Domain.Notifications.Notification>
{
    public void Configure(EntityTypeBuilder<Domain.Notifications.Notification> builder)
    {
        builder.HasIndex(n => new { n.UserId, n.IsRead });
        builder.Property(n => n.Title).HasMaxLength(200).IsRequired();
        builder.Property(n => n.Message).HasMaxLength(500);
        builder.Property(n => n.ActionUrl).HasMaxLength(500);
        builder.Property(n => n.ReferenceType).HasMaxLength(50);

        builder.HasOne(n => n.User).WithMany(u => u.Notifications).HasForeignKey(n => n.UserId);
    }
}

public class SeoPageConfiguration : IEntityTypeConfiguration<Domain.Seo.SeoPage>
{
    public void Configure(EntityTypeBuilder<Domain.Seo.SeoPage> builder)
    {
        builder.HasIndex(s => s.Slug).IsUnique();
        builder.HasIndex(s => s.PageType);
        builder.HasIndex(s => s.MarketplaceType);

        builder.Property(s => s.PageType).HasMaxLength(50).IsRequired();
        builder.Property(s => s.Slug).HasMaxLength(300).IsRequired();
        builder.Property(s => s.Title).HasMaxLength(200).IsRequired();
        builder.Property(s => s.MetaDescription).HasMaxLength(500);
        builder.Property(s => s.MetaKeywords).HasMaxLength(500);
        builder.Property(s => s.H1).HasMaxLength(200);

        builder.HasOne(s => s.Suburb).WithMany(sub => sub.SeoPages).HasForeignKey(s => s.SuburbId);
        builder.HasOne(s => s.Category).WithMany().HasForeignKey(s => s.CategoryId);
    }
}

public class ReportConfiguration : IEntityTypeConfiguration<Domain.Moderation.Report>
{
    public void Configure(EntityTypeBuilder<Domain.Moderation.Report> builder)
    {
        builder.HasIndex(r => r.Status);
        builder.Property(r => r.Description).HasMaxLength(1000);
        builder.Property(r => r.ResolutionNotes).HasMaxLength(1000);
        builder.HasOne(r => r.Reporter).WithMany().HasForeignKey(r => r.ReporterId);
    }
}

public class MediaFileConfiguration : IEntityTypeConfiguration<Domain.Media.MediaFile>
{
    public void Configure(EntityTypeBuilder<Domain.Media.MediaFile> builder)
    {
        builder.Property(m => m.FileName).HasMaxLength(300).IsRequired();
        builder.Property(m => m.Url).HasMaxLength(500).IsRequired();
        builder.Property(m => m.ThumbnailUrl).HasMaxLength(500);
        builder.Property(m => m.ContentType).HasMaxLength(100).IsRequired();
        builder.Property(m => m.AltText).HasMaxLength(200);
        builder.Property(m => m.Folder).HasMaxLength(100);
    }
}

public class AppSettingConfiguration : IEntityTypeConfiguration<Domain.Settings.AppSetting>
{
    public void Configure(EntityTypeBuilder<Domain.Settings.AppSetting> builder)
    {
        builder.HasIndex(s => s.Key).IsUnique();
        builder.Property(s => s.Key).HasMaxLength(100).IsRequired();
        builder.Property(s => s.Value).HasMaxLength(500).IsRequired();
        builder.Property(s => s.Group).HasMaxLength(50);
        builder.Property(s => s.Description).HasMaxLength(200);
    }
}

public class AuditLogConfiguration : IEntityTypeConfiguration<Domain.Audit.AuditLog>
{
    public void Configure(EntityTypeBuilder<Domain.Audit.AuditLog> builder)
    {
        builder.HasIndex(a => a.UserId);
        builder.HasIndex(a => a.CreatedAt);
        builder.Property(a => a.Action).HasMaxLength(100).IsRequired();
        builder.Property(a => a.EntityType).HasMaxLength(100).IsRequired();
        builder.Property(a => a.IpAddress).HasMaxLength(45);
        builder.Property(a => a.UserAgent).HasMaxLength(500);
    }
}

public class ServiceRequestConfiguration : IEntityTypeConfiguration<Domain.ITServices.ServiceRequest>
{
    public void Configure(EntityTypeBuilder<Domain.ITServices.ServiceRequest> builder)
    {
        builder.HasIndex(r => r.Status);
        builder.Property(r => r.Title).HasMaxLength(200).IsRequired();
        builder.Property(r => r.Description).HasMaxLength(5000).IsRequired();
        builder.Property(r => r.BudgetMin).HasPrecision(10, 2);
        builder.Property(r => r.BudgetMax).HasPrecision(10, 2);
        builder.Property(r => r.BudgetNote).HasMaxLength(200);
        builder.Property(r => r.Location).HasMaxLength(100);

        builder.HasOne(r => r.Customer).WithMany().HasForeignKey(r => r.CustomerId);
        builder.HasOne(r => r.Category).WithMany().HasForeignKey(r => r.CategoryId);
    }
}

public class ServiceOfferConfiguration : IEntityTypeConfiguration<Domain.ITServices.ServiceOffer>
{
    public void Configure(EntityTypeBuilder<Domain.ITServices.ServiceOffer> builder)
    {
        builder.HasIndex(o => new { o.ServiceRequestId, o.ProviderId }).IsUnique();
        builder.Property(o => o.ProposedPrice).HasPrecision(10, 2);
        builder.Property(o => o.Message).HasMaxLength(2000);

        builder.HasOne(o => o.ServiceRequest).WithMany(r => r.Offers).HasForeignKey(o => o.ServiceRequestId);
        builder.HasOne(o => o.Provider).WithMany().HasForeignKey(o => o.ProviderId);
    }
}
