namespace WarehouseManagementSystem.Api.Dtos
{
    public class SupplierMinimalDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class ItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int SupplierId { get; set; } // Keep SupplierId for direct reference
        public SupplierMinimalDto? Supplier { get; set; } // Include supplier details
    }
} 