using System;

namespace WarehouseManagementSystem.Api.Dtos
{
    // Assumes ItemMinimalDto is available from ItemDto.cs or similar
    // Assumes ShelfMinimalDto is available from WarehouseDto.cs or ShelfDto.cs

    public class StockDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public ItemMinimalDto? Item { get; set; }
        public int ShelfId { get; set; }
        public ShelfMinimalDto? Shelf { get; set; }
        public int Quantity { get; set; }
        public DateTime LastUpdated { get; set; }
    }
} 