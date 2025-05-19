using System;

namespace WarehouseManagementSystem.Api.Dtos
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public UserDto? User { get; set; } // Optional: return user details along with the token
        public string? Message { get; set; } // For success or error messages
    }
} 