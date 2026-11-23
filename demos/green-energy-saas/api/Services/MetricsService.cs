using GreenEnergy.Api.Data;
using GreenEnergy.Api.Models;

namespace GreenEnergy.Api.Services;

public sealed class MetricsService
{
    private readonly Random _rng = new(42);

    public SiteView EnrichSite(Site site)
    {
        var factor = site.Status switch
        {
            "Online" => 0.55 + _rng.NextDouble() * 0.35,
            "Degraded" => 0.25 + _rng.NextDouble() * 0.2,
            _ => 0.05 + _rng.NextDouble() * 0.1,
        };

        var liveKw = Math.Round(site.CapacityMw * 1000 * factor, 1);
        var todayMwh = Math.Round(site.CapacityMw * factor * 6.5, 2);
        var co2 = Math.Round(todayMwh * 230, 0); // rough kg CO2e avoided / MWh
        var availability = site.Status switch
        {
            "Online" => 98.2 + _rng.NextDouble(),
            "Degraded" => 91 + _rng.NextDouble() * 3,
            _ => 70 + _rng.NextDouble() * 5,
        };

        return new SiteView(
            site.Id,
            site.Name,
            site.Type,
            site.Location,
            site.CapacityMw,
            site.Status,
            site.Commissioned,
            liveKw,
            todayMwh,
            co2,
            Math.Round(availability, 1));
    }

    public DashboardDto BuildDashboard(PlatformStore store)
    {
        var views = store.Sites.Select(EnrichSite).ToList();
        var liveMw = Math.Round(views.Sum(v => v.LiveKw) / 1000.0, 2);
        var today = Math.Round(views.Sum(v => v.TodayMwh), 2);
        var month = Math.Round(today * 22.4, 1);
        var co2t = Math.Round(views.Sum(v => v.Co2AvoidedKg) / 1000.0, 2);
        var top = views.OrderByDescending(v => v.LiveKw).Take(3).ToList();

        return new DashboardDto(
            store.Tenant.Name,
            store.Tenant.Plan,
            liveMw,
            today,
            month,
            co2t,
            views.Count(v => v.Status is "Online" or "Degraded"),
            store.Alerts.Count,
            top);
    }

    public IReadOnlyList<GenerationPoint> GenerationSeries(PlatformStore store, int hours)
    {
        var capacity = store.Sites.Where(s => s.Status != "Maintenance").Sum(s => s.CapacityMw);
        var points = new List<GenerationPoint>(hours);
        var now = DateTimeOffset.UtcNow;

        for (var i = hours - 1; i >= 0; i--)
        {
            var at = now.AddHours(-i);
            var hour = at.Hour;
            // Daytime solar-ish curve + wind noise
            var solarShape = Math.Max(0, Math.Sin((hour - 6) / 12.0 * Math.PI));
            var wind = 0.35 + 0.25 * Math.Sin(i / 3.0) + (_rng.NextDouble() - 0.5) * 0.08;
            var mw = Math.Round(capacity * (0.45 * solarShape + 0.4 * Math.Clamp(wind, 0.1, 0.9)), 2);
            points.Add(new GenerationPoint(at, mw));
        }

        return points;
    }
}
