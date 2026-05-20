using Appilico.Market.Domain.Common;

namespace Appilico.Market.Application.Auth.Services;

public interface IAuthService
{
    Task<ApiResponse<Application.Auth.DTOs.AuthResponse>> RegisterAsync(DTOs.RegisterRequest request);
    Task<ApiResponse<Application.Auth.DTOs.AuthResponse>> LoginAsync(DTOs.LoginRequest request);
    Task<ApiResponse<Application.Auth.DTOs.AuthResponse>> RefreshTokenAsync(DTOs.RefreshTokenRequest request);
    Task<ApiResponse<bool>> RevokeTokenAsync(string token, string userId);
    Task<ApiResponse<DTOs.UserDto>> GetProfileAsync(string userId);
    Task<ApiResponse<DTOs.UserDto>> UpdateProfileAsync(string userId, DTOs.UpdateProfileRequest request);
    Task<ApiResponse<bool>> ForgotPasswordAsync(DTOs.ForgotPasswordRequest request);
    Task<ApiResponse<bool>> ResetPasswordAsync(DTOs.ResetPasswordRequest request);
}
