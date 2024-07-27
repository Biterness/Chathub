using Microsoft.AspNetCore.Identity;

namespace Chathub.API.Infrastructure.Data.Entities
{
    public class Role : IdentityRole<Guid>
    {
        public List<User> Users { get; set; }
    }
}
