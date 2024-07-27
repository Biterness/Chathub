namespace Chathub.API.Infrastructure.Data.Entities
{
    public class ChatRoom
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid OwnerId { get; set; }
        public User Owner { get; set; }
        public List<ChatMember> ChatMembers { get; set; }
        public List<ChatMessage> ChatMessages { get; set; }
        public List<ChatFile> ChatFiles { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; }
        public DateTime DeletedAt { get; set; }
    }
}
