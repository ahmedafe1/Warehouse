using System.Collections.Generic;

namespace WarehouseManagementSystem.Api.Models
{
    public class Warehouse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; }
        public ICollection<Shelf> Shelves { get; set; } = new List<Shelf>();
    }
} 