using Appilico.Market.Application.Providers.DTOs;
using Appilico.Market.Domain;
using Appilico.Market.Domain.Common;
using Appilico.Market.Infrastructure.Data;
using Appilico.Market.Infrastructure.Services.Storage;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Providers.Services;

public class ProviderService : IProviderService
{
    private readonly AppDbContext _context;
    private readonly IStorageService _storage;

    public ProviderService(AppDbContext context, IStorageService storage)
    {
        _context = context;
        _storage = storage;
    }

    public async Task<ApiResponse<ProviderDto>> GetBySlugAsync(string slug)
    {
        var provider = await GetProviderQuery()
            .FirstOrDefaultAsync(p => p.Slug == slug && p.Status == ProviderStatus.Approved);

        if (provider == null)
            return ApiResponse<ProviderDto>.Fail("Provider not found");

        return ApiResponse<ProviderDto>.Ok(MapToDto(provider));
    }

    public async Task<ApiResponse<ProviderDto>> GetByIdAsync(Guid id)
    {
        var provider = await GetProviderQuery().FirstOrDefaultAsync(p => p.Id == id);
        if (provider == null)
            return ApiResponse<ProviderDto>.Fail("Provider not found");

        return ApiResponse<ProviderDto>.Ok(MapToDto(provider));
    }

    public async Task<ApiResponse<PaginatedResponse<ProviderListDto>>> SearchAsync(ProviderSearchRequest request)
    {
        var query = _context.Providers
            .Include(p => p.Services).ThenInclude(s => s.Category)
            .Include(p => p.GalleryImages)
            .Include(p => p.ServiceAreas).ThenInclude(sa => sa.Suburb)
            .Where(p => p.Status == ProviderStatus.Approved)
            .AsQueryable();

        // Resolve providerType alias (frontend sends ?marketplaceType=0)
        if (request.MarketplaceType.HasValue)
            query = query.Where(p => p.ProviderType == request.MarketplaceType.Value);

        // Resolve category slug to ID
        if (!request.CategoryId.HasValue && !string.IsNullOrEmpty(request.Category))
        {
            var cat = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == request.Category);
            if (cat != null)
                request.CategoryId = cat.Id;
        }

        // Filter by category (including subcategories of parent)
        if (request.CategoryId.HasValue)
        {
            var catId = request.CategoryId.Value;
            var subCatIds = await _context.Categories
                .Where(c => c.ParentCategoryId == catId)
                .Select(c => c.Id)
                .ToListAsync();
            subCatIds.Add(catId);
            query = query.Where(p => p.Services.Any(s => subCatIds.Contains(s.CategoryId)));
        }

        // Resolve suburb slug to ID
        if (!request.SuburbId.HasValue && !string.IsNullOrEmpty(request.Suburb))
        {
            var sub = await _context.Suburbs.FirstOrDefaultAsync(s => s.Slug == request.Suburb);
            if (sub != null)
                request.SuburbId = sub.Id;
        }

        if (request.SuburbId.HasValue)
            query = query.Where(p => p.ServiceAreas.Any(sa => sa.SuburbId == request.SuburbId.Value));

        if (!string.IsNullOrEmpty(request.City))
            query = query.Where(p => p.City != null && p.City.Contains(request.City));

        if (request.IsFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == request.IsFeatured.Value);

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(p =>
                p.BusinessName.ToLower().Contains(term) ||
                (p.Description != null && p.Description.ToLower().Contains(term)));
        }

        // Sorting
        query = request.SortBy?.ToLower() switch
        {
            "rating" => request.SortDescending
                ? query.OrderByDescending(p => p.AverageRating)
                : query.OrderBy(p => p.AverageRating),
            "reviews" => request.SortDescending
                ? query.OrderByDescending(p => p.TotalReviews)
                : query.OrderBy(p => p.TotalReviews),
            "name" => request.SortDescending
                ? query.OrderByDescending(p => p.BusinessName)
                : query.OrderBy(p => p.BusinessName),
            _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.AverageRating)
        };

        var totalCount = await query.CountAsync();
        var providers = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var items = providers.Select(MapToListDto).ToList();

        return ApiResponse<PaginatedResponse<ProviderListDto>>.Ok(new PaginatedResponse<ProviderListDto>
        {
            Items = items,
            Pagination = new PaginationMeta
            {
                CurrentPage = request.Page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize),
                PageSize = request.PageSize,
                TotalCount = totalCount
            }
        });
    }

    public async Task<ApiResponse<bool>> ClaimListingAsync(string slug, ClaimListingRequest request)
    {
        var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Slug == slug);
        if (provider == null)
            return ApiResponse<bool>.Fail("Business not found");

        if (provider.IsClaimed)
            return ApiResponse<bool>.Fail("This listing has already been claimed");

        // Store claim request as admin note for manual review
        provider.AdminNotes = $"CLAIM REQUEST: {request.FullName} ({request.Email}, {request.Phone}) - Role: {request.Role} - Message: {request.Message ?? "N/A"} - Date: {DateTime.UtcNow:u}";
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Your claim request has been submitted. Our team will verify your ownership and contact you within 2 business days.");
    }

    public async Task<ApiResponse<ProviderDto>> CreateAsync(string userId, CreateProviderRequest request)
    {
        // Check if user already has a provider profile
        var existing = await _context.Providers.FirstOrDefaultAsync(p => p.UserId == userId);
        if (existing != null)
            return ApiResponse<ProviderDto>.Fail("You already have a provider profile");

        var slug = GenerateSlug(request.BusinessName);

        var provider = new Provider
        {
            UserId = userId,
            BusinessName = request.BusinessName,
            Slug = slug,
            Description = request.Description,
            Phone = request.Phone,
            Email = request.Email,
            Website = request.Website,
            ProviderType = request.ProviderType,
            AddressLine1 = request.AddressLine1,
            AddressLine2 = request.AddressLine2,
            City = request.City,
            State = request.State,
            PostalCode = request.PostalCode,
            InstagramUrl = request.InstagramUrl,
            FacebookUrl = request.FacebookUrl,
            TikTokUrl = request.TikTokUrl,
            LinkedInUrl = request.LinkedInUrl,
            GitHubUrl = request.GitHubUrl,
            BusinessHoursJson = request.BusinessHoursJson,
            Status = ProviderStatus.Pending
        };

        _context.Providers.Add(provider);

        // Add service areas
        if (request.ServiceAreaSuburbIds?.Any() == true)
        {
            foreach (var suburbId in request.ServiceAreaSuburbIds)
            {
                _context.ProviderServiceAreas.Add(new ProviderServiceArea
                {
                    ProviderId = provider.Id,
                    SuburbId = suburbId
                });
            }
        }

        await _context.SaveChangesAsync();

        return ApiResponse<ProviderDto>.Ok(MapToDto(provider), "Provider profile created. Pending admin approval.");
    }

    public async Task<ApiResponse<ProviderDto>> UpdateAsync(Guid providerId, string userId, UpdateProviderRequest request)
    {
        var provider = await GetProviderQuery().FirstOrDefaultAsync(p => p.Id == providerId && p.UserId == userId);
        if (provider == null)
            return ApiResponse<ProviderDto>.Fail("Provider not found");

        if (request.BusinessName != null)
        {
            provider.BusinessName = request.BusinessName;
            provider.Slug = GenerateSlug(request.BusinessName);
        }
        if (request.Description != null) provider.Description = request.Description;
        if (request.Phone != null) provider.Phone = request.Phone;
        if (request.Email != null) provider.Email = request.Email;
        if (request.Website != null) provider.Website = request.Website;
        if (request.AddressLine1 != null) provider.AddressLine1 = request.AddressLine1;
        if (request.AddressLine2 != null) provider.AddressLine2 = request.AddressLine2;
        if (request.City != null) provider.City = request.City;
        if (request.State != null) provider.State = request.State;
        if (request.PostalCode != null) provider.PostalCode = request.PostalCode;
        if (request.InstagramUrl != null) provider.InstagramUrl = request.InstagramUrl;
        if (request.FacebookUrl != null) provider.FacebookUrl = request.FacebookUrl;
        if (request.TikTokUrl != null) provider.TikTokUrl = request.TikTokUrl;
        if (request.LinkedInUrl != null) provider.LinkedInUrl = request.LinkedInUrl;
        if (request.GitHubUrl != null) provider.GitHubUrl = request.GitHubUrl;
        if (request.BusinessHoursJson != null) provider.BusinessHoursJson = request.BusinessHoursJson;

        // Update service areas
        if (request.ServiceAreaSuburbIds != null)
        {
            var existingAreas = await _context.ProviderServiceAreas
                .Where(sa => sa.ProviderId == providerId).ToListAsync();
            _context.ProviderServiceAreas.RemoveRange(existingAreas);

            foreach (var suburbId in request.ServiceAreaSuburbIds)
            {
                _context.ProviderServiceAreas.Add(new ProviderServiceArea
                {
                    ProviderId = providerId,
                    SuburbId = suburbId
                });
            }
        }

        await _context.SaveChangesAsync();

        return ApiResponse<ProviderDto>.Ok(MapToDto(provider));
    }

    public async Task<ApiResponse<bool>> DeleteAsync(Guid providerId, string userId)
    {
        var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Id == providerId && p.UserId == userId);
        if (provider == null)
            return ApiResponse<bool>.Fail("Provider not found");

        provider.IsDeleted = true;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Provider deleted");
    }

    public async Task<ApiResponse<ProviderServiceDto>> AddServiceAsync(Guid providerId, string userId, CreateProviderServiceRequest request)
    {
        var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Id == providerId && p.UserId == userId);
        if (provider == null)
            return ApiResponse<ProviderServiceDto>.Fail("Provider not found");

        var service = new Domain.ProviderService
        {
            ProviderId = providerId,
            CategoryId = request.CategoryId,
            Name = request.Name,
            Description = request.Description,
            PriceFrom = request.PriceFrom,
            PriceTo = request.PriceTo,
            PriceNote = request.PriceNote,
            DurationMinutes = request.DurationMinutes
        };

        _context.ProviderServices.Add(service);
        await _context.SaveChangesAsync();

        var category = await _context.Categories.FindAsync(request.CategoryId);

        return ApiResponse<ProviderServiceDto>.Ok(new ProviderServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            PriceFrom = service.PriceFrom,
            PriceTo = service.PriceTo,
            PriceNote = service.PriceNote,
            DurationMinutes = service.DurationMinutes,
            CategoryId = service.CategoryId,
            CategoryName = category?.Name
        });
    }

    public async Task<ApiResponse<bool>> RemoveServiceAsync(Guid providerId, Guid serviceId, string userId)
    {
        var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Id == providerId && p.UserId == userId);
        if (provider == null)
            return ApiResponse<bool>.Fail("Provider not found");

        var service = await _context.ProviderServices
            .FirstOrDefaultAsync(s => s.Id == serviceId && s.ProviderId == providerId);
        if (service == null)
            return ApiResponse<bool>.Fail("Service not found");

        _context.ProviderServices.Remove(service);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Service removed");
    }

    public async Task<ApiResponse<GalleryImageDto>> AddGalleryImageAsync(
        Guid providerId, string userId, Stream imageStream, string fileName, string contentType, string? altText, string? caption)
    {
        var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Id == providerId && p.UserId == userId);
        if (provider == null)
            return ApiResponse<GalleryImageDto>.Fail("Provider not found");

        var result = await _storage.UploadAsync(imageStream, fileName, contentType, $"providers/{providerId}");

        var maxOrder = await _context.ProviderGalleryImages
            .Where(g => g.ProviderId == providerId)
            .MaxAsync(g => (int?)g.SortOrder) ?? -1;

        var image = new ProviderGalleryImage
        {
            ProviderId = providerId,
            ImageUrl = result.Url,
            ThumbnailUrl = result.ThumbnailUrl,
            AltText = altText ?? provider.BusinessName,
            Caption = caption,
            SortOrder = maxOrder + 1,
            IsPrimary = maxOrder < 0
        };

        _context.ProviderGalleryImages.Add(image);
        await _context.SaveChangesAsync();

        return ApiResponse<GalleryImageDto>.Ok(new GalleryImageDto
        {
            Id = image.Id,
            ImageUrl = image.ImageUrl,
            ThumbnailUrl = image.ThumbnailUrl,
            AltText = image.AltText,
            Caption = image.Caption,
            SortOrder = image.SortOrder,
            IsPrimary = image.IsPrimary
        });
    }

    public async Task<ApiResponse<bool>> RemoveGalleryImageAsync(Guid providerId, Guid imageId, string userId)
    {
        var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Id == providerId && p.UserId == userId);
        if (provider == null)
            return ApiResponse<bool>.Fail("Provider not found");

        var image = await _context.ProviderGalleryImages
            .FirstOrDefaultAsync(g => g.Id == imageId && g.ProviderId == providerId);
        if (image == null)
            return ApiResponse<bool>.Fail("Image not found");

        await _storage.DeleteAsync(image.ImageUrl);
        _context.ProviderGalleryImages.Remove(image);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Image removed");
    }

    public async Task<ApiResponse<ProviderDto>> AdminUpdateStatusAsync(Guid providerId, AdminProviderActionRequest request)
    {
        var provider = await GetProviderQuery().FirstOrDefaultAsync(p => p.Id == providerId);
        if (provider == null)
            return ApiResponse<ProviderDto>.Fail("Provider not found");

        provider.Status = request.NewStatus;
        if (request.NewStatus == ProviderStatus.Approved)
            provider.ApprovedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ApiResponse<ProviderDto>.Ok(MapToDto(provider));
    }

    public async Task<ApiResponse<PaginatedResponse<ProviderListDto>>> AdminListAsync(int page, int pageSize, string? status)
    {
        var query = _context.Providers
            .Include(p => p.Services).ThenInclude(s => s.Category)
            .Include(p => p.GalleryImages)
            .AsQueryable();

        if (Enum.TryParse<ProviderStatus>(status, true, out var parsedStatus))
            query = query.Where(p => p.Status == parsedStatus);

        var totalCount = await query.CountAsync();
        var providers = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return ApiResponse<PaginatedResponse<ProviderListDto>>.Ok(new PaginatedResponse<ProviderListDto>
        {
            Items = providers.Select(MapToListDto).ToList(),
            Pagination = new PaginationMeta
            {
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                PageSize = pageSize,
                TotalCount = totalCount
            }
        });
    }

    // --- Private helpers ---

    private IQueryable<Provider> GetProviderQuery()
    {
        return _context.Providers
            .Include(p => p.Services).ThenInclude(s => s.Category)
            .Include(p => p.GalleryImages.OrderBy(g => g.SortOrder))
            .Include(p => p.ServiceAreas).ThenInclude(sa => sa.Suburb);
    }

    private static ProviderDto MapToDto(Provider p) => new()
    {
        Id = p.Id,
        UserId = p.UserId,
        BusinessName = p.BusinessName,
        Slug = p.Slug,
        Description = p.Description,
        Phone = p.Phone,
        Email = p.Email,
        Website = p.Website,
        LogoUrl = p.LogoUrl,
        CoverImageUrl = p.CoverImageUrl,
        Status = p.Status,
        ProviderType = p.ProviderType,
        IsVerified = p.IsVerified,
        IsFeatured = p.IsFeatured,
        AverageRating = p.AverageRating,
        TotalReviews = p.TotalReviews,
        FollowerCount = p.FollowerCount,
        City = p.City,
        State = p.State,
        PostalCode = p.PostalCode,
        InstagramUrl = p.InstagramUrl,
        FacebookUrl = p.FacebookUrl,
        TikTokUrl = p.TikTokUrl,
        LinkedInUrl = p.LinkedInUrl,
        GitHubUrl = p.GitHubUrl,
        BusinessHoursJson = p.BusinessHoursJson,
        IsClaimed = p.IsClaimed,
        HasRealData = p.HasRealData,
        FullAddress = p.FullAddress,
        Tagline = p.Tagline,
        CreatedAt = p.CreatedAt,
        Services = p.Services?.Select(s => new ProviderServiceDto
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            PriceFrom = s.PriceFrom,
            PriceTo = s.PriceTo,
            PriceNote = s.PriceNote,
            DurationMinutes = s.DurationMinutes,
            CategoryId = s.CategoryId,
            CategoryName = s.Category?.Name
        }).ToList() ?? [],
        GalleryImages = p.GalleryImages?.Select(g => new GalleryImageDto
        {
            Id = g.Id,
            ImageUrl = g.ImageUrl,
            ThumbnailUrl = g.ThumbnailUrl,
            AltText = g.AltText,
            Caption = g.Caption,
            SortOrder = g.SortOrder,
            IsPrimary = g.IsPrimary
        }).ToList() ?? [],
        ServiceAreas = p.ServiceAreas?.Select(sa => sa.Suburb?.Name ?? "").Where(n => n != "").ToList() ?? []
    };

    private static ProviderListDto MapToListDto(Provider p) => new()
    {
        Id = p.Id,
        BusinessName = p.BusinessName,
        Slug = p.Slug,
        Description = p.Description?.Length > 150 ? p.Description[..150] + "..." : p.Description,
        LogoUrl = p.LogoUrl,
        CoverImageUrl = p.CoverImageUrl,
        ProviderType = p.ProviderType,
        IsVerified = p.IsVerified,
        IsFeatured = p.IsFeatured,
        AverageRating = p.AverageRating,
        TotalReviews = p.TotalReviews,
        FollowerCount = p.FollowerCount,
        City = p.City,
        State = p.State,
        Tagline = p.Tagline,
        IsClaimed = p.IsClaimed,
        Categories = p.Services?.Select(s => s.Category?.Name ?? "").Distinct().Where(n => n != "").ToList() ?? [],
        PrimaryImageUrl = p.GalleryImages?.FirstOrDefault(g => g.IsPrimary)?.ImageUrl
            ?? p.GalleryImages?.FirstOrDefault()?.ImageUrl
    };

    private string GenerateSlug(string name)
    {
        var slug = name.ToLower()
            .Replace(" ", "-")
            .Replace("&", "and")
            .Replace("'", "");

        // Remove non-alphanumeric characters except hyphens
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"-+", "-").Trim('-');

        return slug;
    }
}
