using WarehouseManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Data
{
    public class ItemRepository : Repository<Item>, IItemRepository
    {
        public ItemRepository(ApplicationDbContext context) : base(context)
        {
        }

        // Example of overriding a method to include related data:
        public override async Task<IEnumerable<Item>> GetAllAsync()
        {
            return await _dbSet.Include(i => i.Supplier).ToListAsync();
        }

        public override async Task<Item?> GetByIdAsync(int id)
        {
            return await _dbSet.Include(i => i.Supplier).FirstOrDefaultAsync(i => i.Id == id);
        }

        // Implement Item-specific methods here if defined in IItemRepository
        // For example:
        // public async Task<IEnumerable<Item>> GetItemsBySupplierAsync(int supplierId)
        // {
        //     return await _dbSet.Where(i => i.SupplierId == supplierId).Include(i => i.Supplier).ToListAsync();
        // }
    }
} 