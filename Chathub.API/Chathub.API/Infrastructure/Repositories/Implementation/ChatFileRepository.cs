using Chathub.API.Infrastructure.Data.Context;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Infrastructure.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Chathub.API.Infrastructure.Repositories.Implementation
{
    public class ChatFileRepository : IChatFileRepository
    {
        private readonly ChathubContext _dbContext;
        public ChatFileRepository(ChathubContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ChatFile>> GetAsync(Func<ChatFile, bool> predicate)
        {
            return _dbContext.ChatFiles.AsNoTracking().Where(predicate).ToList();
        }

        public async Task<List<ChatFile>> GetWithAsync(Func<ChatFile, bool> predicate, params Expression<Func<ChatFile, object>>[] options)
        {
            var chatFileSet = _dbContext.Set<ChatFile>().AsNoTracking().AsQueryable();
            var properties = options.Aggregate(chatFileSet, (set, next) => set.Include(next));
            return properties.Where(predicate).ToList();
        }

        public async Task CreateAsync(ChatFile entity)
        {
            _dbContext.Add(entity);
        }

        public async Task RemoveAsync(ChatFile entity)
        {
            entity.DeletedAt = DateTime.Now;
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        public async Task RemoveAsync(Func<ChatFile, bool> predicate)
        {
            List<ChatFile> result = _dbContext.ChatFiles.Where(predicate).ToList();
            foreach (var chatFile in result)
            {
                chatFile.DeletedAt = DateTime.Now;
                _dbContext.Entry(chatFile).State = EntityState.Modified;
            }
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(ChatFile entity)
        {
            entity.UpdatedAt = DateTime.Now;
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
