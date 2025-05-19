using System;
using System.Collections.Generic;

namespace WarehouseManagementSystem.Api.Models
{
    public class Stock
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public Item Item { get; set; } = null!;
        public int ShelfId { get; set; }
        public Shelf Shelf { get; set; } = null!;
        public int Quantity { get; set; }
        public DateTime LastUpdated { get; set; }
    }
} 