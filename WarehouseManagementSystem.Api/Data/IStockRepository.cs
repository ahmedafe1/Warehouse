using WarehouseManagementSystem.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Data
{
    public interface IStockRepository : IRepository<Stock>
    {
        Task<Stock?> GetByItemIdAndShelfIdAsync(int itemId, int shelfId);
        Task<IEnumerable<Stock>> GetStockByShelfIdAsync(int shelfId);
        Task<IEnumerable<Stock>> GetStockByItemIdAsync(int itemId);
    }
} 