using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain;

public class Provider : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public string? LogoUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public ProviderStatus Status { get; set; } = ProviderStatus.Pending;
    public ProviderType ProviderType { get; set; }
    public bool IsVerified { get; set; }
    public bool IsFeatured { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int FollowerCount { get; set; }

    // Address
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    // Social links
    public string? InstagramUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }

    // Business hours (stored as JSON)
    public string? BusinessHoursJson { get; set; }

    // Admin notes
    public string? AdminNotes { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovedBy { get; set; }

    // Full address (for display)
    public string? FullAddress { get; set; }

    // Claim & data provenance
    public bool IsClaimed { get; set; } = false;
    public string? ClaimedByUserId { get; set; }
    public DateTime? ClaimedAt { get; set; }
    public string DataSource { get; set; } = "seeded";
    public bool HasRealData { get; set; } = false;

    // Tagline (short marketing line)
    public string? Tagline { get; set; }

    // Navigation
    public AppUser User { get; set; } = null!;
    public ICollection<ProviderService> Services { get; set; } = [];
    public ICollection<ProviderGalleryImage> GalleryImages { get; set; } = [];
    public ICollection<ProviderServiceArea> ServiceAreas { get; set; } = [];
    public ICollection<Reviews.Review> Reviews { get; set; } = [];
    public ICollection<Social.Follow> Followers { get; set; } = [];
    public ICollection<Messaging.Conversation> Conversations { get; set; } = [];

    // TODO: Stripe Connect account ID for future payments
    // TODO: Subscription tier for future monetization
    // TODO: Analytics/insights for provider dashboard
    // TODO: AI-generated profile summary
    // TODO: Verification documents
}

public enum ProviderStatus
{
    Pending = 0,
    Approved = 1,
    Suspended = 2,
    Rejected = 3
}

public enum ProviderType
{
    Beauty = 0,
    ITService = 1,
    HomeService = 2,
    Fitness = 3,
    PetService = 4,
    Cleaning = 5,
    Healthcare = 6,
    Other = 99
    // TODO: Add more marketplace types as platform expands
}
