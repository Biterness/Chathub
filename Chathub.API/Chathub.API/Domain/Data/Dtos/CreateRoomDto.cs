namespace Chathub.API.Domain.Data.Dtos
{
    public class CreateRoomDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Guid> MemberList { get; set; }
    }
}
