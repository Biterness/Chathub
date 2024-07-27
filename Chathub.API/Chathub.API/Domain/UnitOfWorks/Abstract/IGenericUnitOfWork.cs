namespace Chathub.API.Domain.UnitOfWorks.Abstract
{
    public interface IGenericUnitOfWork<T> where T : class
    {
        Task SaveChangeAsync();
    }
}
