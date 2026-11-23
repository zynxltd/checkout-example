namespace DotnetReactClickCollect.Api.Options;

public sealed class PickupOptions
{
    public const string SectionName = "Pickup";

    public int MaxLinesPerReservation { get; set; } = 6;
    public int CancelWindowHours { get; set; } = 24;
    public decimal MaxReservationTotal { get; set; } = 400m;
    public string[] CorsOrigins { get; set; } =
    [
        "http://127.0.0.1:5194",
        "http://localhost:5194",
    ];
}
