using System.ComponentModel.DataAnnotations;
using WarehouseManagementSystem.Api.Models;

namespace WarehouseManagementSystem.Api.Dtos
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class CreateUserDto
    {
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(Logistic|Manager|SuperAdmin)$", 
            ErrorMessage = "Role must be one of: Logistic, Manager, SuperAdmin")]
        public string Role { get; set; } = string.Empty;
    }

    public class UpdateUserDto
    {
        [StringLength(50)]
        public string? Username { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [StringLength(100, MinimumLength = 6)]
        public string? Password { get; set; }

        [RegularExpression("^(Logistic|Manager|SuperAdmin)$", 
            ErrorMessage = "Role must be one of: Logistic, Manager, SuperAdmin")]
        public string? Role { get; set; }
    }
} 