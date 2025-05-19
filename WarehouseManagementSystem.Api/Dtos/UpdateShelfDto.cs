using System.ComponentModel.DataAnnotations;

namespace WarehouseManagementSystem.Api.Dtos
{
    public class UpdateShelfDto
    {
        [Required]
        [StringLength(20, MinimumLength = 1)]
        public string Code { get; set; } = string.Empty;

        // WarehouseId is typically not updated directly for a shelf;
        // if a shelf moves warehouse, it's often a delete and re-create or a more complex operation.
        // For simplicity, we'll assume WarehouseId is fixed after creation or handled differently.
    }
} 