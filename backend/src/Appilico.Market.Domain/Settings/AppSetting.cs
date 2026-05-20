using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Settings;

public class AppSetting : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Group { get; set; }
    public string? Description { get; set; }
}
