using System.ComponentModel.DataAnnotations;

namespace WarehouseManagementSystem.Api.Dtos
{
    public class CreateWarehouseDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Location { get; set; }
    }
} 