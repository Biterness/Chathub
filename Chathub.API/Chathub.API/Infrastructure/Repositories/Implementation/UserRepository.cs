using Chathub.API.Infrastructure.Data.Context;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Infrastructure.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Chathub.API.Infrastructure.Repositories.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly ChathubContext _dbContext;
        public UserRepository(ChathubContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<User>> GetAsync(Func<User, bool> predicate)
        {
            return _dbContext.Users.Where(predicate).ToList();
        }

        public async Task<List<User>> GetWithAsync(Func<User, bool> predicate, params Expression<Func<User, object>>[] options)
        {
            var userSet = _dbContext.Set<User>().AsQueryable();
            var properties = options.Aggregate(userSet, (set, next) => set.Include(next));
            return properties.Where(predicate).ToList();
        }
   
        public async Task CreateAsync(User entity)
        {
            entity.CreatedAt = DateTime.Now;
            _dbContext.Add(entity);
        }

        public async Task RemoveAsync(User entity)
        {
            entity.DeletedAt = DateTime.Now;
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        public async Task RemoveAsync(Func<User, bool> predicate)
        {
            List<User> result = _dbContext.Users.AsNoTracking().Where(predicate).ToList();
            foreach (var user in result)
            {
                if(user.DeletedAt == default)
                {
                    user.DeletedAt = DateTime.Now;
                    _dbContext.Entry(user).State = EntityState.Modified;
                }
            }
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(User entity)
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
