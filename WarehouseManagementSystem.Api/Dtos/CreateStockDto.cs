using System.ComponentModel.DataAnnotations;

namespace WarehouseManagementSystem.Api.Dtos
{
    public class CreateStockDto
    {
        [Required]
        public int ItemId { get; set; }

        [Required]
        public int ShelfId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
} 