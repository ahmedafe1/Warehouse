using WarehouseManagementSystem.Api.Data;
using WarehouseManagementSystem.Api.Dtos;
using WarehouseManagementSystem.Api.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore; // Added for DbUpdateException

namespace WarehouseManagementSystem.Api.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly ILogger<SupplierService> _logger;
        private readonly ApplicationDbContext _context; // For SaveChangesAsync

        public SupplierService(ISupplierRepository supplierRepository, ILogger<SupplierService> logger, ApplicationDbContext context)
        {
            _supplierRepository = supplierRepository;
            _logger = logger;
            _context = context;
        }

        public async Task<IEnumerable<SupplierDto>> GetAllSuppliersAsync()
        {
            _logger.LogInformation("Fetching all suppliers");
            var suppliers = await _supplierRepository.GetAllAsync();
            return suppliers.Select(s => MapToSupplierDto(s));
        }

        public async Task<SupplierDto?> GetSupplierByIdAsync(int id)
        {
            _logger.LogInformation("Fetching supplier with ID: {SupplierId}", id);
            var supplier = await _supplierRepository.GetByIdAsync(id);
            return supplier == null ? null : MapToSupplierDto(supplier);
        }

        public async Task<SupplierDto?> CreateSupplierAsync(CreateSupplierDto createSupplierDto)
        {
            _logger.LogInformation("Creating new supplier: {SupplierName}", createSupplierDto.Name);
            var supplier = new Supplier
            {
                Name = createSupplierDto.Name,
                ContactName = createSupplierDto.ContactName,
                Email = createSupplierDto.Email,
                PhoneNumber = createSupplierDto.PhoneNumber
                // Items will be empty by default
            };

            await _supplierRepository.AddAsync(supplier);
            try
            {
                await _context.SaveChangesAsync();
                return MapToSupplierDto(supplier); 
            }
            catch (DbUpdateException ex) // Or more specific exceptions
            {
                _logger.LogError(ex, "Error creating supplier {SupplierName}", createSupplierDto.Name);
                return null; // Or throw custom exception
            }
        }

        public async Task<bool> UpdateSupplierAsync(int id, UpdateSupplierDto updateSupplierDto)
        {
            _logger.LogInformation("Updating supplier with ID: {SupplierId}", id);
            var existingSupplier = await _supplierRepository.GetByIdAsync(id);
            if (existingSupplier == null)
            {
                _logger.LogWarning("Supplier with ID {SupplierId} not found for update.", id);
                return false;
            }

            existingSupplier.Name = updateSupplierDto.Name;
            existingSupplier.ContactName = updateSupplierDto.ContactName;
            existingSupplier.Email = updateSupplierDto.Email;
            existingSupplier.PhoneNumber = updateSupplierDto.PhoneNumber;

            _supplierRepository.Update(existingSupplier);
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error updating supplier {SupplierId}", id);
                return false; // Or throw
            }
        }

        public async Task<bool> DeleteSupplierAsync(int id)
        {
            _logger.LogInformation("Deleting supplier with ID: {SupplierId}", id);
            var supplierToDelete = await _supplierRepository.GetByIdAsync(id);
            if (supplierToDelete == null)
            {
                _logger.LogWarning("Supplier with ID {SupplierId} not found for deletion.", id);
                return false;
            }

            // Consider business logic: what happens to items if a supplier is deleted?
            // For now, we'll just remove the supplier. EF Core might handle related items based on FK constraints and cascade rules.
            _supplierRepository.Remove(supplierToDelete);
             try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error deleting supplier {SupplierId}", id);
                return false; // Or throw
            }
        }

        // Manual DTO Mapping Helper
        private SupplierDto MapToSupplierDto(Supplier supplier)
        {
            return new SupplierDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactName = supplier.ContactName,
                Email = supplier.Email,
                PhoneNumber = supplier.PhoneNumber,
                Items = supplier.Items?.Select(i => new ItemMinimalDto { Id = i.Id, Name = i.Name, Price = i.Price }).ToList() ?? new List<ItemMinimalDto>()
            };
        }
    }
} 