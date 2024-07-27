namespace Chathub.API.Domain.Data.Models
{
    public class ChatFile
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime DeletedAt { get; set; }
    }
}
