using Appilico.Market.Application.Providers.DTOs;
using Appilico.Market.Domain.Common;

namespace Appilico.Market.Application.Providers.Services;

public interface IProviderService
{
    // Public / Customer
    Task<ApiResponse<ProviderDto>> GetBySlugAsync(string slug);
    Task<ApiResponse<ProviderDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<PaginatedResponse<ProviderListDto>>> SearchAsync(ProviderSearchRequest request);
    Task<ApiResponse<List<ProviderListDto>>> GetRelatedAsync(string slug, int count = 6);
    Task<ApiResponse<List<ProviderListDto>>> GetNearbyAsync(string slug, int count = 6);

    // Claim
    Task<ApiResponse<bool>> ClaimListingAsync(string slug, ClaimListingRequest request);

    // Provider owner
    Task<ApiResponse<ProviderDto>> CreateAsync(string userId, CreateProviderRequest request);
    Task<ApiResponse<ProviderDto>> UpdateAsync(Guid providerId, string userId, UpdateProviderRequest request);
    Task<ApiResponse<bool>> DeleteAsync(Guid providerId, string userId);

    // Services
    Task<ApiResponse<ProviderServiceDto>> AddServiceAsync(Guid providerId, string userId, CreateProviderServiceRequest request);
    Task<ApiResponse<bool>> RemoveServiceAsync(Guid providerId, Guid serviceId, string userId);

    // Gallery
    Task<ApiResponse<GalleryImageDto>> AddGalleryImageAsync(Guid providerId, string userId, Stream imageStream, string fileName, string contentType, string? altText, string? caption);
    Task<ApiResponse<bool>> RemoveGalleryImageAsync(Guid providerId, Guid imageId, string userId);

    // Admin
    Task<ApiResponse<ProviderDto>> AdminUpdateStatusAsync(Guid providerId, AdminProviderActionRequest request);
    Task<ApiResponse<PaginatedResponse<ProviderListDto>>> AdminListAsync(int page, int pageSize, string? status);
}
