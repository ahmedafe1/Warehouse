using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Services;
using System.Collections.Generic;

namespace WarehouseManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class ShelvesController : ControllerBase
    {
        private readonly IShelfService _shelfService;
        private readonly ILogger<ShelvesController> _logger;

        public ShelvesController(IShelfService shelfService, ILogger<ShelvesController> logger)
        {
            _shelfService = shelfService;
            _logger = logger;
        }

        // GET: api/Shelves
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ShelfDto>), 200)]
        public async Task<ActionResult<IEnumerable<ShelfDto>>> GetShelves([FromQuery] int? warehouseId)
        {
            if (warehouseId.HasValue)
            {
                _logger.LogInformation("Attempting to retrieve all shelves for warehouse ID: {WarehouseId}.", warehouseId.Value);
                var shelvesByWarehouse = await _shelfService.GetShelvesByWarehouseIdAsync(warehouseId.Value);
                return Ok(shelvesByWarehouse);
            }
            
            _logger.LogInformation("Attempting to retrieve all shelves.");
            var shelves = await _shelfService.GetAllShelvesAsync();
            return Ok(shelves);
        }

        // GET: api/Shelves/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ShelfDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<ShelfDto>> GetShelf(int id)
        {
            _logger.LogInformation("Attempting to retrieve shelf with ID: {ShelfId}", id);
            var shelf = await _shelfService.GetShelfByIdAsync(id);

            if (shelf == null)
            {
                _logger.LogWarning("Shelf with ID: {ShelfId} not found.", id);
                return NotFound();
            }
            return Ok(shelf);
        }

        // POST: api/Shelves
        [HttpPost]
        [ProducesResponseType(typeof(ShelfDto), 201)]
        [ProducesResponseType(400)]
        // [Authorize(Roles = "Manager,SuperAdmin")] 
        public async Task<ActionResult<ShelfDto>> PostShelf([FromBody] CreateShelfDto createShelfDto)
        {
            _logger.LogInformation("Attempting to create a new shelf with code: {ShelfCode} for WarehouseId: {WarehouseId}", createShelfDto.Code, createShelfDto.WarehouseId);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdShelf = await _shelfService.CreateShelfAsync(createShelfDto);
            if (createdShelf == null)
            {
                // Service layer logs specific reason (e.g., warehouse not found, duplicate code)
                _logger.LogError("Failed to create shelf. Service returned null. Check logs for details (e.g. WarehouseId or duplicate code).");
                return BadRequest("Could not create shelf. Warehouse not found, duplicate shelf code, or other validation error.");
            }

            _logger.LogInformation("Shelf created successfully with ID: {ShelfId}", createdShelf.Id);
            return CreatedAtAction(nameof(GetShelf), new { id = createdShelf.Id }, createdShelf);
        }

        // PUT: api/Shelves/5
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        // [Authorize(Roles = "Manager,SuperAdmin")]
        public async Task<IActionResult> PutShelf(int id, [FromBody] UpdateShelfDto updateShelfDto)
        {
            _logger.LogInformation("Attempting to update shelf with ID: {ShelfId}", id);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _shelfService.UpdateShelfAsync(id, updateShelfDto);
            if (!success)
            {
                // Service layer logs specific reason (shelf not found, duplicate code)
                _logger.LogWarning("Update failed for shelf ID: {ShelfId}. It might not exist or new code is a duplicate.", id);
                // Need a way to differentiate: NotFound vs BadRequest (for duplicate code)
                // For now, a general error that prompts checking logs or implies bad data.
                return BadRequest("Shelf update failed. Shelf not found or new code is a duplicate in the same warehouse.");
            }
            _logger.LogInformation("Shelf with ID: {ShelfId} updated successfully.", id);
            return NoContent();
        }

        // DELETE: api/Shelves/5
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)] // For business rule violation (e.g., shelf not empty)
        [ProducesResponseType(404)]
        // [Authorize(Roles = "Manager,SuperAdmin")]
        public async Task<IActionResult> DeleteShelf(int id)
        {
            _logger.LogInformation("Attempting to delete shelf with ID: {ShelfId}", id);
            var success = await _shelfService.DeleteShelfAsync(id);
            if (!success)
            {
                var shelf = await _shelfService.GetShelfByIdAsync(id);
                if (shelf == null)
                {
                    _logger.LogWarning("Delete failed for shelf ID: {ShelfId}. Shelf not found.", id);
                    return NotFound();
                }
                _logger.LogWarning("Delete failed for shelf ID: {ShelfId}. It might contain stock items.", id);
                return BadRequest("Could not delete shelf. Ensure it is empty and try again.");
            }
            _logger.LogInformation("Shelf with ID: {ShelfId} deleted successfully.", id);
            return NoContent();
        }
    }
} 