using GreenEnergy.Api.Models;

namespace GreenEnergy.Api.Data;

public sealed class PlatformStore
{
    public Tenant Tenant { get; } = new(
        Id: "ten_verdant",
        Name: "Verdant Grid",
        Plan: "Growth",
        Seats: 25,
        RenewsOn: new DateOnly(2026, 11, 1),
        Region: "UK & EU");

    public IReadOnlyList<Site> Sites { get; } =
    [
        new("site_solent", "Solent Rooftop Array", "Solar", "Southampton, UK", 1.8, "Online", new DateOnly(2023, 4, 12)),
        new("site_cairn", "Cairn Wind Ridge", "Wind", "Aberdeenshire, UK", 4.2, "Online", new DateOnly(2022, 9, 3)),
        new("site_avon", "Avon Community Solar", "Solar", "Bristol, UK", 0.9, "Degraded", new DateOnly(2024, 1, 20)),
        new("site_humber", "Humber Storage Hub", "Battery", "Hull, UK", 2.5, "Online", new DateOnly(2025, 6, 8)),
        new("site_kerry", "Kerry Coastal Wind", "Wind", "County Kerry, IE", 3.1, "Maintenance", new DateOnly(2021, 11, 15)),
    ];

    public IReadOnlyList<Alert> Alerts { get; } =
    [
        new("al_1", "site_avon", "Avon Community Solar", "warning", "Inverter 3 derating — output −18% vs forecast.", DateTimeOffset.UtcNow.AddHours(-2)),
        new("al_2", "site_kerry", "Kerry Coastal Wind", "info", "Scheduled maintenance window opens tomorrow 06:00 local.", DateTimeOffset.UtcNow.AddHours(-5)),
        new("al_3", "site_cairn", "Cairn Wind Ridge", "critical", "Met mast link intermittent — fallback to SCADA wind model.", DateTimeOffset.UtcNow.AddMinutes(-40)),
    ];
}
