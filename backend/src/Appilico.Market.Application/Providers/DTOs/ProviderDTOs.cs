using Appilico.Market.Domain;

namespace Appilico.Market.Application.Providers.DTOs;

public class ProviderDto
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public string? LogoUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public ProviderStatus Status { get; set; }
    public ProviderType ProviderType { get; set; }
    public bool IsVerified { get; set; }
    public bool IsFeatured { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int FollowerCount { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? InstagramUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? BusinessHoursJson { get; set; }
    public bool IsClaimed { get; set; }
    public bool HasRealData { get; set; }
    public string? FullAddress { get; set; }
    public string? Tagline { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ProviderServiceDto> Services { get; set; } = [];
    public List<GalleryImageDto> GalleryImages { get; set; } = [];
    public List<string> ServiceAreas { get; set; } = []; // Suburb names
}

public class ProviderListDto
{
    public Guid Id { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public ProviderStatus Status { get; set; }
    public ProviderType ProviderType { get; set; }
    public bool IsVerified { get; set; }
    public bool IsFeatured { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int FollowerCount { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Tagline { get; set; }
    public string? FullAddress { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public bool IsClaimed { get; set; }
    public bool HasRealData { get; set; }
    public List<string> Categories { get; set; } = [];
    public string? PrimaryImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateProviderRequest
{
    public string BusinessName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public ProviderType ProviderType { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? InstagramUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? BusinessHoursJson { get; set; }
    public List<Guid>? ServiceAreaSuburbIds { get; set; }
}

public class UpdateProviderRequest
{
    public string? BusinessName { get; set; }
    public string? Description { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? InstagramUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? TikTokUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? BusinessHoursJson { get; set; }
    public List<Guid>? ServiceAreaSuburbIds { get; set; }
}

public class ProviderServiceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? PriceFrom { get; set; }
    public decimal? PriceTo { get; set; }
    public string? PriceNote { get; set; }
    public int? DurationMinutes { get; set; }
    public string? CategoryName { get; set; }
    public Guid CategoryId { get; set; }
}

public class CreateProviderServiceRequest
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? PriceFrom { get; set; }
    public decimal? PriceTo { get; set; }
    public string? PriceNote { get; set; }
    public int? DurationMinutes { get; set; }
}

public class GalleryImageDto
{
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? AltText { get; set; }
    public string? Caption { get; set; }
    public int SortOrder { get; set; }
    public bool IsPrimary { get; set; }
}

public class AdminProviderActionRequest
{
    public ProviderStatus NewStatus { get; set; }
    public string? AdminNotes { get; set; }
}

public class AdminPromoteRequest
{
    public bool IsFeatured { get; set; }
}

public class AdminUpdateProviderRequest
{
    public string? BusinessName { get; set; }
    public string? Description { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public string? City { get; set; }
    public string? Tagline { get; set; }
    public bool? IsFeatured { get; set; }
    public bool? IsVerified { get; set; }
}

public class ProviderSearchRequest
{
    public string? SearchTerm { get; set; }
    public ProviderType? MarketplaceType { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? SuburbId { get; set; }
    public string? Category { get; set; }  // Category slug (frontend sends ?category=nails)
    public string? Suburb { get; set; }    // Suburb slug (frontend sends ?suburb=subiaco)
    public string? PostCode { get; set; }  // Postcode for proximity sorting
    public string? City { get; set; }
    public bool? IsFeatured { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
    public string? SortBy { get; set; } // "rating", "reviews", "newest", "name", "distance"
    public bool SortDescending { get; set; } = true;
}

public class ClaimListingRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "owner", "manager", "authorized"
    public string? Message { get; set; }
}
