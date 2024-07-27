namespace Chathub.API.Infrastructure.Data.Entities
{
    public class ChatMember
    {
        public Guid Id { get; set; }
        public Guid ChatRoomId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public bool CanManageMember { get; set; }
        public bool CanManageFile { get; set; }
        public bool CanGrantRight { get; set; }
        public bool CanShareFile { get; set; }
        public User User { get; set; }
        public ChatRoom ChatRoom { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; }
    }
}
