using Chathub.API.Infrastructure.Data.Context;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Infrastructure.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Chathub.API.Infrastructure.Repositories.Implementation
{
    public class ChatMessageRepository : IChatMessageRepository
    {
        private readonly ChathubContext _dbContext;
        public ChatMessageRepository(ChathubContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ChatMessage>> GetAsync(Func<ChatMessage, bool> predicate)
        {
            return _dbContext.ChatMessages.AsNoTracking().Where(predicate).ToList();
        }

        public async Task<List<ChatMessage>> GetWithAsync(Func<ChatMessage, bool> predicate, params Expression<Func<ChatMessage, object>>[] options)
        {
            var chatMessageSet = _dbContext.Set<ChatMessage>().AsNoTracking().AsQueryable();
            var properties = options.Aggregate(chatMessageSet, (set, next) => set.Include(next));
            return properties.Where(predicate).ToList();
        }

        public async Task CreateAsync(ChatMessage entity)
        {
            _dbContext.Add(entity);
        }

        public async Task RemoveAsync(ChatMessage entity)
        {
            entity.DeletedAt = DateTime.Now;
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        public async Task RemoveAsync(Func<ChatMessage, bool> predicate)
        {
            List<ChatMessage> result = _dbContext.ChatMessages.Where(predicate).ToList();
            foreach (var chatMessage in result)
            {
                chatMessage.DeletedAt = DateTime.Now;
                _dbContext.Entry(chatMessage).State = EntityState.Modified;
            }
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(ChatMessage entity)
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
