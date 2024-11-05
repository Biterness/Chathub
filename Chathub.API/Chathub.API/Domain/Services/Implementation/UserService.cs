using Chathub.API.Domain.Data.Dtos;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Domain.Services.Abstract;
using Chathub.API.Domain.UnitOfWorks.Abstract;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Chathub.API.Domain.Data.Models;
using AutoMapper;

namespace Chathub.API.Domain.Services.Implementation
{
    public class UserService : IUserService
    {
        private IUserUnitOfWork _userUnitOfWork;
        private IDeviceUnitOfWork _deviceUnitOfWork;
        private IConfiguration _config;
        private IMapper _mapper;
        public UserService(IUserUnitOfWork userUnitOfWork, IDeviceUnitOfWork deviceUnitOfWork, IConfiguration config, IMapper mapper)
        {
            _userUnitOfWork = userUnitOfWork;
            _deviceUnitOfWork = deviceUnitOfWork;
            _config = config;
            _mapper = mapper;
        }
        public async Task<UserInfo> Login(LoginDto data, HttpContext context)
        {
            var user = await _userUnitOfWork.Login(data);
            var isNewDevice = await _deviceUnitOfWork.CheckNewDevice(context.Request, user);
            if (isNewDevice)
            {
                await _deviceUnitOfWork.AddNewDevice(context.Request, user);
            }

            await GenerateCookie(user, context);
            return new UserInfo
            {
                Username = user.UserName!,
                AccessToken = GenerateToken(user)
            };
        }

        public async Task<UserInfo> Signup(SignupDto data, HttpContext context)
        {
            var user = await _userUnitOfWork.Signup(data);
            await _deviceUnitOfWork.AddNewDevice(context.Request, user);
            await GenerateCookie(user, context);
            return new UserInfo
            {
                Username = user.UserName!,
                AccessToken = GenerateToken(user)
            };
        }

        public async Task<AccessToken> RefreshToken(Guid userId, HttpContext context)
        {
            var user = await _userUnitOfWork.Refresh(userId);
            await GenerateCookie(user, context);
            return new AccessToken(GenerateToken(user));
        }

        public async Task<Data.Models.ChatMember> GetMemberInfo(InviteMemberDto data)
        {
            var member = await _userUnitOfWork.GetUserInfo(data.Email);
            return _mapper.Map<Data.Models.ChatMember>(member);
        }   

        private string GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.Unicode.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Role, "User")
            };
            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);


            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private async Task GenerateCookie(User user, HttpContext context)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            };
            var claimIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var properties = new AuthenticationProperties
            {
                ExpiresUtc = DateTime.Now.AddDays(3),
                IssuedUtc = DateTime.Now,
                IsPersistent = true,
                RedirectUri = string.Empty,
            };

            await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimIdentity), properties);
        }
    }
}
