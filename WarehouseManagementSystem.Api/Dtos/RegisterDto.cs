using System.ComponentModel.DataAnnotations;

namespace WarehouseManagementSystem.Api.Dtos
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        // Optional: Add properties for FirstName, LastName, etc.
        // public string? FirstName { get; set; }
        // public string? LastName { get; set; }
        
        // Optional: For role assignment during registration
        // public string? Role { get; set; }
    }
} 