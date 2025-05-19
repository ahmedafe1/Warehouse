using WarehouseManagementSystem.Api.Models;
using System.Threading.Tasks;
using System.Collections.Generic; // Added for IEnumerable

namespace WarehouseManagementSystem.Api.Data
{
    public interface IShelfRepository : IRepository<Shelf>
    {
        Task<IEnumerable<Shelf>> GetShelvesByWarehouseIdAsync(int warehouseId);
        // Add other Shelf-specific methods here if needed
    }
} 