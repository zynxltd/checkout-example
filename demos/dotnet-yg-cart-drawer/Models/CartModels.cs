namespace YgCartDrawer.Models;

public class Product
{
    public string Sku { get; set; } = "";
    public string Name { get; set; } = "";
    public string? Variant { get; set; }
    public string Image { get; set; } = "";
    public decimal Price { get; set; }
    public decimal WasPrice { get; set; }
    public decimal? ClubPrice { get; set; }
    public decimal ClubSavingPerUnit { get; set; }
    public bool IsClub { get; set; }
}

public class CartLine
{
    public string Sku { get; set; } = "";
    public int Qty { get; set; }
    public string? Variant { get; set; }
}

public class CartItemView
{
    public string Sku { get; set; } = "";
    public string Name { get; set; } = "";
    public string? Variant { get; set; }
    public string Image { get; set; } = "";
    public int Qty { get; set; }
    public decimal Price { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal WasPrice { get; set; }
    public decimal LineSaving { get; set; }
    public decimal LineTotal { get; set; }
    public bool IsClub { get; set; }
    public string Url { get; set; } = "/pdp";
}

public class UpsellView
{
    public string Sku { get; set; } = "";
    public string Name { get; set; } = "";
    public string Image { get; set; } = "";
    public decimal Price { get; set; }
    public bool From { get; set; }
    public bool InBasket { get; set; }
}

public class CartState
{
    public List<CartItemView> Items { get; set; } = new();
    public List<UpsellView> Upsells { get; set; } = new();
    public bool IsEmpty { get; set; }
    public int ItemCount { get; set; }
    public decimal Subtotal { get; set; }
    public decimal BasketTotal { get; set; }
    public decimal Total { get; set; }
    public decimal YourSavings { get; set; }
    public string? OfferCode { get; set; }
    public decimal OfferDiscount { get; set; }
    public bool ClubMember { get; set; }
    public bool ClubInCart { get; set; }
    public decimal ClubSavings { get; set; }
    public decimal ClubMemberSavings { get; set; }
    public decimal ClubPrice { get; set; } = 10m;
    public decimal ClubWasPrice { get; set; } = 20m;
    public decimal ClubManualPrice { get; set; } = 20m;
    public bool ShowFreeDeliveryBar { get; set; }
    public bool ShowUpsells { get; set; } = true;
    public bool WideDrawer { get; set; }
    public bool DrawerEnabled { get; set; } = true;
    public decimal GiftSpendMore { get; set; }
    public int GiftProgressPercent { get; set; }
    public int GiftMilestonePercent { get; set; } = 62;
    public decimal GiftProgressMilestone { get; set; } = 50;
    public decimal GiftProgressMax { get; set; } = 80;
    public bool GiftQualified { get; set; }
}
