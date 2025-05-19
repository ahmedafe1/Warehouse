using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Services
{
    public interface IStockService
    {
        Task<StockDto?> GetStockByIdAsync(int id);
        Task<IEnumerable<StockDto>> GetAllStocksAsync();
        Task<IEnumerable<StockDto>> GetStocksByShelfIdAsync(int shelfId);
        Task<IEnumerable<StockDto>> GetStocksByItemIdAsync(int itemId);
        Task<StockDto?> GetStockByItemIdAndShelfIdAsync(int itemId, int shelfId);
        Task<(StockDto? stockDto, string? error)> CreateStockAsync(CreateStockDto createStockDto);
        Task<(StockDto? stockDto, string? error)> UpdateStockQuantityAsync(int stockId, UpdateStockQuantityDto updateStockQuantityDto);
        Task<(bool success, string? error)> DeleteStockAsync(int stockId);
    }
} 