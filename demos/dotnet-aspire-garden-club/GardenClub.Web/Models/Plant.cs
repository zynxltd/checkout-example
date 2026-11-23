namespace GardenClub.Web.Models;

public sealed class Plant
{
    public int Id { get; set; }
    public required string Sku { get; set; }
    public required string Name { get; set; }
    public required string Category { get; set; }
    public string Blurb { get; set; } = "";
    public decimal RetailPrice { get; set; }
    public decimal ClubPrice { get; set; }
    public bool InStock { get; set; } = true;

    public decimal ClubSaving => Math.Round(RetailPrice - ClubPrice, 2);
}

public sealed class InterestRequest
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string PlantSku { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public bool ClubMember { get; set; }
}
