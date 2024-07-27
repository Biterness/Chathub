using Chathub.API.Infrastructure.Data.Context;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Infrastructure.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Chathub.API.Infrastructure.Repositories.Implementation
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly ChathubContext _dbContext;
        public DeviceRepository(ChathubContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Device>> GetAsync(Func<Device, bool> predicate)
        {
            return _dbContext.Devices.Where(predicate).ToList();
        }

        public async Task<List<Device>> GetWithAsync(Func<Device, bool> predicate, params Expression<Func<Device, object>>[] options)
        {
            var deviceSet = _dbContext.Set<Device>().AsQueryable();
            var properties = options.Aggregate(deviceSet, (set, next) => set.Include(next));
            return properties.Where(predicate).ToList();
        }

        public async Task RemoveAsync(Device entity)
        {
            entity.DeletedAt = DateTime.Now;
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        public async Task RemoveAsync(Func<Device, bool> predicate)
        {
            List<Device> result = _dbContext.Devices.AsNoTracking().Where(predicate).ToList();
            foreach (var device in result)
            {
                device.DeletedAt = DateTime.Now;
                _dbContext.Entry(device).State = EntityState.Modified;
            }
        }
        public async Task CreateAsync(Device entity)
        {
            _dbContext.Add(entity);
        }

        public async Task UpdateAsync(Device entity)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _dbContext.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
