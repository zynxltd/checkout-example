namespace GreenEnergy.Api.Models;

public record Tenant(
    string Id,
    string Name,
    string Plan,
    int Seats,
    DateOnly RenewsOn,
    string Region);

public record Site(
    string Id,
    string Name,
    string Type,
    string Location,
    double CapacityMw,
    string Status,
    DateOnly Commissioned);

public record SiteView(
    string Id,
    string Name,
    string Type,
    string Location,
    double CapacityMw,
    string Status,
    DateOnly Commissioned,
    double LiveKw,
    double TodayMwh,
    double Co2AvoidedKg,
    double AvailabilityPct);

public record DashboardDto(
    string TenantName,
    string Plan,
    double FleetLiveMw,
    double TodayMwh,
    double MonthMwh,
    double Co2AvoidedTonnes,
    int ActiveSites,
    int AlertsOpen,
    IReadOnlyList<SiteView> TopSites);

public record GenerationPoint(DateTimeOffset At, double Mw);

public record Alert(
    string Id,
    string SiteId,
    string SiteName,
    string Severity,
    string Message,
    DateTimeOffset RaisedAt);
