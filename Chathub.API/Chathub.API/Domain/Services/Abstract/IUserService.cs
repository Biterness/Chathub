using Chathub.API.Domain.Data.Dtos;

namespace Chathub.API.Domain.Services.Abstract
{
    public interface IUserService
    {
        Task<string> Login(LoginDto data, HttpContext context);
        Task<string> Signup(SignupDto data, HttpContext context);
    }
}
