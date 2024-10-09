using Chathub.API.Infrastructure.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ChatFile = Chathub.API.Infrastructure.Data.Entities.ChatFile;
using ChatMember = Chathub.API.Infrastructure.Data.Entities.ChatMember;
using ChatMessage = Chathub.API.Infrastructure.Data.Entities.ChatMessage;
using ChatRoom = Chathub.API.Infrastructure.Data.Entities.ChatRoom;

namespace Chathub.API.Infrastructure.Data.Context
{
    public class ChathubContext : DbContext
    {
        private Guid _userRoleId = Guid.NewGuid();
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<ChatRoom> ChatRooms { get; set; }
        public DbSet<ChatMember> ChatMembers { get; set; }
        public DbSet<ChatContent> ChatContents { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<ChatFile> ChatFiles { get; set; }
        public ChathubContext(DbContextOptions<ChathubContext> options)
        : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(x => x.Id);
            modelBuilder.Entity<User>().Property(x => x.UserName).IsRequired();
            modelBuilder.Entity<User>().HasMany(x => x.ChatRooms).WithOne(x => x.Owner).HasForeignKey(x => x.OwnerId).IsRequired();
            modelBuilder.Entity<User>().HasMany(x => x.ChatMembers).WithOne(x => x.User).HasForeignKey(x => x.UserId).IsRequired();
            modelBuilder.Entity<User>().HasMany(x => x.ChatContents).WithOne(x => x.User).HasForeignKey(x => x.UserId).IsRequired();
            modelBuilder.Entity<User>().HasMany(x => x.Devices).WithOne(x => x.User).HasForeignKey(x => x.UserId).IsRequired();

            modelBuilder.Entity<Role>().HasKey(x => x.Id);
            modelBuilder.Entity<Role>().Property(x => x.Name).IsRequired();
            modelBuilder.Entity<Role>().HasMany(x => x.Users).WithOne(x => x.UserRole).HasForeignKey(x => x.UserRoleId).IsRequired();

            modelBuilder.Entity<Device>().HasKey(x => x.Id);
            modelBuilder.Entity<Device>().Property(x => x.Address).IsRequired();
            modelBuilder.Entity<Device>().Property(x => x.UserAgent).IsRequired();

            modelBuilder.Entity<ChatRoom>().HasKey(x => x.Id);
            modelBuilder.Entity<ChatRoom>().Property(x => x.Name).IsRequired();
            modelBuilder.Entity<ChatRoom>().Property(x => x.Description).IsRequired();
            modelBuilder.Entity<ChatRoom>().HasMany(x => x.ChatMembers).WithOne(x => x.ChatRoom).HasForeignKey(x => x.ChatRoomId).IsRequired();
            modelBuilder.Entity<ChatRoom>().HasMany(x => x.ChatContents).WithOne(x => x.ChatRoom).HasForeignKey(x => x.ChatRoomId).IsRequired();

            modelBuilder.Entity<ChatMember>().HasKey(x => x.Id);
            modelBuilder.Entity<ChatMember>().Property(x => x.ChatRoomId).IsRequired();
            modelBuilder.Entity<ChatMember>().Property(x => x.UserId).IsRequired();
            modelBuilder.Entity<ChatMember>().Property(x => x.UserName).IsRequired();
            modelBuilder.Entity<ChatMember>().HasIndex(x => new {x.ChatRoomId, x.UserId}).IsUnique();

            modelBuilder.Entity<ChatContent>().HasKey(x => x.Id);
            modelBuilder.Entity<ChatContent>().Property(x => x.UserId).IsRequired();
            modelBuilder.Entity<ChatContent>().Property(x => x.ChatRoomId).IsRequired();
            modelBuilder.Entity<ChatContent>().ToTable("Contents");

            modelBuilder.Entity<ChatMessage>().Property(x => x.Content).IsRequired();
            modelBuilder.Entity<ChatMessage>().ToTable("Messages");
;
            modelBuilder.Entity<ChatFile>().Property(x => x.Name).IsRequired();
            modelBuilder.Entity<ChatFile>().Property(x => x.Location).IsRequired();
            modelBuilder.Entity<ChatFile>().ToTable("Files");

            modelBuilder.Entity<Role>().HasData([
                new Role
                {
                    Id = _userRoleId,
                    Name = "User",
                    NormalizedName = "user"
                },
                new Role
                {
                    Id = Guid.NewGuid(),
                    Name = "Admin",
                    NormalizedName = "admin"
                }
            ]);

            PasswordHasher<User> hasher = new PasswordHasher<User>();
            var newUser = new User
            {
                Id = Guid.NewGuid(),
                UserRoleId = _userRoleId,
                Email = "Kappa123@mail.com",
                NormalizedEmail = "kappa123@mail.com",
                UserName = "Kappa123",
                NormalizedUserName = "kappa123",
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow,
            };
            newUser.PasswordHash = hasher.HashPassword(newUser, "Kappa1@3");

            modelBuilder.Entity<User>().HasData([
                newUser
            ]);

            modelBuilder.Entity<Device>().HasData([
                new Device
                {
                    Id = Guid.NewGuid(),
                    Address = "0.0.0.1",
                    UserAgent = "PostmanRuntime/7.39.0",
                    UserId = newUser.Id,
                    CreatedAt = DateTime.UtcNow,
                }
            ]);
        }
    }
}
