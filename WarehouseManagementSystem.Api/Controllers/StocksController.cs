using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization; // Placeholder for authorization

namespace WarehouseManagementSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StocksController : ControllerBase
    {
        private readonly IStockService _stockService;
        private readonly ILogger<StocksController> _logger;

        public StocksController(IStockService stockService, ILogger<StocksController> logger)
        {
            _stockService = stockService;
            _logger = logger;
        }

        // GET: api/stocks
        [HttpGet]
        // [Authorize(Roles = "Manager,Logistic,SuperAdmin")] // Example Authorization
        public async Task<ActionResult<IEnumerable<StockDto>>> GetStocks([FromQuery] int? shelfId, [FromQuery] int? itemId)
        {
            _logger.LogInformation("Attempting to retrieve stocks.");
            if (shelfId.HasValue && itemId.HasValue)
            {
                _logger.LogInformation("Retrieving stock for Item ID: {ItemId} on Shelf ID: {ShelfId}", itemId.Value, shelfId.Value);
                var stockDto = await _stockService.GetStockByItemIdAndShelfIdAsync(itemId.Value, shelfId.Value);

                if (stockDto == null)
                {
                    _logger.LogWarning("Stock not found for Item ID: {ItemId} on Shelf ID: {ShelfId}", itemId.Value, shelfId.Value);
                    return NotFound($"Stock not found for Item ID: {itemId.Value} on Shelf ID: {shelfId.Value}");
                }
                return Ok(stockDto); // Return single DTO
            }
            if (shelfId.HasValue)
            {
                _logger.LogInformation("Retrieving stocks for Shelf ID: {ShelfId}", shelfId.Value);
                var stocksByShelf = await _stockService.GetStocksByShelfIdAsync(shelfId.Value);
                return Ok(stocksByShelf);
            }
            if (itemId.HasValue)
            {
                _logger.LogInformation("Retrieving stocks for Item ID: {ItemId}", itemId.Value);
                var stocksByItem = await _stockService.GetStocksByItemIdAsync(itemId.Value);
                return Ok(stocksByItem);
            }

            _logger.LogInformation("Retrieving all stocks.");
            var stocks = await _stockService.GetAllStocksAsync();
            return Ok(stocks);
        }

        // GET: api/stocks/{id}
        [HttpGet("{id}")]
        // [Authorize(Roles = "Manager,Logistic,SuperAdmin")] // Example Authorization
        public async Task<ActionResult<StockDto>> GetStock(int id)
        {
            _logger.LogInformation("Attempting to retrieve stock with ID: {Id}", id);
            var stockDto = await _stockService.GetStockByIdAsync(id);
            if (stockDto == null)
            {
                _logger.LogWarning("Stock with ID: {Id} not found.", id);
                return NotFound();
            }
            _logger.LogInformation("Successfully retrieved stock with ID: {Id}", id);
            return Ok(stockDto);
        }

        // POST: api/stocks
        [HttpPost]
        // [Authorize(Roles = "Manager,Logistic,SuperAdmin")] // Example Authorization
        public async Task<ActionResult<StockDto>> PostStock(CreateStockDto createStockDto)
        {
            _logger.LogInformation("Attempting to create a new stock entry.");
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for CreateStockDto.");
                return BadRequest(ModelState);
            }

            var (stockDto, error) = await _stockService.CreateStockAsync(createStockDto);

            if (error != null)
            {
                _logger.LogWarning("Error creating stock: {Error}", error);
                // Check for specific errors to return appropriate status codes
                if (error.Contains("not found")) return NotFound(error);
                if (error.Contains("already exists")) return Conflict(error); // Should be handled by update logic in service
                return BadRequest(error);
            }
            
            if (stockDto == null)
            {
                // Should not happen if error is null, but as a safeguard
                _logger.LogError("StockDto is null after creation without error.");
                return BadRequest("An unexpected error occurred while creating the stock.");
            }

            _logger.LogInformation("Successfully created stock with ID: {Id}", stockDto.Id);
            return CreatedAtAction(nameof(GetStock), new { id = stockDto.Id }, stockDto);
        }

        // PUT: api/stocks/{id}/quantity
        [HttpPut("{id}/quantity")]
        // [Authorize(Roles = "Manager,Logistic,SuperAdmin")] // Example Authorization
        public async Task<IActionResult> UpdateStockQuantity(int id, UpdateStockQuantityDto updateStockQuantityDto)
        {
            _logger.LogInformation("Attempting to update quantity for stock with ID: {Id}", id);
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for UpdateStockQuantityDto.");
                return BadRequest(ModelState);
            }

            var (stockDto, error) = await _stockService.UpdateStockQuantityAsync(id, updateStockQuantityDto);

            if (error != null)
            {
                _logger.LogWarning("Error updating stock quantity: {Error}", error);
                if (error.Contains("not found")) return NotFound(error);
                return BadRequest(error); 
            }

            _logger.LogInformation("Successfully updated stock quantity for ID: {Id}", id);
            return NoContent(); // Or return Ok(stockDto) if client needs the updated object
        }

        // DELETE: api/stocks/{id}
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Manager,SuperAdmin")] // Example: Only managers or superadmins can delete
        public async Task<IActionResult> DeleteStock(int id)
        {
            _logger.LogInformation("Attempting to delete stock with ID: {Id}", id);
            var (success, error) = await _stockService.DeleteStockAsync(id);

            if (!success)
            {
                _logger.LogWarning("Error deleting stock: {Error}", error);
                if (error != null && error.Contains("not found")) return NotFound(error);
                return BadRequest(error); 
            }

            _logger.LogInformation("Successfully deleted stock with ID: {Id}", id);
            return NoContent();
        }
    }
} 