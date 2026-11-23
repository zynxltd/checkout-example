using System.Text.Json.Serialization;
using DotnetReactClickCollect.Api.Contracts;
using DotnetReactClickCollect.Api.Endpoints;
using DotnetReactClickCollect.Api.Options;
using DotnetReactClickCollect.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<PickupOptions>(builder.Configuration.GetSection(PickupOptions.SectionName));
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

var corsOrigins = builder.Configuration
    .GetSection($"{PickupOptions.SectionName}:CorsOrigins")
    .Get<string[]>()
    ?? ["http://127.0.0.1:5194", "http://localhost:5194"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddSingleton<IPickupClock, SystemPickupClock>();
builder.Services.AddSingleton<ICollectableCatalog, InMemoryCollectableCatalog>();
builder.Services.AddSingleton<ISlotBoard, InMemorySlotBoard>();
builder.Services.AddSingleton<IPickupPolicy, DefaultPickupPolicy>();
builder.Services.AddSingleton<IReservationStore, InMemoryReservationStore>();
builder.Services.AddSingleton<IPickupService, PickupService>();

var app = builder.Build();
app.UseCors();
app.MapPickupApi();
app.Run();
