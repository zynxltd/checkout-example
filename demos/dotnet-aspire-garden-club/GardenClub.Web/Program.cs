using GardenClub.Web.Data;
using GardenClub.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddRazorPages();
builder.Services.AddDbContext<GardenClubDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("gardenclub")
        ?? "Data Source=gardenclub.db"));

var app = builder.Build();

app.MapDefaultEndpoints();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.MapRazorPages();

app.MapGet("/api/plants", async (GardenClubDbContext db, string? category, CancellationToken ct) =>
{
    var query = db.Plants.AsNoTracking().Where(p => p.InStock);
    if (!string.IsNullOrWhiteSpace(category) && category is not "all")
    {
        query = query.Where(p => p.Category == category);
    }

    var plants = await query.OrderBy(p => p.Name).ToListAsync(ct);
    return Results.Ok(plants);
});

app.MapPost("/api/interest", async (
    [FromBody] InterestDto dto,
    GardenClubDbContext db,
    CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Sku))
    {
        return Results.BadRequest(new { error = "Email and plant SKU are required." });
    }

    var plant = await db.Plants.AsNoTracking()
        .FirstOrDefaultAsync(p => p.Sku == dto.Sku, ct);

    if (plant is null)
    {
        return Results.NotFound(new { error = "Plant not found." });
    }

    db.InterestRequests.Add(new InterestRequest
    {
        Email = dto.Email.Trim().ToLowerInvariant(),
        PlantSku = plant.Sku,
        ClubMember = dto.ClubMember,
    });
    await db.SaveChangesAsync(ct);

    var price = dto.ClubMember ? plant.ClubPrice : plant.RetailPrice;
    return Results.Ok(new
    {
        message = $"We'll hold {plant.Name} for you at £{price:0.00}.",
        plant.Sku,
        price,
        clubSaving = dto.ClubMember ? plant.ClubSaving : 0m,
    });
});

app.MapGet("/api/stats", async (GardenClubDbContext db, CancellationToken ct) =>
{
    var plantCount = await db.Plants.CountAsync(ct);
    var interestCount = await db.InterestRequests.CountAsync(ct);
    var avgSaving = await db.Plants.AverageAsync(p => p.RetailPrice - p.ClubPrice, ct);

    return Results.Ok(new
    {
        plants = plantCount,
        interestRequests = interestCount,
        averageClubSaving = Math.Round(avgSaving, 2),
        stack = new[]
        {
            ".NET 10",
            "ASP.NET Core",
            "C# 14",
            ".NET Aspire",
            "EF Core 10",
            "SQLite",
            "Azure DevOps CI/CD",
        },
    });
});

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<GardenClubDbContext>();
    await GardenClubSeeder.EnsureSeededAsync(db);
}

app.Run();

public sealed record InterestDto(string Email, string Sku, bool ClubMember);
