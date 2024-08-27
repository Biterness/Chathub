using Chathub.API.Domain.Data.Dtos;
using Chathub.API.Domain.Data.Models;
using Chathub.API.Domain.Services.Abstract;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Chathub.API.Controllers
{

    [Route("/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto body)
        {
            try
            {
                return Ok(await _userService.Login(body, HttpContext));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupDto body)
        {
            try
            {
                return Ok(await _userService.Signup(body, HttpContext));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpGet("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            try
            {
                var userId = User.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).First().Value;
                return Ok(await _userService.RefreshToken(Guid.Parse(userId), HttpContext));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
