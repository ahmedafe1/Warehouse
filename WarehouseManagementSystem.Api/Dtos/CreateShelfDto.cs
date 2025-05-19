using System.ComponentModel.DataAnnotations;

namespace WarehouseManagementSystem.Api.Dtos
{
    public class CreateShelfDto
    {
        [Required]
        [StringLength(20, MinimumLength = 1)]
        public string Code { get; set; } = string.Empty;

        [Required]
        public int WarehouseId { get; set; }
    }
} 