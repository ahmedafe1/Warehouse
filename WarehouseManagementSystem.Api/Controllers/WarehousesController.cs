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
    // [Authorize] // Secure controller actions based on roles
    public class WarehousesController : ControllerBase
    {
        private readonly IWarehouseService _warehouseService;
        private readonly ILogger<WarehousesController> _logger;

        public WarehousesController(IWarehouseService warehouseService, ILogger<WarehousesController> logger)
        {
            _warehouseService = warehouseService;
            _logger = logger;
        }

        // GET: api/Warehouses
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<WarehouseDto>), 200)]
        public async Task<ActionResult<IEnumerable<WarehouseDto>>> GetWarehouses()
        {
            _logger.LogInformation("Attempting to retrieve all warehouses.");
            var warehouses = await _warehouseService.GetAllWarehousesAsync();
            return Ok(warehouses);
        }

        // GET: api/Warehouses/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(WarehouseDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<WarehouseDto>> GetWarehouse(int id)
        {
            _logger.LogInformation("Attempting to retrieve warehouse with ID: {WarehouseId}", id);
            var warehouse = await _warehouseService.GetWarehouseByIdAsync(id);

            if (warehouse == null)
            {
                _logger.LogWarning("Warehouse with ID: {WarehouseId} not found.", id);
                return NotFound();
            }

            return Ok(warehouse);
        }

        // POST: api/Warehouses
        [HttpPost]
        [ProducesResponseType(typeof(WarehouseDto), 201)]
        [ProducesResponseType(400)]
        // [Authorize(Roles = "Manager,SuperAdmin")] // Example: Only Manager or SuperAdmin can create
        public async Task<ActionResult<WarehouseDto>> PostWarehouse([FromBody] CreateWarehouseDto createWarehouseDto)
        {
            _logger.LogInformation("Attempting to create a new warehouse: {WarehouseName}", createWarehouseDto.Name);
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for creating warehouse: {WarehouseName}", createWarehouseDto.Name);
                return BadRequest(ModelState);
            }

            var createdWarehouse = await _warehouseService.CreateWarehouseAsync(createWarehouseDto);
            
            if (createdWarehouse == null)
            {
                _logger.LogError("Failed to create warehouse: {WarehouseName}. Service returned null.", createWarehouseDto.Name);
                return BadRequest("Could not create warehouse. An error occurred or validation failed in service."); 
            }

            _logger.LogInformation("Warehouse created successfully with ID: {WarehouseId}", createdWarehouse.Id);
            return CreatedAtAction(nameof(GetWarehouse), new { id = createdWarehouse.Id }, createdWarehouse);
        }

        // PUT: api/Warehouses/5
        [HttpPut("{id}")]
        [ProducesResponseType(204)] // No Content
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        // [Authorize(Roles = "Manager,SuperAdmin")] // Example: Only Manager or SuperAdmin can update
        public async Task<IActionResult> PutWarehouse(int id, [FromBody] UpdateWarehouseDto updateWarehouseDto)
        {
            _logger.LogInformation("Attempting to update warehouse with ID: {WarehouseId}", id);
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for updating warehouse ID: {WarehouseId}", id);
                return BadRequest(ModelState);
            }

            var success = await _warehouseService.UpdateWarehouseAsync(id, updateWarehouseDto);

            if (!success)
            {
                _logger.LogWarning("Update failed for warehouse ID: {WarehouseId}. It might not exist or another error occurred.", id);
                return NotFound("Warehouse not found or update failed.");
            }
            _logger.LogInformation("Warehouse with ID: {WarehouseId} updated successfully.", id);
            return NoContent();
        }

        // DELETE: api/Warehouses/5
        [HttpDelete("{id}")]
        [ProducesResponseType(204)] // No Content
        [ProducesResponseType(400)] // For business rule violation (e.g., warehouse not empty)
        [ProducesResponseType(404)]
        // [Authorize(Roles = "SuperAdmin")] // Example: Only SuperAdmin can delete
        public async Task<IActionResult> DeleteWarehouse(int id)
        {
            _logger.LogInformation("Attempting to delete warehouse with ID: {WarehouseId}", id);
            var success = await _warehouseService.DeleteWarehouseAsync(id);

            if (!success)
            {
                // Check if it was not found or if it was a business rule violation (e.g. has shelves)
                // For now, assume service returns false for either. Better to have specific error codes/messages from service.
                var warehouse = await _warehouseService.GetWarehouseByIdAsync(id); // Re-check to differentiate
                if (warehouse == null) 
                {
                    _logger.LogWarning("Delete failed for warehouse ID: {WarehouseId}. Warehouse not found.", id);
                    return NotFound();
                }
                _logger.LogWarning("Delete failed for warehouse ID: {WarehouseId}. It might not be empty or another error occurred.", id);
                return BadRequest("Could not delete warehouse. Ensure it is empty and try again, or check logs.");
            }
            _logger.LogInformation("Warehouse with ID: {WarehouseId} deleted successfully.", id);
            return NoContent();
        }
    }
} 