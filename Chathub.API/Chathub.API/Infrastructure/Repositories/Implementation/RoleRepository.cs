using Chathub.API.Infrastructure.Data.Context;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Infrastructure.Repositories.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Chathub.API.Infrastructure.Repositories.Implementation
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ChathubContext _dbContext;
        public RoleRepository(ChathubContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateAsync(Role entity)
        {
            await _dbContext.AddAsync(entity);
        }

        public async Task<List<Role>> GetAsync(Func<Role, bool> predicate)
        {
            return _dbContext.Roles.Where(predicate).ToList();
        }

        public async Task<List<Role>> GetWithAsync(Func<Role, bool> predicate, params Expression<Func<Role, object>>[] options)
        {
            var roleSet = _dbContext.Set<Role>().AsQueryable();
            var properties = options.Aggregate(roleSet, (role, next) => role.Include(next));
            return properties.Where(predicate).ToList();
        }

        public async Task RemoveAsync(Role entity)
        {
            if(_dbContext.Entry(entity).State != EntityState.Detached)
            {
                _dbContext.Entry(entity).State = EntityState.Deleted;
            }
        }

        public async Task RemoveAsync(Func<Role, bool> predicate)
        {
            var roleList = _dbContext.Roles.Where(predicate).ToList();
            foreach(var role in roleList)
            {
                if(_dbContext.Entry(role).State != EntityState.Detached)
                {
                    _dbContext.Entry(role).State = EntityState.Deleted;
                }
            }
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Role entity)
        {
            if(_dbContext.Entry(entity).State == EntityState.Detached)
            {
                _dbContext.Attach(entity);
            }
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
