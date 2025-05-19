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
    public class SuppliersController : ControllerBase
    {
        private readonly ISupplierService _supplierService;
        private readonly ILogger<SuppliersController> _logger;

        public SuppliersController(ISupplierService supplierService, ILogger<SuppliersController> logger)
        {
            _supplierService = supplierService;
            _logger = logger;
        }

        // GET: api/Suppliers
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<SupplierDto>), 200)]
        public async Task<ActionResult<IEnumerable<SupplierDto>>> GetSuppliers()
        {
            _logger.LogInformation("Attempting to retrieve all suppliers.");
            var suppliers = await _supplierService.GetAllSuppliersAsync();
            return Ok(suppliers);
        }

        // GET: api/Suppliers/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(SupplierDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<SupplierDto>> GetSupplier(int id)
        {
            _logger.LogInformation("Attempting to retrieve supplier with ID: {SupplierId}", id);
            var supplier = await _supplierService.GetSupplierByIdAsync(id);

            if (supplier == null)
            {
                _logger.LogWarning("Supplier with ID: {SupplierId} not found.", id);
                return NotFound();
            }

            return Ok(supplier);
        }

        // POST: api/Suppliers
        [HttpPost]
        [ProducesResponseType(typeof(SupplierDto), 201)]
        [ProducesResponseType(400)]
        // [Authorize(Roles = "Manager,SuperAdmin")] // Example: Only Manager or SuperAdmin can create
        public async Task<ActionResult<SupplierDto>> PostSupplier([FromBody] CreateSupplierDto createSupplierDto)
        {
            _logger.LogInformation("Attempting to create a new supplier: {SupplierName}", createSupplierDto.Name);
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for creating supplier: {SupplierName}", createSupplierDto.Name);
                return BadRequest(ModelState);
            }

            var createdSupplier = await _supplierService.CreateSupplierAsync(createSupplierDto);
            
            if (createdSupplier == null)
            {
                _logger.LogError("Failed to create supplier: {SupplierName}. Service returned null.", createSupplierDto.Name);
                // This could be a 500 error if the service logs an internal issue
                return BadRequest("Could not create supplier. An error occurred."); 
            }

            _logger.LogInformation("Supplier created successfully with ID: {SupplierId}", createdSupplier.Id);
            return CreatedAtAction(nameof(GetSupplier), new { id = createdSupplier.Id }, createdSupplier);
        }

        // PUT: api/Suppliers/5
        [HttpPut("{id}")]
        [ProducesResponseType(204)] // No Content
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        // [Authorize(Roles = "Manager,SuperAdmin")] // Example: Only Manager or SuperAdmin can update
        public async Task<IActionResult> PutSupplier(int id, [FromBody] UpdateSupplierDto updateSupplierDto)
        {
            _logger.LogInformation("Attempting to update supplier with ID: {SupplierId}", id);
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for updating supplier ID: {SupplierId}", id);
                return BadRequest(ModelState);
            }

            var success = await _supplierService.UpdateSupplierAsync(id, updateSupplierDto);

            if (!success)
            {
                // The service should log whether it was a NotFound or another issue.
                // If GetByIdAsync was called in service and returned null, it's a NotFound. 
                // Otherwise, it might be a concurrency issue or other update failure.
                // For simplicity here, we assume if it's not success, it might be not found or failed update.
                // A more specific error from service would be better.
                _logger.LogWarning("Update failed for supplier ID: {SupplierId}. It might not exist or another error occurred.", id);
                return NotFound("Supplier not found or update failed."); 
            }
            _logger.LogInformation("Supplier with ID: {SupplierId} updated successfully.", id);
            return NoContent();
        }

        // DELETE: api/Suppliers/5
        [HttpDelete("{id}")]
        [ProducesResponseType(204)] // No Content
        [ProducesResponseType(404)]
        // [Authorize(Roles = "SuperAdmin")] // Example: Only SuperAdmin can delete
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            _logger.LogInformation("Attempting to delete supplier with ID: {SupplierId}", id);
            var success = await _supplierService.DeleteSupplierAsync(id);

            if (!success)
            {
                _logger.LogWarning("Delete failed for supplier ID: {SupplierId}. Supplier not found.", id);
                return NotFound();
            }
            _logger.LogInformation("Supplier with ID: {SupplierId} deleted successfully.", id);
            return NoContent();
        }
    }
} 