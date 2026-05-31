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

        // Exclude clearly non-beauty businesses (medical/retail) from the beauty marketplace
        if (!request.MarketplaceType.HasValue || request.MarketplaceType.Value == ProviderType.Beauty)
        {
            query = query.Where(p =>
                !EF.Functions.ILike(p.BusinessName, "%chiropract%") &&
                !EF.Functions.ILike(p.BusinessName, "%physio%") &&
                !EF.Functions.ILike(p.BusinessName, "%osteopath%") &&
                !EF.Functions.ILike(p.BusinessName, "%massage chair%"));
        }

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

        // Resolve suburb slug, name, or postcode to ID
        if (!request.SuburbId.HasValue && !string.IsNullOrEmpty(request.Suburb))
        {
            var input = request.Suburb.Trim();
            var slugInput = input.ToLower().Replace(" ", "-");

            // Try slug match, then name match, then postcode match
            var sub = await _context.Suburbs.FirstOrDefaultAsync(s => s.Slug == slugInput)
                      ?? await _context.Suburbs.FirstOrDefaultAsync(s => s.Name.ToLower() == input.ToLower())
                      ?? await _context.Suburbs.FirstOrDefaultAsync(s => s.PostCode == input);
            if (sub != null)
                request.SuburbId = sub.Id;
        }

        if (request.SuburbId.HasValue)
        {
            // Match providers with explicit ServiceArea OR whose City matches the suburb name/postcode
            var suburbEntity = await _context.Suburbs.FindAsync(request.SuburbId.Value);
            if (suburbEntity != null)
            {
                var subName = suburbEntity.Name.ToLower();
                var subPostCode = suburbEntity.PostCode;
                query = query.Where(p =>
                    p.ServiceAreas.Any(sa => sa.SuburbId == request.SuburbId.Value)
                    || (p.City != null && p.City.ToLower() == subName)
                    || (p.PostalCode != null && p.PostalCode == subPostCode));
            }
            else
            {
                query = query.Where(p => p.ServiceAreas.Any(sa => sa.SuburbId == request.SuburbId.Value));
            }
        }

        if (!string.IsNullOrEmpty(request.City))
            query = query.Where(p => p.City != null && p.City.Contains(request.City));

        if (request.IsFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == request.IsFeatured.Value);

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLower();
            query = query.Where(p =>
                p.BusinessName.ToLower().Contains(term) ||
                (p.Description != null && p.Description.ToLower().Contains(term)) ||
                (p.Tagline != null && p.Tagline.ToLower().Contains(term)) ||
                (p.FullAddress != null && p.FullAddress.ToLower().Contains(term)) ||
                (p.City != null && p.City.ToLower().Contains(term)) ||
                p.Services.Any(s => s.Name.ToLower().Contains(term)) ||
                p.Services.Any(s => s.Category.Name.ToLower().Contains(term)) ||
                p.ServiceAreas.Any(sa => sa.Suburb.Name.ToLower().Contains(term)));
        }

        // Sorting with weighted ranking
        // For postcode proximity: resolve postcode to numeric, then sort in-memory after fetch
        bool proximitySort = request.SortBy?.ToLower() == "distance"
            && !string.IsNullOrEmpty(request.PostCode)
            && int.TryParse(request.PostCode, out _);

        if (!proximitySort)
        {
            query = request.SortBy?.ToLower() switch
            {
                "rating" => query.OrderByDescending(p => p.AverageRating)
                    .ThenByDescending(p => p.TotalReviews),
                "reviews" => query.OrderByDescending(p => p.TotalReviews)
                    .ThenByDescending(p => p.AverageRating),
                "name" => request.SortDescending
                    ? query.OrderByDescending(p => p.BusinessName)
                    : query.OrderBy(p => p.BusinessName),
                "newest" => query.OrderByDescending(p => p.CreatedAt),
                _ => query
                    .OrderByDescending(p => p.IsFeatured)
                    .ThenByDescending(p => p.IsVerified)
                    .ThenByDescending(p =>
                        p.AverageRating * 0.4 +
                        Math.Min(p.TotalReviews / 100.0, 1.0) * 0.3 +
                        (p.Description != null && p.Description.Length > 50 ? 0.1 : 0) +
                        (p.Phone != null ? 0.05 : 0) +
                        (p.Website != null ? 0.05 : 0) +
                        (p.InstagramUrl != null ? 0.05 : 0) +
                        (p.Services.Count > 0 ? 0.05 : 0)
                    )
            };
        }

        var totalCount = await query.CountAsync();

        List<Provider> providers;
        if (proximitySort && int.TryParse(request.PostCode, out var targetPc))
        {
            // Fetch all matching, then sort in memory by postcode distance
            var all = await query.ToListAsync();
            providers = all
                .OrderBy(p =>
                {
                    // Try provider's own PostalCode first, then first service area suburb postcode
                    var pcStr = p.PostalCode
                        ?? p.ServiceAreas.Select(sa => sa.Suburb?.PostCode).FirstOrDefault(x => x != null);
                    return int.TryParse(pcStr, out var pc) ? Math.Abs(pc - targetPc) : int.MaxValue;
                })
                .ThenByDescending(p => p.AverageRating)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();
        }
        else
        {
            providers = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();
        }

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

    public async Task<ApiResponse<List<ProviderListDto>>> GetRelatedAsync(string slug, int count = 6)
    {
        var provider = await _context.Providers
            .Include(p => p.Services)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.Status == ProviderStatus.Approved);
        if (provider == null)
            return ApiResponse<List<ProviderListDto>>.Fail("Provider not found");

        var categoryIds = provider.Services.Select(s => s.CategoryId).Distinct().ToList();
        if (!categoryIds.Any())
            return ApiResponse<List<ProviderListDto>>.Ok([]);

        // Find all parent category IDs for these services
        var parentCatIds = await _context.Categories
            .Where(c => categoryIds.Contains(c.Id) && c.ParentCategoryId != null)
            .Select(c => c.ParentCategoryId!.Value)
            .Distinct()
            .ToListAsync();
        var allCatIds = categoryIds.Union(parentCatIds).ToList();
        // Also get subcategories of those parents
        var subCatIds = await _context.Categories
            .Where(c => c.ParentCategoryId != null && allCatIds.Contains(c.ParentCategoryId.Value))
            .Select(c => c.Id)
            .ToListAsync();
        allCatIds = allCatIds.Union(subCatIds).Distinct().ToList();

        var related = await _context.Providers
            .Include(p => p.Services).ThenInclude(s => s.Category)
            .Include(p => p.GalleryImages)
            .Where(p => p.Id != provider.Id
                && p.Status == ProviderStatus.Approved
                && p.ProviderType == provider.ProviderType
                && p.Services.Any(s => allCatIds.Contains(s.CategoryId)))
            .OrderByDescending(p => p.AverageRating)
            .ThenByDescending(p => p.TotalReviews)
            .Take(count)
            .ToListAsync();

        return ApiResponse<List<ProviderListDto>>.Ok(related.Select(MapToListDto).ToList());
    }

    public async Task<ApiResponse<List<ProviderListDto>>> GetNearbyAsync(string slug, int count = 6)
    {
        var provider = await _context.Providers
            .Include(p => p.ServiceAreas)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.Status == ProviderStatus.Approved);
        if (provider == null)
            return ApiResponse<List<ProviderListDto>>.Fail("Provider not found");

        var suburbIds = provider.ServiceAreas.Select(sa => sa.SuburbId).ToList();

        // Fallback 1: same city
        if (!suburbIds.Any() && !string.IsNullOrEmpty(provider.City))
        {
            suburbIds = await _context.Suburbs
                .Where(s => s.IsActive && s.Name == provider.City)
                .Select(s => s.Id)
                .ToListAsync();
        }

        // Fallback 2: nearby postcodes (same prefix, max ±5 range to avoid distant matches)
        if (!suburbIds.Any() && !string.IsNullOrEmpty(provider.PostalCode))
        {
            if (int.TryParse(provider.PostalCode, out var pc))
            {
                var low = (pc - 5).ToString();
                var high = (pc + 5).ToString();
                suburbIds = await _context.Suburbs
                    .Where(s => s.IsActive
                        && string.Compare(s.PostCode, low) >= 0
                        && string.Compare(s.PostCode, high) <= 0)
                    .Select(s => s.Id)
                    .ToListAsync();
            }
        }

        // Primary query: providers sharing service areas
        var isBeauty = provider.ProviderType == ProviderType.Beauty;
        var nearby = await _context.Providers
            .Include(p => p.Services).ThenInclude(s => s.Category)
            .Include(p => p.GalleryImages)
            .Include(p => p.ServiceAreas)
            .Where(p => p.Id != provider.Id
                && p.Status == ProviderStatus.Approved
                && p.ProviderType == provider.ProviderType
                && (!isBeauty || (
                    !EF.Functions.ILike(p.BusinessName, "%chiropract%") &&
                    !EF.Functions.ILike(p.BusinessName, "%physio%") &&
                    !EF.Functions.ILike(p.BusinessName, "%osteopath%") &&
                    !EF.Functions.ILike(p.BusinessName, "%massage chair%")))
                && p.ServiceAreas.Any(sa => suburbIds.Contains(sa.SuburbId)))
            .OrderByDescending(p => p.AverageRating)
            .ThenByDescending(p => p.TotalReviews)
            .Take(count)
            .ToListAsync();

        // If not enough results, expand to same city
        if (nearby.Count < 3 && !string.IsNullOrEmpty(provider.City))
        {
            var existingIds = nearby.Select(n => n.Id).ToList();
            existingIds.Add(provider.Id);
            var additional = await _context.Providers
                .Include(p => p.Services).ThenInclude(s => s.Category)
                .Include(p => p.GalleryImages)
                .Include(p => p.ServiceAreas)
                .Where(p => !existingIds.Contains(p.Id)
                    && p.Status == ProviderStatus.Approved
                    && p.ProviderType == provider.ProviderType
                    && (!isBeauty || (
                        !EF.Functions.ILike(p.BusinessName, "%chiropract%") &&
                        !EF.Functions.ILike(p.BusinessName, "%physio%") &&
                        !EF.Functions.ILike(p.BusinessName, "%osteopath%") &&
                        !EF.Functions.ILike(p.BusinessName, "%massage chair%")))
                    && p.City == provider.City)
                .OrderByDescending(p => p.AverageRating)
                .ThenByDescending(p => p.TotalReviews)
                .Take(count - nearby.Count)
                .ToListAsync();
            nearby.AddRange(additional);
        }

        return ApiResponse<List<ProviderListDto>>.Ok(nearby.Select(MapToListDto).ToList());
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

    public async Task<ApiResponse<PaginatedResponse<ProviderListDto>>> AdminListAsync(int page, int pageSize, string? status, int? marketplaceType = null)
    {
        var query = _context.Providers
            .Include(p => p.Services).ThenInclude(s => s.Category)
            .Include(p => p.GalleryImages)
            .AsQueryable();

        if (Enum.TryParse<ProviderStatus>(status, true, out var parsedStatus))
            query = query.Where(p => p.Status == parsedStatus);

        if (marketplaceType.HasValue && Enum.IsDefined(typeof(ProviderType), marketplaceType.Value))
            query = query.Where(p => p.ProviderType == (ProviderType)marketplaceType.Value);

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

    public async Task<ApiResponse<ProviderDto>> AdminPromoteAsync(Guid providerId, bool isFeatured)
    {
        var provider = await GetProviderQuery().FirstOrDefaultAsync(p => p.Id == providerId);
        if (provider == null)
            return ApiResponse<ProviderDto>.Fail("Provider not found");

        provider.IsFeatured = isFeatured;
        await _context.SaveChangesAsync();
        return ApiResponse<ProviderDto>.Ok(MapToDto(provider));
    }

    public async Task<ApiResponse<ProviderDto>> AdminUpdateAsync(Guid providerId, AdminUpdateProviderRequest request)
    {
        var provider = await GetProviderQuery().FirstOrDefaultAsync(p => p.Id == providerId);
        if (provider == null)
            return ApiResponse<ProviderDto>.Fail("Provider not found");

        if (request.BusinessName != null) provider.BusinessName = request.BusinessName;
        if (request.Description != null) provider.Description = request.Description;
        if (request.Phone != null) provider.Phone = request.Phone;
        if (request.Email != null) provider.Email = request.Email;
        if (request.Website != null) provider.Website = request.Website;
        if (request.City != null) provider.City = request.City;
        if (request.Tagline != null) provider.Tagline = request.Tagline;
        if (request.IsFeatured.HasValue) provider.IsFeatured = request.IsFeatured.Value;
        if (request.IsVerified.HasValue) provider.IsVerified = request.IsVerified.Value;

        await _context.SaveChangesAsync();
        return ApiResponse<ProviderDto>.Ok(MapToDto(provider));
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
        Status = p.Status,
        ProviderType = p.ProviderType,
        IsVerified = p.IsVerified,
        IsFeatured = p.IsFeatured,
        AverageRating = p.AverageRating,
        TotalReviews = p.TotalReviews,
        FollowerCount = p.FollowerCount,
        City = p.City,
        State = p.State,
        FullAddress = p.FullAddress,
        Phone = p.Phone,
        Email = p.Email,
        Website = p.Website,
        Tagline = p.Tagline,
        IsClaimed = p.IsClaimed,
        HasRealData = p.HasRealData,
        Categories = p.Services?.Select(s => s.Category?.Name ?? "").Distinct().Where(n => n != "").ToList() ?? [],
        PrimaryImageUrl = p.GalleryImages?.FirstOrDefault(g => g.IsPrimary)?.ImageUrl
            ?? p.GalleryImages?.FirstOrDefault()?.ImageUrl,
        CreatedAt = p.CreatedAt
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
