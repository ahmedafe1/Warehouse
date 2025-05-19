using System.Collections.Generic;

namespace WarehouseManagementSystem.Api.Dtos
{
    // DTO for representing an Item when nested (e.g., in SupplierDto)
    public class ItemMinimalDto 
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }

    public class SupplierDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ContactName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public ICollection<ItemMinimalDto> Items { get; set; } = new List<ItemMinimalDto>();
    }
} 