using Chathub.API.Domain.Data.Dtos;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Domain.UnitOfWorks.Abstract;
using Chathub.API.Infrastructure.Repositories.Abstract;

namespace Chathub.API.Domain.UnitOfWorks.Implementation
{
    public class ChatRoomUnitOfWork : IChatRoomUnitOfWork
    {
        private IChatRoomRepository _chatRoomRepository;
        private IChatMemberRepository _chatMemberRepository;
        private IUserRepository _userRepository;
        public ChatRoomUnitOfWork (IChatRoomRepository chatRoomRepository, IChatMemberRepository chatMemberRepository, IUserRepository userRepository)
        {
            _chatRoomRepository = chatRoomRepository;
            _chatMemberRepository = chatMemberRepository;
            _userRepository = userRepository;
        }

        public async Task CreateRoom(CreateRoomDto data, Guid userId)
        {
            var newRoom = new ChatRoom
            {
                Id = Guid.NewGuid(),
                Name = data.Name,
                Description = data.Description,
                OwnerId = userId,
            };
            await _chatRoomRepository.CreateAsync(newRoom);

            var owner = await _userRepository.GetAsync(u => u.Id == userId);
            if(owner == null || owner.Count == 0)
            {
                throw new Exception("User not found");
            }

            var ownerMember = new ChatMember
            {
                UserId = userId,
                ChatRoomId = newRoom.Id,
                UserName = owner.First().UserName,
                CanGrantRight = true,
                CanManageFile = true,
                CanManageMember = true,
                CanShareFile = true,
            };
            await _chatMemberRepository.CreateAsync(ownerMember);

            foreach (var memberId in data.MemberList)
            {
                var user = await _userRepository.GetAsync(u => u.Id == memberId);
                if (user == null || user.Count == 0)
                {
                    throw new Exception("Member not found");
                }

                var newMember = new ChatMember
                {
                    UserId = memberId,
                    ChatRoomId = newRoom.Id,
                    UserName = user.First().UserName
                };
                await _chatMemberRepository.CreateAsync(newMember);
            }
            await SaveChangeAsync();
        }

        public async Task DeleteRoom(ChatRoom room)
        {
            var memberList = await _chatMemberRepository.GetAsync(member => member.ChatRoomId == room.Id);
            foreach (var member in memberList)
            {
                await _chatMemberRepository.RemoveAsync(member);
            }

            await _chatRoomRepository.RemoveAsync(room);
            await SaveChangeAsync();
        }

        public async Task<List<ChatRoom>> GetAll(Guid userId)
        {
            var roomList = await _chatMemberRepository.GetAsync(member => member.UserId == userId);
            return await _chatRoomRepository.GetAsync(room => roomList.Exists(r => r.ChatRoomId == room.Id));
        }

        public async Task<List<ChatRoom>> GetAllWithIncludes(Guid userId)
        {
            var roomList = await _chatMemberRepository.GetAsync(member => member.UserId == userId);
            return await _chatRoomRepository.GetWithAsync(room => roomList.Exists(r => r.ChatRoomId == room.Id), room => room.ChatMessages, room => room.ChatFiles, room => room.ChatMembers);
        }

        public async Task SaveChangeAsync()
        {
            await _chatRoomRepository.SaveChangesAsync();
            await _chatMemberRepository.SaveChangesAsync();
        }
    }
}
