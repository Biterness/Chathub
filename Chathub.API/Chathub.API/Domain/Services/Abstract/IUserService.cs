using Chathub.API.Domain.Data.Dtos;

namespace Chathub.API.Domain.Services.Abstract
{
    public interface IUserService
    {
        Task<string> Login(LoginDto data, HttpRequest req, HttpResponse res);
        Task<string> Signup(SignupDto data, HttpRequest req, HttpResponse res);
    }
}
