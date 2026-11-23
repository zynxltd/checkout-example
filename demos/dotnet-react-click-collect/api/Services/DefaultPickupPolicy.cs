using System.Text.RegularExpressions;
using DotnetReactClickCollect.Api.Contracts;
using DotnetReactClickCollect.Api.Models;
using DotnetReactClickCollect.Api.Options;
using Microsoft.Extensions.Options;

namespace DotnetReactClickCollect.Api.Services;

public sealed class DefaultPickupPolicy(
    IOptions<PickupOptions> options,
    ICollectableCatalog catalog) : IPickupPolicy
{
    private readonly PickupOptions _options = options.Value;
    private static readonly Regex EmailRx = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);

    public string? ValidateCreate(string memberName, string memberEmail, IReadOnlyList<ReservationLineRequest> lines)
    {
        if (string.IsNullOrWhiteSpace(memberName))
            return "Member name is required";

        if (string.IsNullOrWhiteSpace(memberEmail) || !EmailRx.IsMatch(memberEmail.Trim()))
            return "Valid member email is required";

        if (lines.Count == 0)
            return "Add at least one plant or product";

        if (lines.Count > _options.MaxLinesPerReservation)
            return $"Max {_options.MaxLinesPerReservation} lines per pickup";

        decimal total = 0;
        foreach (var line in lines)
        {
            if (line.Qty <= 0)
                return $"Qty must be positive for {line.Sku}";

            var item = catalog.Find(line.Sku);
            if (item is null)
                return $"Unknown SKU {line.Sku}";

            total += item.UnitPrice * line.Qty;
        }

        if (total > _options.MaxReservationTotal)
            return $"Pickup total exceeds £{_options.MaxReservationTotal:0.00}";

        return null;
    }

    public string? CanCancel(Reservation reservation, DateTimeOffset now)
    {
        if (reservation.Status is not (ReservationStatus.Booked or ReservationStatus.Ready))
            return "Only booked or ready pickups can be cancelled";

        var window = TimeSpan.FromHours(Math.Max(1, _options.CancelWindowHours));
        if (now - reservation.CreatedAt > window)
            return $"Cancel window ({_options.CancelWindowHours}h) has passed";

        return null;
    }

    public string? CanMarkReady(Reservation reservation) =>
        reservation.Status == ReservationStatus.Booked
            ? null
            : "Only booked pickups can be marked ready";

    public string? CanCollect(Reservation reservation) =>
        reservation.Status == ReservationStatus.Ready
            ? null
            : "Only ready pickups can be collected";
}
