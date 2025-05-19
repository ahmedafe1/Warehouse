using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WarehouseManagementSystem.Api.Models;

namespace WarehouseManagementSystem.Api.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Item> Items { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Shelf> Shelves { get; set; }
        public DbSet<Stock> Stocks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure relationships
            builder.Entity<Item>()
                .HasOne(i => i.Supplier)
                .WithMany(s => s.Items)
                .HasForeignKey(i => i.SupplierId);

            builder.Entity<Shelf>()
                .HasOne(s => s.Warehouse)
                .WithMany(w => w.Shelves)
                .HasForeignKey(s => s.WarehouseId);

            builder.Entity<Stock>()
                .HasOne(s => s.Item)
                .WithMany()
                .HasForeignKey(s => s.ItemId);

            builder.Entity<Stock>()
                .HasOne(s => s.Shelf)
                .WithMany(sh => sh.Stocks)
                .HasForeignKey(s => s.ShelfId);
        }
    }
} 