using AutoMapper;
using DomainData = Chathub.API.Domain.Data.Models;
using InfrastructureData = Chathub.API.Infrastructure.Data.Entities;

namespace Chathub.API.Misc.MapperProfiles
{
    public class ChatRoomProfile : Profile
    {
        public ChatRoomProfile()
        {
            CreateMap<InfrastructureData.ChatFile, DomainData.ChatFile>()
                .ForMember(d => d.Id, otp => otp.MapFrom(i => i.Id))
                .ForMember(d => d.UserId, otp => otp.MapFrom(i => i.UserId))
                .ForMember(d => d.CreatedAt, otp => otp.MapFrom(i => i.CreatedAt))
                .ForMember(d => d.UpdatedAt, otp => otp.MapFrom(i => i.UpdatedAt))
                .ForMember(d => d.DeletedAt, otp => otp.MapFrom(i => i.DeletedAt));

            CreateMap<InfrastructureData.ChatMessage, DomainData.ChatMessage>()
                .ForMember(d => d.Id, otp => otp.MapFrom(i => i.Id))
                .ForMember(d => d.Content, otp => otp.MapFrom(i => i.Content))
                .ForMember(d => d.CreatedAt, otp => otp.MapFrom(i => i.CreatedAt))
                .ForMember(d => d.UpdatedAt, otp => otp.MapFrom(i => i.UpdatedAt))
                .ForMember(d => d.DeletedAt, otp => otp.MapFrom(i => i.DeletedAt));

            CreateMap<InfrastructureData.ChatMember, DomainData.ChatMember>()
                .ForMember(d => d.Id, otp => otp.MapFrom(i => i.UserId))
                .ForMember(d => d.Name, otp => otp.MapFrom(i => i.UserName));

            CreateMap<Tuple<InfrastructureData.ChatRoom, InfrastructureData.ChatMember>, DomainData.ChatRoom>()
                    .ForMember(dto => dto.Id, otp => otp.MapFrom(t => t.Item1.Id))
                    .ForMember(dto => dto.Name, otp => otp.MapFrom(t => t.Item1.Name))
                    .ForMember(dto => dto.Description, otp => otp.MapFrom(t => t.Item1.Description))
                    .ForMember(dto => dto.CanShareFile, otp => otp.MapFrom(t => t.Item2.CanShareFile))
                    .ForMember(dto => dto.CanManageFile, otp => otp.MapFrom(t => t.Item2.CanManageFile))
                    .ForMember(dto => dto.CanManageMember, otp => otp.MapFrom(t => t.Item2.CanManageMember))
                    .ForMember(dto => dto.CanGrantRight, otp => otp.MapFrom(t => t.Item2.CanGrantRight))
                    .ForMember(dto => dto.FileList, otp => otp.MapFrom(t => t.Item1.ChatFiles))
                    .ForMember(dto => dto.MessageList, otp => otp.MapFrom(t => t.Item1.ChatMessages))
                    .ForMember(dto => dto.MemberList, otp => otp.MapFrom(t => t.Item1.ChatMembers));
        }
    }
}
