namespace Appilico.Market.Infrastructure.Services.Email;

public interface IEmailService
{
    Task SendAsync(string to, string subject, string htmlBody);
    // TODO: Email templates (welcome, provider approved, new review, etc.)
    // TODO: Bulk email for newsletters
    // TODO: Email tracking (opens, clicks)
}

/// <summary>
/// No-op email service for development. Logs emails instead of sending.
/// TODO: Implement SMTP email service for production.
/// TODO: SendGrid/Mailgun integration for scalability.
/// </summary>
public class ConsoleEmailService : IEmailService
{
    public Task SendAsync(string to, string subject, string htmlBody)
    {
        Console.WriteLine($"[EMAIL] To: {to} | Subject: {subject}");
        return Task.CompletedTask;
    }
}
