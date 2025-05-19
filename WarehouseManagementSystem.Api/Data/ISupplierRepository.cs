using WarehouseManagementSystem.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Data
{
    public interface ISupplierRepository : IRepository<Supplier>
    {
        // Example: Task<Supplier?> GetSupplierWithItemsAsync(int supplierId);
        // Add other Supplier-specific methods here if needed
    }
} 