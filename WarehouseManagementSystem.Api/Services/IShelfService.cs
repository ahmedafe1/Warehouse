using WarehouseManagementSystem.Api.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Services
{
    public interface IShelfService
    {
        Task<IEnumerable<ShelfDto>> GetAllShelvesAsync();
        Task<IEnumerable<ShelfDto>> GetShelvesByWarehouseIdAsync(int warehouseId);
        Task<ShelfDto?> GetShelfByIdAsync(int id);
        Task<ShelfDto?> CreateShelfAsync(CreateShelfDto createShelfDto);
        Task<bool> UpdateShelfAsync(int id, UpdateShelfDto updateShelfDto);
        Task<bool> DeleteShelfAsync(int id);
    }
} 