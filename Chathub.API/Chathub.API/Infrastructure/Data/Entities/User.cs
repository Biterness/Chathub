using Microsoft.AspNetCore.Identity;

namespace Chathub.API.Infrastructure.Data.Entities
{
    public class User : IdentityUser<Guid>
    {
        public Guid UserRoleId { get; set; }
        public Role UserRole { get; set; }
        public DateTime LastLoginAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime DeletedAt { get; set; }
        public List<ChatMember> ChatMembers { get; set; }
        public List<ChatRoom> ChatRooms { get; set; }
        public List<ChatContent> ChatContents { get; set; }
        public List<Device> Devices { get; set; }
    }
}
