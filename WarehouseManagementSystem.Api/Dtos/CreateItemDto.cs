using System.ComponentModel.DataAnnotations;

namespace WarehouseManagementSystem.Api.Dtos
{
    public class CreateItemDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        // [Required]
        // [Range(0.01, 1000000)] // Assuming price must be positive
        public decimal Price { get; set; }

        [Required]
        public int SupplierId { get; set; }
    }
} 