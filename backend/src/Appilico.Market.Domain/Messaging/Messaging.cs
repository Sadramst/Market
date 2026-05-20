using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Common;

namespace Appilico.Market.Domain.Messaging;

public class Conversation : BaseEntity
{
    public Guid ProviderId { get; set; }
    public string CustomerId { get; set; } = string.Empty; // AppUser Id
    public string? Subject { get; set; }
    public bool IsArchived { get; set; }
    public DateTime? LastMessageAt { get; set; }

    // Navigation
    public Provider Provider { get; set; } = null!;
    public AppUser Customer { get; set; } = null!;
    public ICollection<Message> Messages { get; set; } = [];

    // TODO: WebSocket real-time messaging
    // TODO: Read receipts
    // TODO: Typing indicators
}

public class Message : BaseEntity
{
    public Guid ConversationId { get; set; }
    public string SenderId { get; set; } = string.Empty; // AppUser Id
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }

    // Navigation
    public Conversation Conversation { get; set; } = null!;
    public AppUser Sender { get; set; } = null!;

    // TODO: Message attachments (images, files)
    // TODO: AI moderation of message content
}
