using System.ComponentModel.DataAnnotations;

namespace WarehouseManagementSystem.Api.Dtos
{
    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty; // Or Email, depending on login preference

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }
} 