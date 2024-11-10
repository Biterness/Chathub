using Chathub.API.Domain.Hubs.Data;
using Chathub.API.Domain.Services.Abstract;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Chathub.API.Domain.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        private readonly IUserService _userService;
        public ChatHub(IUserService userService)
        {
            _userService = userService;
        }
        public async Task SendMessage(string userId, Message message)
        {
            try
            {
                var id = Guid.Parse(userId);
                if(id == Guid.Empty)
                {
                    throw new Exception("User not found");
                }

                var user = await _userService.GetSenderInfo(id);
                if(user == null)
                {
                    throw new Exception("User not found");
                }

                if(message.Type != MessageType.Message)
                {
                    throw new Exception("Unknown Error");
                }

                await Clients.Group(message.ChatRoomId.ToString()).SendAsync(userId, message);
            } catch (Exception ex)
            {
                Message errorMessage = new Message
                {
                    Type = MessageType.Error,
                    ChatRoomId = message.ChatRoomId,
                    UserId = message.UserId,
                    Content = ex.Message
                };
                await Clients.Caller.SendAsync(userId, errorMessage);
            }
        }
        public async Task AddToGroup(string groupId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
        }
        public async Task RemoveFromGroup(string groupId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
        }
    }
}
