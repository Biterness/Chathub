using Chathub.API.Domain.Data.Dtos;
using Chathub.API.Domain.Services.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Chathub.API.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ChatRoomController : ControllerBase
    {
        private IChatRoomService _chatRoomService;
        public ChatRoomController(IChatRoomService chatRoomService)
        {
            _chatRoomService = chatRoomService;
        }
        [HttpGet]
        public async Task<IActionResult> GetChatRoom()
        {
            try 
            { 
                return Ok(await _chatRoomService.GetRooms(GetRequestGuid()));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateChatRoom([FromBody] CreateRoomDto body)
        {
            try
            {
                var userId = GetRequestGuid();
                await _chatRoomService.CreateRoom(body, userId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        private Guid GetRequestGuid()
        {
            return Guid.Parse(HttpContext.User.Claims.Where(claim => claim.Type == ClaimTypes.NameIdentifier).Select(claim => claim.Value).First());
        }
    }
}
