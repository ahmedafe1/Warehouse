using WarehouseManagementSystem.Api.Models;

namespace WarehouseManagementSystem.Api.Data
{
    public interface IItemRepository : IRepository<Item>
    {
        // Add Item-specific methods here if needed in the future
        // For example: Task<IEnumerable<Item>> GetItemsBySupplierAsync(int supplierId);
    }
} 