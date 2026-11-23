using TravelBucketListApi.Features.Destinations;
using TravelBucketListApi.Models;
using TravelBucketListApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<DestinationService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var destinations = new List<Destination>
{
    new Destination
    {
        Id = 1,
        Name = "Taj Mahal",
        Country = "India",
        Region = "Asia",
        Description = "Magnificent marble mausoleum",
        Priority = 5,
        IsVisited = false
    },
    new Destination
    {
        Id = 2,
        Name = "Grand Canyon",
        Country = "USA",
        Region = "North America",
        Description = "Massive canyon in Arizona",
        Priority = 4,
        IsVisited = true
    },
    new Destination
    {
        Id = 3,
        Name = "Tokyo",
        Country = "Japan",
        Region = "Asia",
        Description = "Japan's bustling capital",
        Priority = 5,
        IsVisited = false
    },
    new Destination
    {
        Id = 4,
        Name = "Machu Picchu",
        Country = "Peru",
        Region = "South America",
        Description = "Ancient Incan citadel",
        Priority = 3,
        IsVisited = false
    }
};

app.MapDestinationEndpoints(destinations);

app.Run();
