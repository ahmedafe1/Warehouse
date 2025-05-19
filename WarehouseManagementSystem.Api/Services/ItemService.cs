using WarehouseManagementSystem.Api.Data;
using WarehouseManagementSystem.Api.Models;
using WarehouseManagementSystem.Api.Dtos; // Added for DTOs
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Linq; // Added for Select
using Microsoft.EntityFrameworkCore; // Added for DbUpdateException

namespace WarehouseManagementSystem.Api.Services
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;
        private readonly ISupplierRepository _supplierRepository; // To validate SupplierId
        private readonly ILogger<ItemService> _logger;
        private readonly ApplicationDbContext _context; // For SaveChangesAsync

        public ItemService(IItemRepository itemRepository, ISupplierRepository supplierRepository, ILogger<ItemService> logger, ApplicationDbContext context)
        {
            _itemRepository = itemRepository;
            _supplierRepository = supplierRepository; // Injected
            _logger = logger;
            _context = context; 
        }

        public async Task<IEnumerable<ItemDto>> GetAllItemsAsync()
        {
            _logger.LogInformation("Getting all items");
            var items = await _itemRepository.GetAllAsync();
            return items.Select(item => MapToItemDto(item));
        }

        public async Task<ItemDto?> GetItemByIdAsync(int id)
        {
            _logger.LogInformation("Getting item by id {ItemId}", id);
            var item = await _itemRepository.GetByIdAsync(id);
            return item == null ? null : MapToItemDto(item);
        }

        public async Task<ItemDto?> CreateItemAsync(CreateItemDto createItemDto)
        {
            _logger.LogInformation("Creating new item with name {ItemName}", createItemDto.Name);
            
            // Validate SupplierId exists
            if (!await _supplierRepository.AnyAsync(s => s.Id == createItemDto.SupplierId))
            {
                _logger.LogWarning("Supplier with Id {SupplierId} not found while creating item.", createItemDto.SupplierId);
                return null; // Or throw a specific validation exception
            }

            var item = new Item
            {
                Name = createItemDto.Name,
                Description = createItemDto.Description,
                Price = createItemDto.Price,
                SupplierId = createItemDto.SupplierId
            };

            await _itemRepository.AddAsync(item);
            try
            {
                await _context.SaveChangesAsync(); 
                // Fetch the item again to get the populated Supplier navigation property for mapping
                var createdItem = await _itemRepository.GetByIdAsync(item.Id);
                return createdItem == null ? null : MapToItemDto(createdItem);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error creating item {ItemName}", createItemDto.Name);
                return null;
            }
        }

        public async Task<bool> UpdateItemAsync(int id, UpdateItemDto updateItemDto)
        {
            _logger.LogInformation("Updating item with id {ItemId}", id);
            var existingItem = await _itemRepository.GetByIdAsync(id);
            if (existingItem == null)
            {
                _logger.LogWarning("Item with id {ItemId} not found for update", id);
                return false;
            }

            // Validate SupplierId exists if it's being changed or to be safe
            if (existingItem.SupplierId != updateItemDto.SupplierId && 
                !await _supplierRepository.AnyAsync(s => s.Id == updateItemDto.SupplierId))
            {
                _logger.LogWarning("Supplier with Id {SupplierId} not found while updating item.", updateItemDto.SupplierId);
                return false; // Or throw a specific validation exception
            }

            existingItem.Name = updateItemDto.Name;
            existingItem.Description = updateItemDto.Description;
            existingItem.Price = updateItemDto.Price;
            existingItem.SupplierId = updateItemDto.SupplierId;

            _itemRepository.Update(existingItem);
            try
            {
                await _context.SaveChangesAsync(); 
                return true;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error updating item {ItemId}", id);
                return false;
            }
        }

        public async Task<bool> DeleteItemAsync(int id)
        {
            _logger.LogInformation("Deleting item with id {ItemId}", id);
            var itemToDelete = await _itemRepository.GetByIdAsync(id);
            if (itemToDelete == null)
            {
                _logger.LogWarning("Item with id {ItemId} not found for deletion", id);
                return false;
            }

            _itemRepository.Remove(itemToDelete);
            try
            {
                await _context.SaveChangesAsync(); 
                return true;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error deleting item {ItemId}", id);
                return false;
            }
        }

        private ItemDto MapToItemDto(Item item)
        {
            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                Price = item.Price,
                SupplierId = item.SupplierId,
                Supplier = item.Supplier != null ? new SupplierMinimalDto { Id = item.Supplier.Id, Name = item.Supplier.Name } : null
            };
        }
    }
} 