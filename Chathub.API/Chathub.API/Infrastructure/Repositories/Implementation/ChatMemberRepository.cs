using Chathub.API.Infrastructure.Data.Context;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Infrastructure.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Chathub.API.Infrastructure.Repositories.Implementation
{
    public class ChatMemberRepository : IChatMemberRepository
    {
        private readonly ChathubContext _dbContext;
        public ChatMemberRepository(ChathubContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ChatMember>> GetAsync(Func<ChatMember, bool> predicate)
        {
            return _dbContext.ChatMembers.AsNoTracking().Where(predicate).ToList();
        }

        public async Task<List<ChatMember>> GetWithAsync(Func<ChatMember, bool> predicate, params Expression<Func<ChatMember, object>>[] options)
        {
            var chatMemberSet = _dbContext.Set<ChatMember>().AsNoTracking().AsQueryable();
            var properties = options.Aggregate(chatMemberSet, (set, next) => set.Include(next));
            return properties.Where(predicate).ToList();
        }

        public async Task CreateAsync(ChatMember entity)
        {
            _dbContext.Add(entity);
        }

        public async Task RemoveAsync(ChatMember entity)
        {
            if(_dbContext.Entry(entity).State == EntityState.Detached)
            {
                _dbContext.Attach(entity);
                _dbContext.Entry(entity).State = EntityState.Deleted;
            }
        }

        public async Task RemoveAsync(Func<ChatMember, bool> predicate)
        {
            List<ChatMember> result = _dbContext.ChatMembers.Where(predicate).ToList();
            foreach (var member in result)
            {
                if(_dbContext.Entry(member).State == EntityState.Detached)
                {
                    _dbContext.Attach(member);
                    _dbContext.Entry(member).State = EntityState.Modified;
                }
            }
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(ChatMember entity)
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
