using Microsoft.AspNetCore.Identity;

namespace Appilico.Market.Domain.Auth;

public class AppUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? AddressLine1 { get; set; }
    public string? Suburb { get; set; }
    public string? PostCode { get; set; }
    public string? State { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation
    public Provider? Provider { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
    public ICollection<Social.Follow> Follows { get; set; } = [];
    public ICollection<Social.Favorite> Favorites { get; set; } = [];
    public ICollection<Reviews.Review> Reviews { get; set; } = [];
    public ICollection<Notifications.Notification> Notifications { get; set; } = [];
    public Users.UserPreference? Preference { get; set; }
}
