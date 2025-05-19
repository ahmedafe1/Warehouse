using Microsoft.EntityFrameworkCore;
using WarehouseManagementSystem.Api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Data
{
    public class WarehouseRepository : Repository<Warehouse>, IWarehouseRepository
    {
        public WarehouseRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Warehouse>> GetAllAsync()
        {
            return await _dbSet.Include(w => w.Shelves).ToListAsync();
        }

        public override async Task<Warehouse?> GetByIdAsync(int id)
        {
            return await _dbSet.Include(w => w.Shelves).FirstOrDefaultAsync(w => w.Id == id);
        }

        // Example of a more complex include if needed:
        // public async Task<Warehouse?> GetWarehouseWithShelvesAndStockAsync(int warehouseId)
        // {
        //     return await _dbSet
        //         .Include(w => w.Shelves)
        //             .ThenInclude(s => s.Stocks) // If Shelf has a Stocks collection
        //                 .ThenInclude(st => st.Item) // If Stock has an Item navigation property
        //         .FirstOrDefaultAsync(w => w.Id == warehouseId);
        // }
    }
} 