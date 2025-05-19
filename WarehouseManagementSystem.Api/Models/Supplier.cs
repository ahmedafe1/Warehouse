using System.Collections.Generic;

namespace WarehouseManagementSystem.Api.Models
{
    public class Supplier
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ContactName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public ICollection<Item> Items { get; set; } = new List<Item>();
    }
} 