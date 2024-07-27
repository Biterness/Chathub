using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Domain.UnitOfWorks.Abstract;
using Chathub.API.Infrastructure.Repositories.Abstract;

namespace Chathub.API.Domain.UnitOfWorks.Implementation
{
    public class ChatMemberUnitOfWork : IChatMemberUnitOfWork
    {
        private readonly IChatMemberRepository _chatMemberRepository;
        public ChatMemberUnitOfWork(IChatMemberRepository chatMemberRepository)
        {
            _chatMemberRepository = chatMemberRepository;
        }

        public async Task<List<ChatMember>> GetAllByRoomId(Guid roomId)
        {
            return await _chatMemberRepository.GetAsync(member => member.ChatRoomId == roomId);
        }

        public async Task<List<ChatMember>> GetAllByUserId(Guid userId)
        {
            return await _chatMemberRepository.GetAsync(member => member.UserId == userId);
        }

        public async Task SaveChangeAsync()
        {
            await _chatMemberRepository.SaveChangesAsync();
        }
    }
}
