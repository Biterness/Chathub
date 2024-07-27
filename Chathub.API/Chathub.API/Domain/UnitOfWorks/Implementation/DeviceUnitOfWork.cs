using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Domain.UnitOfWorks.Abstract;
using Chathub.API.Infrastructure.Repositories.Abstract;

namespace Chathub.API.Domain.UnitOfWorks.Implementation
{
    public class DeviceUnitOfWork : IDeviceUnitOfWork
    {
        private IDeviceRepository _deviceRepository;
        public DeviceUnitOfWork(IDeviceRepository deviceRepository)
        {
            _deviceRepository = deviceRepository;
        }
        public async Task AddNewDevice(HttpRequest req, User user)
        {
            var userAgent = req.Headers.UserAgent.ToString();
            var address = req.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();

            var deviceCheck = await _deviceRepository.GetAsync(device => device.UserId == user.Id && device.UserAgent == userAgent && device.Address == address);
            if (deviceCheck.Count > 0)
            {
                throw new Exception("Device already exists");
            }

            var newDevice = new Device
            {
                UserId = user.Id,
                Address = address,
                UserAgent = userAgent,
            };

            await _deviceRepository.CreateAsync(newDevice);
            await SaveChangeAsync();
        }

        public async Task<bool> CheckNewDevice(HttpRequest req, User user)
        {
            var userAgent = req.Headers.UserAgent.ToString();
            var address = req.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();

            var deviceCheck = await _deviceRepository.GetAsync(device => device.UserId == user.Id && device.UserAgent == userAgent && device.Address == address);
            if (deviceCheck != null)
            {
                return false;
            }

            return true;
        }

        public async Task SaveChangeAsync()
        {
            await _deviceRepository.SaveChangesAsync();
        }
    }
}
