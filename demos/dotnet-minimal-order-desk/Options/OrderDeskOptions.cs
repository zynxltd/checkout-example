namespace DotnetMinimalOrderDesk.Options;

public sealed class OrderDeskOptions
{
    public const string SectionName = "OrderDesk";

    public string ApiKey { get; set; } = "greenshelf-desk-key";
    public int MaxLinesPerOrder { get; set; } = 8;
    public int CancelWindowMinutes { get; set; } = 30;
    public decimal MaxOrderTotal { get; set; } = 2500m;
}
