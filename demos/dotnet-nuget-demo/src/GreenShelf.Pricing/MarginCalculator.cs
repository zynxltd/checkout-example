namespace GreenShelf.Pricing;

/// <summary>
/// Margin helpers used in the crash-course debug labs (price − cost).
/// </summary>
public static class MarginCalculator
{
    /// <summary>
    /// Estimated margin given a retail price and cost-as-fraction-of-price (e.g. 0.62).
    /// MOWER1 @ £199 with 0.62 → £75.62.
    /// </summary>
    public static decimal Estimate(decimal price, decimal costRatio)
    {
        if (price < 0) throw new ArgumentOutOfRangeException(nameof(price));
        if (costRatio is < 0 or > 1) throw new ArgumentOutOfRangeException(nameof(costRatio));

        var cost = decimal.Round(price * costRatio, 2);
        return price - cost;
    }
}
