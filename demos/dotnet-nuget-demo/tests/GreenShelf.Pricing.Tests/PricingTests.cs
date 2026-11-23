using GreenShelf.Pricing;
using Xunit;

namespace GreenShelf.Pricing.Tests;

public class MarginCalculatorTests
{
    [Fact]
    public void Mower_margin_is_75_62()
    {
        Assert.Equal(75.62m, MarginCalculator.Estimate(199.00m, 0.62m));
    }

    [Fact]
    public void Rejects_bad_cost_ratio()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => MarginCalculator.Estimate(10m, 1.5m));
    }
}

public class ClubPricingTests
{
    [Fact]
    public void Plants_get_15_percent_off()
    {
        var quote = ClubPricing.Quote([new QuoteLine("ROSE01", "plants", 20m, 1)]);
        Assert.Equal(20m, quote.GuestSubtotal);
        Assert.Equal(17m, quote.MemberSubtotal);
        Assert.Equal(3m, quote.ClubSaving);
    }

    [Fact]
    public void Machinery_gets_7_5_percent_off()
    {
        var quote = ClubPricing.Quote([new QuoteLine("MOWER1", "machinery", 200m, 1)]);
        Assert.Equal(200m, quote.GuestSubtotal);
        Assert.Equal(185m, quote.MemberSubtotal);
    }
}
