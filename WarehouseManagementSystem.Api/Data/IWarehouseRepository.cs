using WarehouseManagementSystem.Api.Models;

namespace WarehouseManagementSystem.Api.Data
{
    public interface IWarehouseRepository : IRepository<Warehouse>
    {
        // Add Warehouse-specific methods here if needed
        // For example: Task<Warehouse?> GetWarehouseWithShelvesAndStockAsync(int warehouseId);
    }
} 