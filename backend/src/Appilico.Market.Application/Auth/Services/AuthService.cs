using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Appilico.Market.Application.Auth.DTOs;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Common;
using Appilico.Market.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Appilico.Market.Application.Auth.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(UserManager<AppUser> userManager, AppDbContext context, IConfiguration config)
    {
        _userManager = userManager;
        _context = context;
        _config = config;
    }

    public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return ApiResponse<AuthResponse>.Fail("Email already registered");

        var user = new AppUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            EmailConfirmed = true // TODO: Email verification flow
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return ApiResponse<AuthResponse>.Fail("Registration failed", result.Errors.Select(e => e.Description).ToList());

        await _userManager.AddToRoleAsync(user, UserRoles.Customer);

        return await GenerateAuthResponse(user, "Registration successful");
    }

    public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || user.IsDeleted || !user.IsActive)
            return ApiResponse<AuthResponse>.Fail("Invalid credentials");

        var validPassword = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!validPassword)
            return ApiResponse<AuthResponse>.Fail("Invalid credentials");

        return await GenerateAuthResponse(user, "Login successful");
    }

    public async Task<ApiResponse<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var storedToken = await _context.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == request.RefreshToken && !t.IsRevoked);

        if (storedToken == null || storedToken.ExpiresAt < DateTime.UtcNow)
            return ApiResponse<AuthResponse>.Fail("Invalid or expired refresh token");

        // Revoke old token
        storedToken.IsRevoked = true;
        storedToken.RevokedReason = "Replaced by new token";
        await _context.SaveChangesAsync();

        return await GenerateAuthResponse(storedToken.User, "Token refreshed");
    }

    public async Task<ApiResponse<bool>> RevokeTokenAsync(string token, string userId)
    {
        var storedToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == token && t.UserId == userId);

        if (storedToken == null)
            return ApiResponse<bool>.Fail("Token not found");

        storedToken.IsRevoked = true;
        storedToken.RevokedReason = "Revoked by user";
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Token revoked");
    }

    public async Task<ApiResponse<UserDto>> GetProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return ApiResponse<UserDto>.Fail("User not found");

        var roles = await _userManager.GetRolesAsync(user);
        var provider = await _context.Providers.FirstOrDefaultAsync(p => p.UserId == userId);

        return ApiResponse<UserDto>.Ok(new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email!,
            Avatar = user.Avatar,
            Roles = roles.ToList(),
            ProviderId = provider?.Id
        });
    }

    public async Task<ApiResponse<UserDto>> UpdateProfileAsync(string userId, UpdateProfileRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return ApiResponse<UserDto>.Fail("User not found");

        if (request.FirstName != null) user.FirstName = request.FirstName;
        if (request.LastName != null) user.LastName = request.LastName;
        if (request.PhoneNumber != null) user.PhoneNumber = request.PhoneNumber;
        if (request.DateOfBirth.HasValue) user.DateOfBirth = request.DateOfBirth;
        user.UpdatedAt = DateTime.UtcNow;

        await _userManager.UpdateAsync(user);

        return await GetProfileAsync(userId);
    }

    public async Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return ApiResponse<bool>.Ok(true, "If the email exists, a reset link has been sent");

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        // TODO: Send email with reset token/link
        Console.WriteLine($"[RESET TOKEN] {token}");

        return ApiResponse<bool>.Ok(true, "If the email exists, a reset link has been sent");
    }

    public async Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return ApiResponse<bool>.Fail("Invalid request");

        var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
            return ApiResponse<bool>.Fail("Reset failed", result.Errors.Select(e => e.Description).ToList());

        return ApiResponse<bool>.Ok(true, "Password reset successful");
    }

    private async Task<ApiResponse<AuthResponse>> GenerateAuthResponse(AppUser user, string message)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var provider = await _context.Providers.FirstOrDefaultAsync(p => p.UserId == user.Id);

        var accessToken = GenerateJwtToken(user, roles);
        var refreshToken = GenerateRefreshToken();

        _context.RefreshTokens.Add(new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });
        await _context.SaveChangesAsync();

        var expiresAt = DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiryMinutes"] ?? "60"));

        return ApiResponse<AuthResponse>.Ok(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            User = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email!,
                Avatar = user.Avatar,
                Roles = roles.ToList(),
                ProviderId = provider?.Id
            }
        }, message);
    }

    private string GenerateJwtToken(AppUser user, IList<string> roles)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email!),
            new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var expiryMinutes = double.Parse(_config["Jwt:ExpiryMinutes"] ?? "60");

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}
