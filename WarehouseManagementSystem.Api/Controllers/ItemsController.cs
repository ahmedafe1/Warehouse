using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Services;
using System.Collections.Generic; // Required for IEnumerable

namespace WarehouseManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize] // Uncomment to secure all actions in this controller
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _itemService;
        private readonly ILogger<ItemsController> _logger;

        public ItemsController(IItemService itemService, ILogger<ItemsController> logger)
        {
            _itemService = itemService;
            _logger = logger;
        }

        // GET: api/Items
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ItemDto>), 200)]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
        {
            _logger.LogInformation("Attempting to retrieve all items.");
            var items = await _itemService.GetAllItemsAsync();
            return Ok(items);
        }

        // GET: api/Items/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ItemDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<ItemDto>> GetItem(int id)
        {
            _logger.LogInformation("Attempting to retrieve item with ID: {ItemId}", id);
            var item = await _itemService.GetItemByIdAsync(id);

            if (item == null)
            {
                _logger.LogWarning("Item with ID: {ItemId} not found.", id);
                return NotFound();
            }

            return Ok(item);
        }

        // POST: api/Items
        [HttpPost]
        [ProducesResponseType(typeof(ItemDto), 201)]
        [ProducesResponseType(400)]
        // [Authorize(Roles = "Manager,SuperAdmin,Logistic")] // Example: Who can create items?
        public async Task<ActionResult<ItemDto>> PostItem([FromBody] CreateItemDto createItemDto)
        {
            _logger.LogInformation("Attempting to create a new item: {ItemName}", createItemDto.Name);
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for creating item: {ItemName}", createItemDto.Name);
                return BadRequest(ModelState);
            }

            var createdItem = await _itemService.CreateItemAsync(createItemDto);
            
            if (createdItem == null)
            {
                // Service layer should log the specific reason (e.g., supplier not found)
                _logger.LogError("Failed to create item: {ItemName}. Service returned null.", createItemDto.Name);
                return BadRequest("Could not create item. Check supplier ID or logs."); 
            }

            _logger.LogInformation("Item created successfully with ID: {ItemId}", createdItem.Id);
            return CreatedAtAction(nameof(GetItem), new { id = createdItem.Id }, createdItem);
        }

        // PUT: api/Items/5
        [HttpPut("{id}")]
        [ProducesResponseType(204)] // No Content
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        // [Authorize(Roles = "Manager,SuperAdmin,Logistic")] // Example: Who can update items?
        public async Task<IActionResult> PutItem(int id, [FromBody] UpdateItemDto updateItemDto)
        {
            _logger.LogInformation("Attempting to update item with ID: {ItemId}", id);
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for updating item ID: {ItemId}", id);
                return BadRequest(ModelState);
            }
            
            var success = await _itemService.UpdateItemAsync(id, updateItemDto);

            if (!success)
            {
                _logger.LogWarning("Update failed for item ID: {ItemId}. It might not exist, or supplier ID invalid.", id);
                return NotFound("Item not found or update failed due to invalid data (e.g., supplier ID). Check logs.");
            }
            _logger.LogInformation("Item with ID: {ItemId} updated successfully.", id);
            return NoContent();
        }

        // DELETE: api/Items/5
        [HttpDelete("{id}")]
        [ProducesResponseType(204)] // No Content
        [ProducesResponseType(404)]
        // [Authorize(Roles = "SuperAdmin,Manager")] // Example: Who can delete items?
        public async Task<IActionResult> DeleteItem(int id)
        {
            _logger.LogInformation("Attempting to delete item with ID: {ItemId}", id);
            var success = await _itemService.DeleteItemAsync(id);

            if (!success)
            {
                _logger.LogWarning("Delete failed for item ID: {ItemId}. Item not found.", id);
                return NotFound();
            }
            _logger.LogInformation("Item with ID: {ItemId} deleted successfully.", id);
            return NoContent();
        }
    }
} 