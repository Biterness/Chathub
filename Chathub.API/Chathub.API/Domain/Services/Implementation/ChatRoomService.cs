using AutoMapper;
using DomainData = Chathub.API.Domain.Data.Models;
using InfrastructureData = Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Domain.Services.Abstract;
using Chathub.API.Domain.UnitOfWorks.Abstract;
using Chathub.API.Domain.Data.Dtos;

namespace Chathub.API.Domain.Services.Implementation
{
    public class ChatRoomService : IChatRoomService
    {
        private IChatRoomUnitOfWork _chatRoomUnitOfWork;
        private IChatMemberUnitOfWork _chatMemberUnitOfWork;
        private IMapper _mapper;
        public ChatRoomService(IChatRoomUnitOfWork chatRoomUnitOfWork, IChatMemberUnitOfWork chatMemberUnitOfWork, IMapper mapper)
        {
            _chatRoomUnitOfWork = chatRoomUnitOfWork;
            _chatMemberUnitOfWork = chatMemberUnitOfWork;
            _mapper = mapper;
        }
        public async Task CreateRoom(CreateRoomDto data, Guid userId)
        {
            await _chatRoomUnitOfWork.CreateRoom(data, userId);
        }

        public async Task DeleteRoom(Guid roomId, Guid userId)
        {
            var roomList = await _chatRoomUnitOfWork.GetAll(userId);
            var room = roomList.Where(room => room.Id == roomId).FirstOrDefault();
            if (room == null)
            {
                throw new Exception("Room not found");
            }

            await _chatRoomUnitOfWork.DeleteRoom(room);
        }

        public async Task<List<DomainData.ChatRoom>> GetRooms(Guid userId)
        {
            var roomList = await _chatRoomUnitOfWork.GetAllWithIncludes(userId);
            var memberList = await _chatMemberUnitOfWork.GetAllByUserId(userId);
            var roomDtoList = new List<DomainData.ChatRoom>();

            foreach (var room in roomList)
            {
                var member = memberList.Where(m => m.ChatRoomId == room.Id).FirstOrDefault();
                if (member == null)
                {
                    throw new Exception("Member not found");
                }

                var roomDto = _mapper.Map<DomainData.ChatRoom>(new Tuple<InfrastructureData.ChatRoom, InfrastructureData.ChatMember>(room, member));
                if (roomDto != null)
                {
                    roomDtoList.Add(roomDto);
                }
            }

            return roomDtoList;
        }
    }
}
