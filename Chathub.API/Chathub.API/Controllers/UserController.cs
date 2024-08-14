using Chathub.API.Domain.Data.Dtos;
using Chathub.API.Domain.Services.Abstract;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chathub.API.Controllers
{
    [AllowAnonymous]
    [Route("/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
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
        [Authorize(CookieAuthenticationDefaults.AuthenticationScheme)]
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            return Ok();
        }
    }
}
