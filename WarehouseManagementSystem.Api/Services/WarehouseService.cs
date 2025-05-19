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
    public class WarehouseService : IWarehouseService
    {
        private readonly IWarehouseRepository _warehouseRepository;
        private readonly ILogger<WarehouseService> _logger;
        private readonly ApplicationDbContext _context; // For SaveChangesAsync

        public WarehouseService(IWarehouseRepository warehouseRepository, ILogger<WarehouseService> logger, ApplicationDbContext context)
        {
            _warehouseRepository = warehouseRepository;
            _logger = logger;
            _context = context;
        }

        public async Task<IEnumerable<WarehouseDto>> GetAllWarehousesAsync()
        {
            _logger.LogInformation("Fetching all warehouses");
            var warehouses = await _warehouseRepository.GetAllAsync();
            return warehouses.Select(w => MapToWarehouseDto(w));
        }

        public async Task<WarehouseDto?> GetWarehouseByIdAsync(int id)
        {
            _logger.LogInformation("Fetching warehouse with ID: {WarehouseId}", id);
            var warehouse = await _warehouseRepository.GetByIdAsync(id);
            return warehouse == null ? null : MapToWarehouseDto(warehouse);
        }

        public async Task<WarehouseDto?> CreateWarehouseAsync(CreateWarehouseDto createWarehouseDto)
        {
            _logger.LogInformation("Creating new warehouse: {WarehouseName}", createWarehouseDto.Name);
            var warehouse = new Warehouse
            {
                Name = createWarehouseDto.Name,
                Location = createWarehouseDto.Location
                // Shelves will be empty by default
            };

            await _warehouseRepository.AddAsync(warehouse);
            try
            {
                await _context.SaveChangesAsync();
                // Re-fetch to ensure related data (if any was auto-created by DB or EF) is loaded for DTO mapping
                var createdWarehouse = await _warehouseRepository.GetByIdAsync(warehouse.Id);
                return createdWarehouse == null ? null : MapToWarehouseDto(createdWarehouse);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error creating warehouse {WarehouseName}", createWarehouseDto.Name);
                return null; 
            }
        }

        public async Task<bool> UpdateWarehouseAsync(int id, UpdateWarehouseDto updateWarehouseDto)
        {
            _logger.LogInformation("Updating warehouse with ID: {WarehouseId}", id);
            var existingWarehouse = await _warehouseRepository.GetByIdAsync(id);
            if (existingWarehouse == null)
            {
                _logger.LogWarning("Warehouse with ID {WarehouseId} not found for update.", id);
                return false;
            }

            existingWarehouse.Name = updateWarehouseDto.Name;
            existingWarehouse.Location = updateWarehouseDto.Location;

            _warehouseRepository.Update(existingWarehouse);
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error updating warehouse {WarehouseId}", id);
                return false;
            }
        }

        public async Task<bool> DeleteWarehouseAsync(int id)
        {
            _logger.LogInformation("Deleting warehouse with ID: {WarehouseId}", id);
            var warehouseToDelete = await _warehouseRepository.GetByIdAsync(id);
            if (warehouseToDelete == null)
            {
                _logger.LogWarning("Warehouse with ID {WarehouseId} not found for deletion.", id);
                return false;
            }

            // Business logic check: Cannot delete warehouse if it has shelves
            if (warehouseToDelete.Shelves.Any())
            {
                _logger.LogWarning("Cannot delete warehouse ID {WarehouseId} because it contains shelves.", id);
                return false; // Or throw a custom exception with a clear message
            }

            _warehouseRepository.Remove(warehouseToDelete);
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException ex)
            {
                 // This might happen if, despite the check, shelves were added concurrently, or if other constraints exist.
                _logger.LogError(ex, "Error deleting warehouse {WarehouseId}. It might be in use or another DB error occurred.", id);
                return false;
            }
        }

        private WarehouseDto MapToWarehouseDto(Warehouse warehouse)
        {
            return new WarehouseDto
            {
                Id = warehouse.Id,
                Name = warehouse.Name,
                Location = warehouse.Location,
                Shelves = warehouse.Shelves?.Select(s => new ShelfMinimalDto { Id = s.Id, Code = s.Code }).ToList() ?? new List<ShelfMinimalDto>()
            };
        }
    }
} 