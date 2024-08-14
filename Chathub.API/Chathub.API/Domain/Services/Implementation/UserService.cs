using Chathub.API.Domain.Data.Dtos;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Domain.Services.Abstract;
using Chathub.API.Domain.UnitOfWorks.Abstract;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;

namespace Chathub.API.Domain.Services.Implementation
{
    public class UserService : IUserService
    {
        private IUserUnitOfWork _userUnitOfWork;
        private IDeviceUnitOfWork _deviceUnitOfWork;
        private IConfiguration _config;
        public UserService(IUserUnitOfWork userUnitOfWork, IDeviceUnitOfWork deviceUnitOfWork, IConfiguration config)
        {
            _userUnitOfWork = userUnitOfWork;
            _deviceUnitOfWork = deviceUnitOfWork;
            _config = config;
        }
        public async Task<string> Login(LoginDto data, HttpContext context)
        {
            var user = await _userUnitOfWork.Login(data);
            var isNewDevice = await _deviceUnitOfWork.CheckNewDevice(context.Request, user);
            if (isNewDevice)
            {
                await _deviceUnitOfWork.AddNewDevice(context.Request, user);
            }
            
            return GenerateToken(user);
        }

        public async Task<string> Signup(SignupDto data, HttpContext context)
        {
            var user = await _userUnitOfWork.Signup(data);
            await _deviceUnitOfWork.AddNewDevice(context.Request, user);
            return GenerateToken(user);
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
    }
}
