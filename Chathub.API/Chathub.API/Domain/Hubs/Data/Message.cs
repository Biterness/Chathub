namespace Chathub.API.Domain.Hubs.Data
{
    public class Message
    {
        public string Content { get; set; }
        public Guid ChatRoomId { get; set; }
        public Guid UserId { get; set; }
        public string Type { get; set; }
    }
}
