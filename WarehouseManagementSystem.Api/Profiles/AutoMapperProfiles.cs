using AutoMapper;
using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Models;

namespace WarehouseManagementSystem.Api.Profiles
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // Warehouse mappings
            CreateMap<Warehouse, WarehouseDto>().ReverseMap();
            CreateMap<Warehouse, CreateWarehouseDto>().ReverseMap();
            CreateMap<Warehouse, WarehouseMinimalDto>().ReverseMap();

            // Shelf mappings
            CreateMap<Shelf, ShelfDto>().ReverseMap();
            CreateMap<Shelf, CreateShelfDto>().ReverseMap();
            CreateMap<Shelf, ShelfMinimalDto>().ReverseMap();

            // Item mappings
            CreateMap<Item, ItemDto>().ReverseMap();
            CreateMap<Item, CreateItemDto>().ReverseMap();
            CreateMap<Item, ItemMinimalDto>().ReverseMap();

            // Supplier mappings
            CreateMap<Supplier, SupplierDto>().ReverseMap();
            CreateMap<Supplier, CreateSupplierDto>().ReverseMap();
            CreateMap<Supplier, SupplierMinimalDto>().ReverseMap();

            // Stock mappings
            CreateMap<Stock, StockDto>().ReverseMap();
            CreateMap<Stock, CreateStockDto>().ReverseMap();
        }
    }
} 