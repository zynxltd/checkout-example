using GardenClub.Web.Models;
using Microsoft.EntityFrameworkCore;

namespace GardenClub.Web.Data;

public sealed class GardenClubDbContext(DbContextOptions<GardenClubDbContext> options) : DbContext(options)
{
    public DbSet<Plant> Plants => Set<Plant>();
    public DbSet<InterestRequest> InterestRequests => Set<InterestRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Plant>(e =>
        {
            e.HasIndex(p => p.Sku).IsUnique();
            e.Property(p => p.RetailPrice).HasPrecision(10, 2);
            e.Property(p => p.ClubPrice).HasPrecision(10, 2);
        });

        modelBuilder.Entity<InterestRequest>(e =>
        {
            e.HasIndex(r => r.CreatedAt);
        });
    }
}

public static class GardenClubSeeder
{
    public static async Task EnsureSeededAsync(GardenClubDbContext db, CancellationToken ct = default)
    {
        await db.Database.EnsureCreatedAsync(ct);

        if (await db.Plants.AnyAsync(ct))
        {
            return;
        }

        Plant[] catalogue =
        [
            new()
            {
                Sku = "401842",
                Name = "Upright Zonal Geranium 'Parade' Mix",
                Category = "Bedding",
                Blurb = "Twelve plug plants for summer colour in pots and borders.",
                RetailPrice = 9.99m,
                ClubPrice = 8.49m,
            },
            new()
            {
                Sku = "510317",
                Name = "Sicilian Lemon Tree",
                Category = "Trees",
                Blurb = "Fragrant evergreen citrus for a sunny patio.",
                RetailPrice = 24.99m,
                ClubPrice = 21.24m,
            },
            new()
            {
                Sku = "402156",
                Name = "Eryngium 'Blue Hobbit'",
                Category = "Perennials",
                Blurb = "Compact sea holly with steel-blue cones.",
                RetailPrice = 14.97m,
                ClubPrice = 9.72m,
            },
            new()
            {
                Sku = "404220",
                Name = "Pre-Planted Summer Sensation Basket",
                Category = "Bedding",
                Blurb = "35cm hanging basket, ready to hang.",
                RetailPrice = 24.98m,
                ClubPrice = 21.23m,
            },
            new()
            {
                Sku = "PLP002",
                Name = "Summer Flowering Fuchsia Collection",
                Category = "Collections",
                Blurb = "A garden-ready fuchsia mix for shade and sun.",
                RetailPrice = 14.99m,
                ClubPrice = 12.74m,
            },
            new()
            {
                Sku = "403891",
                Name = "Imperata 'Red Baron' Blood Grass",
                Category = "Grasses",
                Blurb = "Fiery red tips that intensify through autumn.",
                RetailPrice = 14.97m,
                ClubPrice = 12.72m,
            },
        ];

        db.Plants.AddRange(catalogue);
        await db.SaveChangesAsync(ct);
    }
}
