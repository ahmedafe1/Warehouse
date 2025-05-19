using WarehouseManagementSystem.Api.Data;
using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore; // For DbUpdateException

namespace WarehouseManagementSystem.Api.Services
{
    public class ShelfService : IShelfService
    {
        private readonly IShelfRepository _shelfRepository;
        private readonly IWarehouseRepository _warehouseRepository; // To validate WarehouseId
        private readonly ILogger<ShelfService> _logger;
        private readonly ApplicationDbContext _context; 

        public ShelfService(IShelfRepository shelfRepository, IWarehouseRepository warehouseRepository, ILogger<ShelfService> logger, ApplicationDbContext context)
        {
            _shelfRepository = shelfRepository;
            _warehouseRepository = warehouseRepository;
            _logger = logger;
            _context = context;
        }

        public async Task<IEnumerable<ShelfDto>> GetAllShelvesAsync()
        {
            _logger.LogInformation("Fetching all shelves");
            var shelves = await _shelfRepository.GetAllAsync();
            return shelves.Select(s => MapToShelfDto(s));
        }
        
        public async Task<IEnumerable<ShelfDto>> GetShelvesByWarehouseIdAsync(int warehouseId)
        {
            _logger.LogInformation("Fetching shelves for warehouse ID: {WarehouseId}", warehouseId);
            if (!await _warehouseRepository.AnyAsync(w => w.Id == warehouseId))
            {
                _logger.LogWarning("Warehouse with ID {WarehouseId} not found when fetching shelves.", warehouseId);
                return new List<ShelfDto>(); // Or throw NotFoundException, or return null based on desired API contract
            }
            var shelves = await _shelfRepository.GetShelvesByWarehouseIdAsync(warehouseId);
            return shelves.Select(s => MapToShelfDto(s));
        }

        public async Task<ShelfDto?> GetShelfByIdAsync(int id)
        {
            _logger.LogInformation("Fetching shelf with ID: {ShelfId}", id);
            var shelf = await _shelfRepository.GetByIdAsync(id);
            return shelf == null ? null : MapToShelfDto(shelf);
        }

        public async Task<ShelfDto?> CreateShelfAsync(CreateShelfDto createShelfDto)
        {
            _logger.LogInformation("Creating new shelf with code: {ShelfCode} for Warehouse ID: {WarehouseId}", createShelfDto.Code, createShelfDto.WarehouseId);
            
            if (!await _warehouseRepository.AnyAsync(w => w.Id == createShelfDto.WarehouseId))
            {
                _logger.LogWarning("Warehouse with ID {WarehouseId} not found. Cannot create shelf.", createShelfDto.WarehouseId);
                return null; // Indicate failure, controller can return BadRequest or NotFound
            }
            
            // Optional: Check for duplicate shelf code within the same warehouse
            if (await _shelfRepository.AnyAsync(s => s.WarehouseId == createShelfDto.WarehouseId && s.Code == createShelfDto.Code))
            {
                 _logger.LogWarning("Shelf with code {ShelfCode} already exists in Warehouse ID {WarehouseId}.", createShelfDto.Code, createShelfDto.WarehouseId);
                return null; // Indicate duplicate
            }

            var shelf = new Shelf
            {
                Code = createShelfDto.Code,
                WarehouseId = createShelfDto.WarehouseId
            };

            await _shelfRepository.AddAsync(shelf);
            try
            {
                await _context.SaveChangesAsync();
                var createdShelf = await _shelfRepository.GetByIdAsync(shelf.Id); // Re-fetch to get includes
                return createdShelf == null ? null : MapToShelfDto(createdShelf);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error creating shelf {ShelfCode}", createShelfDto.Code);
                return null;
            }
        }

        public async Task<bool> UpdateShelfAsync(int id, UpdateShelfDto updateShelfDto)
        {
            _logger.LogInformation("Updating shelf with ID: {ShelfId}", id);
            var existingShelf = await _shelfRepository.GetByIdAsync(id);
            if (existingShelf == null)
            {
                _logger.LogWarning("Shelf with ID {ShelfId} not found for update.", id);
                return false;
            }

            // Optional: Check for duplicate shelf code within the same warehouse if code is being changed
            if (existingShelf.Code != updateShelfDto.Code && 
                await _shelfRepository.AnyAsync(s => s.WarehouseId == existingShelf.WarehouseId && s.Code == updateShelfDto.Code && s.Id != id))
            {
                _logger.LogWarning("Shelf with code {ShelfCode} already exists in Warehouse ID {WarehouseId} (while updating ID {ShelfId}).", 
                                updateShelfDto.Code, existingShelf.WarehouseId, id);
                return false; // Indicate duplicate
            }

            existingShelf.Code = updateShelfDto.Code;
            // existingShelf.WarehouseId is not updated as per DTO design

            _shelfRepository.Update(existingShelf);
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error updating shelf {ShelfId}", id);
                return false;
            }
        }

        public async Task<bool> DeleteShelfAsync(int id)
        {
            _logger.LogInformation("Deleting shelf with ID: {ShelfId}", id);
            var shelfToDelete = await _shelfRepository.GetByIdAsync(id); 
            if (shelfToDelete == null)
            {
                _logger.LogWarning("Shelf with ID {ShelfId} not found for deletion.", id);
                return false;
            }

            if (shelfToDelete.Stocks.Any())
            {
                _logger.LogWarning("Cannot delete shelf ID {ShelfId} because it contains stock items.", id);
                return false; 
            }

            _shelfRepository.Remove(shelfToDelete);
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error deleting shelf {ShelfId}", id);
                return false;
            }
        }

        private ShelfDto MapToShelfDto(Shelf shelf)
        {
            return new ShelfDto
            {
                Id = shelf.Id,
                Code = shelf.Code,
                WarehouseId = shelf.WarehouseId,
                Warehouse = shelf.Warehouse != null ? new WarehouseMinimalDto { Id = shelf.Warehouse.Id, Name = shelf.Warehouse.Name, Location = shelf.Warehouse.Location } : null,
                Stocks = shelf.Stocks?.Select(st => new StockMinimalDto 
                { 
                    Id = st.Id, 
                    ItemId = st.ItemId, 
                    ItemName = st.Item?.Name ?? "N/A", // Handle if Item is not loaded or null
                    Quantity = st.Quantity 
                }).ToList() ?? new List<StockMinimalDto>()
            };
        }
    }
} 