using Chathub.API.Infrastructure.Data.Context;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Infrastructure.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Chathub.API.Infrastructure.Repositories.Implementation
{
    public class ChatRoomRepository : IChatRoomRepository
    {
        private readonly ChathubContext _dbContext;
        public ChatRoomRepository(ChathubContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ChatRoom>> GetAsync(Func<ChatRoom, bool> predicate)
        {
            return _dbContext.ChatRooms.AsNoTracking().Where(predicate).ToList();
        }

        public async Task<List<ChatRoom>> GetWithAsync(Func<ChatRoom, bool> predicate, params Expression<Func<ChatRoom, object>>[] options)
        {
            var deviceSet = _dbContext.Set<ChatRoom>().AsNoTracking().AsQueryable();
            var properties = options.Aggregate(deviceSet, (set, next) => set.Include(next));
            return properties.Where(predicate).ToList();
        }

        public async Task CreateAsync(ChatRoom entity)
        {
            _dbContext.Add(entity);
        }

        public async Task RemoveAsync(ChatRoom entity)
        {
            entity.DeletedAt = DateTime.Now;
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        public async Task RemoveAsync(Func<ChatRoom, bool> predicate)
        {
            List<ChatRoom> result = _dbContext.ChatRooms.Where(predicate).ToList();
            foreach(ChatRoom room in result)
            {
                room.DeletedAt = DateTime.Now;
                _dbContext.Entry(room).State = EntityState.Modified;
            }
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(ChatRoom entity)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
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
