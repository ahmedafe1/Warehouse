using Microsoft.EntityFrameworkCore;
using WarehouseManagementSystem.Api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Data
{
    public class SupplierRepository : Repository<Supplier>, ISupplierRepository
    {
        public SupplierRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Supplier>> GetAllAsync()
        {
            // Include Items by default when getting all suppliers
            return await _dbSet.Include(s => s.Items).ToListAsync();
        }

        public override async Task<Supplier?> GetByIdAsync(int id)
        {
            // Include Items by default when getting a supplier by ID
            return await _dbSet.Include(s => s.Items).FirstOrDefaultAsync(s => s.Id == id);
        }

        // Example implementation for a specific method if defined in ISupplierRepository:
        // public async Task<Supplier?> GetSupplierWithItemsAsync(int supplierId)
        // {
        //     return await _dbSet.Include(s => s.Items).FirstOrDefaultAsync(s => s.Id == supplierId);
        // }
    }
} 