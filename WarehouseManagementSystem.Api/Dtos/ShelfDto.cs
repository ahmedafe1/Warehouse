using System.Collections.Generic;

namespace WarehouseManagementSystem.Api.Dtos
{
    // Minimal DTO for Warehouse when nested in ShelfDto
    public class WarehouseMinimalDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; }
    }

    // Minimal DTO for Stock when listing shelves (e.g., count or key details)
    public class StockMinimalDto 
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty; // Added for quick reference
        public int Quantity { get; set; }
    }

    public class ShelfDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public int WarehouseId { get; set; }
        public WarehouseMinimalDto? Warehouse { get; set; }
        public ICollection<StockMinimalDto> Stocks { get; set; } = new List<StockMinimalDto>();
    }
} 