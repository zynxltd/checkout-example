using DotnetSignalrPlantAuction.Contracts;
using DotnetSignalrPlantAuction.Hubs;
using DotnetSignalrPlantAuction.Options;
using DotnetSignalrPlantAuction.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AuctionOptions>(builder.Configuration.GetSection(AuctionOptions.SectionName));
builder.Services.AddSignalR();
builder.Services.AddSingleton<IAuctionClock, SystemAuctionClock>();
builder.Services.AddSingleton<IBidPolicy, DefaultBidPolicy>();
builder.Services.AddSingleton<IEnumerable<LotSeed>>(sp =>
{
    var clock = sp.GetRequiredService<IAuctionClock>();
    return AuctionCatalog.DefaultSeeds(clock.UtcNow);
});
builder.Services.AddSingleton<ILotRepository, InMemoryLotRepository>();
builder.Services.AddSingleton<IAuctionService, AuctionService>();
builder.Services.AddHostedService<LotCloserWorker>();

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/lots", (IAuctionService auctions) => Results.Ok(auctions.GetBoard()));
app.MapGet("/api/lots/{id}", (string id, IAuctionService auctions) =>
    auctions.GetLot(id) is { } lot ? Results.Ok(lot) : Results.NotFound(new { error = "Unknown lot" }));

app.MapHub<AuctionHub>("/hubs/auction");
app.Run("http://127.0.0.1:5191");
