using Chathub.API.Domain.Data.Dtos;
using Chathub.API.Domain.Data.Models;

namespace Chathub.API.Domain.Services.Abstract
{
    public interface IUserService
    {
        Task<UserInfo> Login(LoginDto data, HttpContext context);
        Task<UserInfo> Signup(SignupDto data, HttpContext context);
        Task<AccessToken> RefreshToken(Guid userId, HttpContext context);
        Task<ChatMember> GetMemberInfo(InviteMemberDto data);
    }
}
