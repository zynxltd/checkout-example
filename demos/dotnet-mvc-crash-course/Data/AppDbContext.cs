using DotnetMvcCrashCourse.Models;
using Microsoft.EntityFrameworkCore;

namespace DotnetMvcCrashCourse.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Sku).HasMaxLength(32).IsRequired();
            entity.Property(p => p.Name).HasMaxLength(120).IsRequired();
            entity.Property(p => p.Category).HasMaxLength(40).IsRequired();
            entity.HasIndex(p => p.Sku).IsUnique();
        });
    }
}

public static class ProductSeed
{
    public static void EnsureSeeded(AppDbContext db)
    {
        db.Database.EnsureCreated();
        if (db.Products.Any()) return;

        db.Products.AddRange(
            new Product { Sku = "ROSE01", Name = "Climbing Rose", Category = "plants", Price = 24.99m, Stock = 40 },
            new Product { Sku = "FEED01", Name = "Bird Feeder Kit", Category = "wildlife", Price = 9.99m, Stock = 120 },
            new Product { Sku = "MOWER1", Name = "Compact Lawn Mower", Category = "machinery", Price = 199.00m, Stock = 8 },
            new Product { Sku = "HERB12", Name = "Herb Starter Pack", Category = "plants", Price = 14.50m, Stock = 75 });
        db.SaveChanges();
    }
}
