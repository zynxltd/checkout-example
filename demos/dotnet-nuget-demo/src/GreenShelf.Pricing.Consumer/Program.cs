using GreenShelf.Pricing;

Console.WriteLine("GreenShelf.Pricing consumer (NuGet PackageReference)\n");

var margin = MarginCalculator.Estimate(199.00m, 0.62m);
Console.WriteLine($"MOWER1 margin @ 62% cost: £{margin:0.00}");

var quote = ClubPricing.Quote(
[
    new QuoteLine("ROSE01", "plants", 24.99m, 2),
    new QuoteLine("HERB12", "plants", 14.50m, 1),
    new QuoteLine("MOWER1", "machinery", 199.00m, 1),
]);

Console.WriteLine($"Guest subtotal:   £{quote.GuestSubtotal:0.00}");
Console.WriteLine($"Member subtotal:  £{quote.MemberSubtotal:0.00}");
Console.WriteLine($"Club saving:      £{quote.ClubSaving:0.00}");
Console.WriteLine($"Pays for itself:  {quote.PaysForItself}");
Console.WriteLine();

foreach (var line in quote.Lines)
{
    Console.WriteLine($"  {line.Sku,-8} guest £{line.LineTotal:0.00} → member £{line.MemberLineTotal:0.00} (save £{line.Saving:0.00})");
}
