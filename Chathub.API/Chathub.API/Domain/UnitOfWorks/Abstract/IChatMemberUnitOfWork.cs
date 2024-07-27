using Chathub.API.Infrastructure.Data.Entities;

namespace Chathub.API.Domain.UnitOfWorks.Abstract
{
    public interface IChatMemberUnitOfWork : IGenericUnitOfWork<ChatMember>
    {
        Task<List<ChatMember>> GetAllByUserId(Guid userId);
        Task<List<ChatMember>> GetAllByRoomId(Guid roomId);
    }
}
