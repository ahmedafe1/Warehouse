using Microsoft.EntityFrameworkCore;
using WarehouseManagementSystem.Api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Data
{
    public class ShelfRepository : Repository<Shelf>, IShelfRepository
    {
        public ShelfRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Shelf>> GetAllAsync()
        {
            // Include Warehouse and Stocks (with Item) by default
            return await _dbSet
                .Include(s => s.Warehouse)
                .Include(s => s.Stocks).ThenInclude(st => st.Item)
                .ToListAsync();
        }

        public override async Task<Shelf?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(s => s.Warehouse)
                .Include(s => s.Stocks).ThenInclude(st => st.Item)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<Shelf>> GetShelvesByWarehouseIdAsync(int warehouseId)
        {
            return await _dbSet
                .Where(s => s.WarehouseId == warehouseId)
                .Include(s => s.Warehouse)
                .Include(s => s.Stocks).ThenInclude(st => st.Item)
                .ToListAsync();
        }
    }
} 