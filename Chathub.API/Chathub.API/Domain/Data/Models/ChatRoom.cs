namespace Chathub.API.Domain.Data.Models
{
    public class ChatRoom
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool CanShareFile { get; set; }
        public bool CanManageFile { get; set; }
        public bool CanManageMember { get; set; }
        public bool CanGrantRight { get; set; }
        public List<ChatMember> MemberList { get; set; }
        public List<ChatMessage> MessageList { get; set; }
        public List<ChatFile> FileList { get; set; }
    }
}
