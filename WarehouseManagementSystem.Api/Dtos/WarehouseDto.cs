using System.Collections.Generic;

namespace WarehouseManagementSystem.Api.Dtos
{
    public class ShelfMinimalDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
    }

    public class WarehouseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Location { get; set; }
        public ICollection<ShelfMinimalDto> Shelves { get; set; } = new List<ShelfMinimalDto>();
    }
} 