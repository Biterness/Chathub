using Chathub.API.Infrastructure.Data.Entities;
using System.Linq.Expressions;

namespace Chathub.API.Infrastructure.Repositories.Abstract
{
    public interface IGenericRepository<T> : IDisposable where T : class
    {
        Task<List<T>> GetAsync(Func<T, bool> predicate);
        Task<List<T>> GetWithAsync(Func<T, bool> predicate, params Expression<Func<T, object>>[] options);
        Task CreateAsync(T entity);
        Task UpdateAsync(T entity);
        Task RemoveAsync(T entity);
        Task RemoveAsync(Func<T, bool> predicate);
        Task SaveChangesAsync();
    }
}
