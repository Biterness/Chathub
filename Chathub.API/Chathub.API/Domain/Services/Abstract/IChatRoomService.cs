using Chathub.API.Domain.Data.Models;
using Chathub.API.Domain.Data.Dtos;

namespace Chathub.API.Domain.Services.Abstract
{
    public interface IChatRoomService
    {
        Task<ChatRoom> CreateRoom(CreateRoomDto data, Guid userId);
        Task DeleteRoom(Guid roomId, Guid userId);
        Task<List<ChatRoom>> GetRooms(Guid userId);
    }
}
