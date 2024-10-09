namespace Chathub.API.Infrastructure.Data.Entities
{
    public class ChatContent
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ChatRoomId { get; set; }
        public User User { get; set; }
        public ChatRoom ChatRoom { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime DeletedAt { get; set; }
    }
}
