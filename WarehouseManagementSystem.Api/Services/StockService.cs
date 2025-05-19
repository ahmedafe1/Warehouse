using AutoMapper;
using Microsoft.Extensions.Logging;
using WarehouseManagementSystem.Api.Data;
using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WarehouseManagementSystem.Api.Services
{
    public class StockService : IStockService
    {
        private readonly IStockRepository _stockRepository;
        private readonly IItemRepository _itemRepository; // To validate item existence
        private readonly IShelfRepository _shelfRepository; // To validate shelf existence
        private readonly IMapper _mapper;
        private readonly ILogger<StockService> _logger;

        public StockService(
            IStockRepository stockRepository,
            IItemRepository itemRepository,
            IShelfRepository shelfRepository,
            IMapper mapper,
            ILogger<StockService> logger)
        {
            _stockRepository = stockRepository;
            _itemRepository = itemRepository;
            _shelfRepository = shelfRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<StockDto?> GetStockByIdAsync(int id)
        {
            _logger.LogInformation("Getting stock by ID: {Id}", id);
            var stock = await _stockRepository.GetByIdAsync(id);
            return stock == null ? null : _mapper.Map<StockDto>(stock);
        }

        public async Task<IEnumerable<StockDto>> GetAllStocksAsync()
        {
            _logger.LogInformation("Getting all stock items.");
            var stocks = await _stockRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<StockDto>>(stocks);
        }

        public async Task<IEnumerable<StockDto>> GetStocksByShelfIdAsync(int shelfId)
        {
            _logger.LogInformation("Getting stocks for shelf ID: {ShelfId}", shelfId);
            var stocks = await _stockRepository.GetStockByShelfIdAsync(shelfId);
            return _mapper.Map<IEnumerable<StockDto>>(stocks);
        }

        public async Task<IEnumerable<StockDto>> GetStocksByItemIdAsync(int itemId)
        {
            _logger.LogInformation("Getting stocks for item ID: {ItemId}", itemId);
            var stocks = await _stockRepository.GetStockByItemIdAsync(itemId);
            return _mapper.Map<IEnumerable<StockDto>>(stocks);
        }

        public async Task<StockDto?> GetStockByItemIdAndShelfIdAsync(int itemId, int shelfId)
        {
            _logger.LogInformation("Getting stock for Item ID: {ItemId} and Shelf ID: {ShelfId}", itemId, shelfId);
            var stock = await _stockRepository.GetByItemIdAndShelfIdAsync(itemId, shelfId);
            return stock == null ? null : _mapper.Map<StockDto>(stock);
        }

        public async Task<(StockDto? stockDto, string? error)> CreateStockAsync(CreateStockDto createStockDto)
        {
            _logger.LogInformation("Attempting to create stock for Item ID: {ItemId} on Shelf ID: {ShelfId}", createStockDto.ItemId, createStockDto.ShelfId);

            var itemExists = await _itemRepository.GetByIdAsync(createStockDto.ItemId);
            if (itemExists == null)
            {
                _logger.LogWarning("CreateStockAsync: Item with ID {ItemId} not found.", createStockDto.ItemId);
                return (null, $"Item with ID {createStockDto.ItemId} not found.");
            }

            var shelfExists = await _shelfRepository.GetByIdAsync(createStockDto.ShelfId);
            if (shelfExists == null)
            {
                _logger.LogWarning("CreateStockAsync: Shelf with ID {ShelfId} not found.", createStockDto.ShelfId);
                return (null, $"Shelf with ID {createStockDto.ShelfId} not found.");
            }

            var existingStock = await _stockRepository.GetByItemIdAndShelfIdAsync(createStockDto.ItemId, createStockDto.ShelfId);
            if (existingStock != null)
            {
                _logger.LogWarning("CreateStockAsync: Stock for Item ID {ItemId} on Shelf ID {ShelfId} already exists. Updating quantity.", createStockDto.ItemId, createStockDto.ShelfId);
                existingStock.Quantity += createStockDto.Quantity;
                existingStock.LastUpdated = DateTime.UtcNow;
                _stockRepository.Update(existingStock);
                await _stockRepository.SaveAsync();
                var updatedStockWithIncludes = await _stockRepository.GetByIdAsync(existingStock.Id);
                return (_mapper.Map<StockDto>(updatedStockWithIncludes), null);
            }

            var stock = _mapper.Map<Stock>(createStockDto);
            stock.LastUpdated = DateTime.UtcNow;

            await _stockRepository.AddAsync(stock);
            await _stockRepository.SaveAsync();
            var createdStockWithIncludes = await _stockRepository.GetByIdAsync(stock.Id);
            _logger.LogInformation("Successfully created stock with ID: {StockId}", stock.Id);
            return (_mapper.Map<StockDto>(createdStockWithIncludes), null);
        }

        public async Task<(StockDto? stockDto, string? error)> UpdateStockQuantityAsync(int stockId, UpdateStockQuantityDto updateStockQuantityDto)
        {
            _logger.LogInformation("Attempting to update quantity for stock ID: {StockId}", stockId);
            var stock = await _stockRepository.GetByIdAsync(stockId); // Fetch with includes for consistent DTO mapping

            if (stock == null)
            {
                _logger.LogWarning("UpdateStockQuantityAsync: Stock with ID {StockId} not found.", stockId);
                return (null, $"Stock with ID {stockId} not found.");
            }

            stock.Quantity = updateStockQuantityDto.Quantity;
            stock.LastUpdated = DateTime.UtcNow;

            _stockRepository.Update(stock);
            await _stockRepository.SaveAsync();
            _logger.LogInformation("Successfully updated quantity for stock ID: {StockId}", stockId);
            var updatedStockWithIncludes = await _stockRepository.GetByIdAsync(stock.Id); // Reload for includes
            return (_mapper.Map<StockDto>(updatedStockWithIncludes), null);
        }

        public async Task<(bool success, string? error)> DeleteStockAsync(int stockId)
        {
            _logger.LogInformation("Attempting to delete stock with ID: {StockId}", stockId);
            var stock = await _stockRepository.GetByIdAsync(stockId);

            if (stock == null)
            {
                _logger.LogWarning("DeleteStockAsync: Stock with ID {StockId} not found.", stockId);
                return (false, $"Stock with ID {stockId} not found.");
            }

            _stockRepository.Remove(stock);
            await _stockRepository.SaveAsync();
            _logger.LogInformation("Successfully deleted stock with ID: {StockId}", stockId);
            return (true, null);
        }
    }
} 