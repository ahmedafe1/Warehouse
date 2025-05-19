using WarehouseManagementSystem.Api.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Services
{
    public interface ISupplierService
    {
        Task<IEnumerable<SupplierDto>> GetAllSuppliersAsync();
        Task<SupplierDto?> GetSupplierByIdAsync(int id);
        Task<SupplierDto?> CreateSupplierAsync(CreateSupplierDto createSupplierDto);
        Task<bool> UpdateSupplierAsync(int id, UpdateSupplierDto updateSupplierDto);
        Task<bool> DeleteSupplierAsync(int id);
    }
} 