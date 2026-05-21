using Appilico.Market.Domain.Common;
using Appilico.Market.Domain.Settings;
using Appilico.Market.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Appilico.Market.Application.Settings.Services;

public class AppSettingDto
{
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Group { get; set; } = "General";
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class UpdateAppSettingRequest
{
    public string Value { get; set; } = string.Empty;
}

public interface IAppSettingService
{
    Task<ApiResponse<List<AppSettingDto>>> GetAllAsync();
    Task<ApiResponse<AppSettingDto>> UpdateAsync(string key, UpdateAppSettingRequest request);
}

public class AppSettingService : IAppSettingService
{
    private readonly AppDbContext _context;

    public AppSettingService(AppDbContext context) => _context = context;

    public async Task<ApiResponse<List<AppSettingDto>>> GetAllAsync()
    {
        await EnsureDefaultSettingsAsync();

        var settings = await _context.AppSettings
            .OrderBy(s => s.Group)
            .ThenBy(s => s.Key)
            .Select(s => MapToDto(s))
            .ToListAsync();

        return ApiResponse<List<AppSettingDto>>.Ok(settings);
    }

    public async Task<ApiResponse<AppSettingDto>> UpdateAsync(string key, UpdateAppSettingRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Value))
            return ApiResponse<AppSettingDto>.Fail("Setting value is required");

        await EnsureDefaultSettingsAsync();

        var setting = await _context.AppSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
            return ApiResponse<AppSettingDto>.Fail("Setting not found");

        setting.Value = request.Value.Trim();
        await _context.SaveChangesAsync();

        return ApiResponse<AppSettingDto>.Ok(MapToDto(setting), "Setting updated");
    }

    private async Task EnsureDefaultSettingsAsync()
    {
        if (await _context.AppSettings.AnyAsync())
            return;

        _context.AppSettings.AddRange(DefaultSettings.Select(s => new AppSetting
        {
            Key = s.Key,
            Value = s.Value,
            Group = s.Group,
            Description = s.Description
        }));

        await _context.SaveChangesAsync();
    }

    private static AppSettingDto MapToDto(AppSetting setting) => new()
    {
        Id = setting.Id,
        Key = setting.Key,
        Value = setting.Value,
        Group = setting.Group ?? "General",
        Description = setting.Description,
        CreatedAt = setting.CreatedAt,
        UpdatedAt = setting.UpdatedAt
    };

    private static readonly List<AppSettingDto> DefaultSettings =
    [
        new() { Key = "site_name", Value = "Appilico Market", Group = "General", Description = "Platform name" },
        new() { Key = "support_email", Value = "support@appilico.com.au", Group = "General", Description = "Support email" },
        new() { Key = "max_gallery_images", Value = "20", Group = "Provider", Description = "Maximum gallery images per provider" },
        new() { Key = "auto_approve_providers", Value = "false", Group = "Moderation", Description = "Auto-approve newly submitted providers" },
        new() { Key = "review_moderation", Value = "true", Group = "Moderation", Description = "Moderate reviews before publishing" },
        new() { Key = "min_review_length", Value = "20", Group = "Moderation", Description = "Minimum public review character length" },
        new() { Key = "seo_suburb_category_pages", Value = "true", Group = "SEO", Description = "Generate suburb and category landing pages" },
        new() { Key = "marketplace_emails_enabled", Value = "false", Group = "Notifications", Description = "Enable customer/provider marketplace emails" }
    ];
}