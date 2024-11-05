using Chathub.API.Domain.Data.Dtos;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Domain.UnitOfWorks.Abstract;
using Chathub.API.Infrastructure.Repositories.Abstract;
using Microsoft.AspNetCore.Identity;

namespace Chathub.API.Domain.UnitOfWorks.Implementation
{
    public class UserUnitOfWork : IUserUnitOfWork
    {
        private IUserRepository _userRepository;
        private IRoleRepository _roleRepository;
        private UserManager<User> _userManager;
        public UserUnitOfWork(IUserRepository userRepository, UserManager<User> userManager, IRoleRepository roleRepository)
        {
            _userRepository = userRepository;
            _userManager = userManager;
            _roleRepository = roleRepository;
        }
        public async Task<User> Login(LoginDto data)
        {
            var user = await _userRepository.GetAsync(user => user.UserName == data.Username);
            if (user.Count == 0)
            {
                throw new Exception("User not found");
            }

            var passwordCheck = await _userManager.CheckPasswordAsync(user.First(), data.Password);
            if (passwordCheck == false) 
            {
                throw new Exception("Incorrect password");
            }

            await AuditLogin(user.First());
            await SaveChangeAsync();
            return user.First();
        }

        public async Task<User> Signup(SignupDto data)
        {
            var user = await _userRepository.GetAsync(user => user.UserName == data.Username);
            if (user.Count != 0) 
            {
                throw new Exception("User already exists");
            }

            var userRole = await _roleRepository.GetAsync(role => role.Name == "User");
            if (userRole.Count == 0)
            {
                throw new Exception("User role not found");
            }

            var newUser = new User
            {
                UserName = data.Username,
                Email = data.Email,
                UserRoleId = userRole.First().Id,
                CreatedAt = DateTime.Now,
            };

            var createUserResult = await _userManager.CreateAsync(newUser, data.Password);
            if (createUserResult.Succeeded == false)
            {
                throw new Exception(createUserResult.Errors.First().Description);
            }

            await AuditLogin(newUser);
            await SaveChangeAsync();
            return newUser;
        }
        public async Task<User> Refresh(Guid userId)
        {
            var user = await _userRepository.GetAsync(u => u.Id == userId);
            if (user.Count == 0)
            {
                throw new Exception("User not found");
            }

            await AuditLogin(user.First());
            await SaveChangeAsync();
            return user.First();
        }

        public async Task<User> GetUserInfo(string email)
        {
            var user = await _userRepository.GetAsync(u => u.Email == email);
            if (user.Count == 0)
            {
                throw new Exception("User not found");
            }

            return user.First();
        }


        public async Task SaveChangeAsync()
        {
            await _userRepository.SaveChangesAsync();
        }

        private async Task AuditLogin(User user)
        {
            user.LastLoginAt = DateTime.Now;
        }
    }
}
