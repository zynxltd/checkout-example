# GreenShelf.Pricing

Demo NuGet library: **margin** + **club member** pricing helpers.

```csharp
using GreenShelf.Pricing;

var margin = MarginCalculator.Estimate(199m, 0.62m); // 75.62m

var quote = ClubPricing.Quote([
    new QuoteLine("ROSE01", "plants", 24.99m, 2),
    new QuoteLine("MOWER1", "machinery", 199m, 1),
]);
```

Pack locally: see the demo README in `demos/dotnet-nuget-demo`.
