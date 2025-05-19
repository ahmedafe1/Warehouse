using Microsoft.EntityFrameworkCore;
using WarehouseManagementSystem.Api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Data
{
    public class StockRepository : Repository<Stock>, IStockRepository
    {
        public StockRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Stock>> GetAllAsync()
        {
            return await _dbSet
                .Include(s => s.Item).ThenInclude(i => i.Supplier) // Include Supplier from Item
                .Include(s => s.Shelf).ThenInclude(sh => sh.Warehouse) // Include Warehouse from Shelf
                .ToListAsync();
        }

        public override async Task<Stock?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(s => s.Item).ThenInclude(i => i.Supplier)
                .Include(s => s.Shelf).ThenInclude(sh => sh.Warehouse)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Stock?> GetByItemIdAndShelfIdAsync(int itemId, int shelfId)
        {
            return await _dbSet
                .Include(s => s.Item).ThenInclude(i => i.Supplier)
                .Include(s => s.Shelf).ThenInclude(sh => sh.Warehouse)
                .FirstOrDefaultAsync(s => s.ItemId == itemId && s.ShelfId == shelfId);
        }
        
        public async Task<IEnumerable<Stock>> GetStockByShelfIdAsync(int shelfId)
        {
            return await _dbSet
                .Where(s => s.ShelfId == shelfId)
                .Include(s => s.Item).ThenInclude(i => i.Supplier)
                .Include(s => s.Shelf).ThenInclude(sh => sh.Warehouse)
                .ToListAsync();
        }

        public async Task<IEnumerable<Stock>> GetStockByItemIdAsync(int itemId)
        {
            return await _dbSet
                .Where(s => s.ItemId == itemId)
                .Include(s => s.Item).ThenInclude(i => i.Supplier)
                .Include(s => s.Shelf).ThenInclude(sh => sh.Warehouse)
                .ToListAsync();
        }
    }
} 