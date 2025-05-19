namespace WarehouseManagementSystem.Api.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = null!;
    }
} 