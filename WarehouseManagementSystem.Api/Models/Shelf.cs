using System.Collections.Generic;

namespace WarehouseManagementSystem.Api.Models
{
    public class Shelf
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty; // e.g., A1, B2
        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; } = null!;
        public ICollection<Stock> Stocks { get; set; } = new List<Stock>();
    }
} 