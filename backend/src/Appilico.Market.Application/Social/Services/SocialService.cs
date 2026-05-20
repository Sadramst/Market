using Appilico.Market.Domain.Common;
using Appilico.Market.Domain.Social;
using Appilico.Market.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Social.Services;

public interface ISocialService
{
    Task<ApiResponse<bool>> FollowProviderAsync(string userId, Guid providerId);
    Task<ApiResponse<bool>> UnfollowProviderAsync(string userId, Guid providerId);
    Task<ApiResponse<bool>> FavoriteProviderAsync(string userId, Guid providerId);
    Task<ApiResponse<bool>> UnfavoriteProviderAsync(string userId, Guid providerId);
    Task<ApiResponse<List<Guid>>> GetUserFollowsAsync(string userId);
    Task<ApiResponse<List<Guid>>> GetUserFavoritesAsync(string userId);
}

public class SocialService : ISocialService
{
    private readonly AppDbContext _context;

    public SocialService(AppDbContext context) => _context = context;

    public async Task<ApiResponse<bool>> FollowProviderAsync(string userId, Guid providerId)
    {
        var exists = await _context.Follows.AnyAsync(f => f.UserId == userId && f.ProviderId == providerId);
        if (exists)
            return ApiResponse<bool>.Ok(true, "Already following");

        _context.Follows.Add(new Follow { UserId = userId, ProviderId = providerId });

        var provider = await _context.Providers.FindAsync(providerId);
        if (provider != null) provider.FollowerCount++;

        await _context.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Following");
    }

    public async Task<ApiResponse<bool>> UnfollowProviderAsync(string userId, Guid providerId)
    {
        var follow = await _context.Follows.FirstOrDefaultAsync(f => f.UserId == userId && f.ProviderId == providerId);
        if (follow == null)
            return ApiResponse<bool>.Ok(true, "Not following");

        _context.Follows.Remove(follow);

        var provider = await _context.Providers.FindAsync(providerId);
        if (provider != null && provider.FollowerCount > 0) provider.FollowerCount--;

        await _context.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Unfollowed");
    }

    public async Task<ApiResponse<bool>> FavoriteProviderAsync(string userId, Guid providerId)
    {
        var exists = await _context.Favorites.AnyAsync(f => f.UserId == userId && f.ProviderId == providerId);
        if (exists)
            return ApiResponse<bool>.Ok(true, "Already favorited");

        _context.Favorites.Add(new Favorite { UserId = userId, ProviderId = providerId });
        await _context.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Added to favorites");
    }

    public async Task<ApiResponse<bool>> UnfavoriteProviderAsync(string userId, Guid providerId)
    {
        var favorite = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.ProviderId == providerId);
        if (favorite == null)
            return ApiResponse<bool>.Ok(true, "Not in favorites");

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Removed from favorites");
    }

    public async Task<ApiResponse<List<Guid>>> GetUserFollowsAsync(string userId)
    {
        var follows = await _context.Follows
            .Where(f => f.UserId == userId)
            .Select(f => f.ProviderId)
            .ToListAsync();
        return ApiResponse<List<Guid>>.Ok(follows);
    }

    public async Task<ApiResponse<List<Guid>>> GetUserFavoritesAsync(string userId)
    {
        var favorites = await _context.Favorites
            .Where(f => f.UserId == userId)
            .Select(f => f.ProviderId)
            .ToListAsync();
        return ApiResponse<List<Guid>>.Ok(favorites);
    }
}
