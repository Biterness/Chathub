using Chathub.API.Domain.Data.Dtos;
using Chathub.API.Infrastructure.Data.Entities;

namespace Chathub.API.Domain.UnitOfWorks.Abstract
{
    public interface IChatRoomUnitOfWork : IGenericUnitOfWork<ChatRoom>
    {
        Task<List<ChatRoom>> GetAll(Guid userId);
        Task<List<ChatRoom>> GetAllWithIncludes(Guid userId);
        Task CreateRoom(CreateRoomDto data, Guid userId);
        Task DeleteRoom(ChatRoom room);
    }
}
