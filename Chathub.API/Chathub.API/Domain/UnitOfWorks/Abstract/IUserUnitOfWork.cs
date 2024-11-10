using Chathub.API.Domain.Data.Dtos;
using Chathub.API.Infrastructure.Data.Entities;

namespace Chathub.API.Domain.UnitOfWorks.Abstract
{
    public interface IUserUnitOfWork : IGenericUnitOfWork<User>
    {
        Task<User> Login(LoginDto data); 
        Task<User> Signup(SignupDto data);
        Task<User> Refresh(Guid userId);
        Task<User> GetUserInfoByEmail(string email);
        Task<User> GetUserInfoById(Guid userId);
    }
}
