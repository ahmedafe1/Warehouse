using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Services
{
    public interface IItemService
    {
        Task<IEnumerable<ItemDto>> GetAllItemsAsync();
        Task<ItemDto?> GetItemByIdAsync(int id);
        Task<ItemDto?> CreateItemAsync(CreateItemDto createItemDto);
        Task<bool> UpdateItemAsync(int id, UpdateItemDto updateItemDto);
        Task<bool> DeleteItemAsync(int id);
    }
} 