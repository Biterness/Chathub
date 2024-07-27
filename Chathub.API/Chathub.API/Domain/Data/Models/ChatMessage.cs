namespace Chathub.API.Domain.Data.Models
{
    public class ChatMessage
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime DeletedAt { get; set; }
    }
}
