using Chathub.API.Infrastructure.Data.Entities;

namespace Chathub.API.Domain.UnitOfWorks.Abstract
{
    public interface IDeviceUnitOfWork : IGenericUnitOfWork<Device>
    {
        Task AddNewDevice(HttpRequest req, User user);
        Task<bool> CheckNewDevice(HttpRequest req, User user);
    }
}
