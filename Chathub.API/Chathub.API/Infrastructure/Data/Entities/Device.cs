namespace Chathub.API.Infrastructure.Data.Entities
{
    public class Device
    {
        public Guid Id { get; set; }
        public string Address { get; set; }
        public string UserAgent { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime DeletedAt { get; set; }
    }
}
