using System.Text.Json;
using YgCartDrawer.Models;

namespace YgCartDrawer.Services;

public class DemoCart
{
    public const string PdpSku = "PA255";
    public const string ClubSkuAuto = "820005";
    public const string ClubSkuManual = "820010";
    public const decimal ClubPrice = 10m;
    public const decimal Delivery = 6.99m;
    public const decimal FreeDeliveryThreshold = 50m;

    private readonly IHttpContextAccessor _http;

    public DemoCart(IHttpContextAccessor http) => _http = http;

    private ISession Session => _http.HttpContext!.Session;

    public static Dictionary<string, Product> Catalogue { get; } = BuildCatalogue();

    public void ResetSeed()
    {
        Session.Remove("demo_cart_items");
        Session.Remove("demo_offer_code");
        Session.Remove("demo_club_in_cart");
        Seed();
    }

    public void Seed()
    {
        if (Session.GetString("demo_cart_items") is not null) return;

        SetLines(new List<CartLine>
        {
            new() { Sku = "401842", Qty = 1 },
            new() { Sku = "402156", Qty = 1 },
            new() { Sku = "403891", Qty = 1 },
            new() { Sku = "404220", Qty = 4 },
            new() { Sku = "404221", Qty = 1 },
        });
        Session.SetString("demo_offer_code", "");
        Session.SetInt32("demo_club_in_cart", 0);
        Session.SetInt32("demo_drawer_enabled", 1);
        Session.SetInt32("demo_free_delivery_bar", 1);
        Session.SetInt32("demo_show_upsells", 1);
        Session.SetInt32("demo_wide_drawer", 0);
        Session.SetInt32("demo_club_member", 0);
    }

    public List<CartLine> GetLines()
    {
        Seed();
        var json = Session.GetString("demo_cart_items") ?? "[]";
        return JsonSerializer.Deserialize<List<CartLine>>(json) ?? new();
    }

    public void SetLines(List<CartLine> lines)
    {
        Session.SetString("demo_cart_items", JsonSerializer.Serialize(lines));
        SyncClubFlag();
    }

    public void AddItem(string sku, int qty = 1, string? variant = null)
    {
        Seed();
        if (!Catalogue.ContainsKey(sku)) return;
        qty = Math.Max(1, qty);
        var lines = GetLines();
        var existing = lines.FirstOrDefault(l => l.Sku == sku);
        if (existing is not null)
        {
            existing.Qty += qty;
            if (!string.IsNullOrEmpty(variant)) existing.Variant = variant;
        }
        else
        {
            lines.Add(new CartLine { Sku = sku, Qty = qty, Variant = variant });
        }
        SetLines(lines);
    }

    public void SetQty(string sku, int qty)
    {
        Seed();
        var lines = GetLines()
            .Select(l => l.Sku == sku ? new CartLine { Sku = l.Sku, Qty = qty, Variant = l.Variant } : l)
            .Where(l => l.Qty > 0)
            .ToList();
        SetLines(lines);
    }

    public void Remove(string sku)
    {
        Seed();
        SetLines(GetLines().Where(l => l.Sku != sku).ToList());
    }

    public void AddClub(string? sku = null)
    {
        sku ??= ClubSkuAuto;
        AddItem(sku, 1);
    }

    public bool ApplyOffer(string code, out string? error)
    {
        Seed();
        code = code.Trim().ToUpperInvariant();
        error = null;
        if (string.IsNullOrEmpty(code))
        {
            error = "Please enter a code.";
            return false;
        }
        if (!string.IsNullOrEmpty(GetOfferCode()))
        {
            error = "You can only use one offer code per order.";
            return false;
        }
        if (code is not ("TEST" or "EM0000"))
        {
            error = "This offer code isn't valid. Try TEST or EM0000 in this demo.";
            return false;
        }
        Session.SetString("demo_offer_code", code);
        return true;
    }

    public void RemoveOffer()
    {
        Session.SetString("demo_offer_code", "");
    }

    public string? GetOfferCode()
    {
        var code = Session.GetString("demo_offer_code");
        return string.IsNullOrEmpty(code) ? null : code;
    }

    public bool ToggleOption(string key, bool enabled)
    {
        Seed();
        var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["delivery_bar"] = "demo_free_delivery_bar",
            ["free_delivery_bar"] = "demo_free_delivery_bar",
            ["upsells"] = "demo_show_upsells",
            ["show_upsells"] = "demo_show_upsells",
            ["wide_drawer"] = "demo_wide_drawer",
            ["drawer_enabled"] = "demo_drawer_enabled",
            ["club_member"] = "demo_club_member",
        };
        if (!map.TryGetValue(key, out var sessionKey))
            return false;
        Session.SetInt32(sessionKey, enabled ? 1 : 0);
        return true;
    }

    public void SetDrawerEnabled(bool enabled)
    {
        Seed();
        Session.SetInt32("demo_drawer_enabled", enabled ? 1 : 0);
    }

    public bool IsClubMember() => (Session.GetInt32("demo_club_member") ?? 0) == 1;

    public void SyncClubFlag()
    {
        Session.SetInt32("demo_club_in_cart", HasClubInCart() ? 1 : 0);
    }

    public bool ClubPricingActive()
    {
        Seed();
        return IsClubMember() || (Session.GetInt32("demo_club_in_cart") ?? 0) == 1;
    }

    public bool HasClubInCart() =>
        GetLines().Any(l => l.Sku is ClubSkuAuto or ClubSkuManual);

    public decimal UnitPrice(Product p) =>
        ClubPricingActive() && p.ClubPrice is decimal cp ? cp : p.Price;

    public CartState State()
    {
        Seed();
        var lines = GetLines();
        var clubInCart = (Session.GetInt32("demo_club_in_cart") ?? 0) == 1;
        var items = new List<CartItemView>();
        decimal subtotal = 0, savings = 0, clubMemberSavings = 0, potentialClub = 0;

        foreach (var line in lines)
        {
            if (!Catalogue.TryGetValue(line.Sku, out var p)) continue;
            var unit = UnitPrice(p);
            var lineTotal = unit * line.Qty;
            var lineSaving = Math.Max(0, (p.WasPrice - unit) * line.Qty);
            subtotal += lineTotal;
            savings += lineSaving;
            if (!p.IsClub && p.ClubPrice is decimal)
                clubMemberSavings += p.ClubSavingPerUnit * line.Qty;
            if (!p.IsClub)
                potentialClub += p.ClubSavingPerUnit * line.Qty;

            items.Add(new CartItemView
            {
                Sku = p.Sku,
                Name = p.Name,
                Variant = line.Variant ?? p.Variant,
                Image = "/" + p.Image.TrimStart('/'),
                Qty = line.Qty,
                Price = p.Price,
                UnitPrice = unit,
                WasPrice = p.WasPrice,
                LineSaving = lineSaving,
                LineTotal = lineTotal,
                IsClub = p.IsClub,
                Url = p.IsClub ? "/account/club" : "/pdp",
            });
        }

        var offer = GetOfferCode();
        var offerDiscount = offer == "TEST" ? 5.50m : 0m;
        var basketTotal = Math.Max(0, subtotal - offerDiscount);
        var spendMore = Math.Max(0, FreeDeliveryThreshold - subtotal);
        var progress = FreeDeliveryThreshold <= 0 ? 100 : (int)Math.Min(100, Math.Round(subtotal / 80m * 100));

        var basketSkus = lines.Select(l => l.Sku).ToHashSet();
        var upsells = UpsellSkus().Select(sku =>
        {
            var p = Catalogue[sku];
            return new UpsellView
            {
                Sku = sku,
                Name = p.Name,
                Image = "/" + p.Image.TrimStart('/'),
                Price = p.Price,
                From = true,
                InBasket = basketSkus.Contains(sku),
            };
        }).ToList();

        return new CartState
        {
            Items = items,
            Upsells = upsells,
            IsEmpty = items.Count == 0,
            ItemCount = items.Sum(i => i.Qty),
            Subtotal = subtotal,
            BasketTotal = basketTotal,
            Total = basketTotal + Delivery,
            YourSavings = savings + offerDiscount,
            OfferCode = offer,
            OfferDiscount = offerDiscount,
            ClubMember = IsClubMember(),
            ClubInCart = clubInCart,
            ClubSavings = potentialClub,
            ClubMemberSavings = ClubPricingActive() ? clubMemberSavings : 0,
            ClubPrice = ClubPrice,
            ClubWasPrice = 20m,
            ClubManualPrice = 20m,
            ShowFreeDeliveryBar = (Session.GetInt32("demo_free_delivery_bar") ?? 0) == 1,
            ShowUpsells = (Session.GetInt32("demo_show_upsells") ?? 1) == 1,
            WideDrawer = (Session.GetInt32("demo_wide_drawer") ?? 0) == 1,
            DrawerEnabled = (Session.GetInt32("demo_drawer_enabled") ?? 1) == 1,
            GiftSpendMore = spendMore,
            GiftProgressPercent = progress,
            GiftQualified = subtotal >= FreeDeliveryThreshold,
        };
    }

    private static IEnumerable<string> UpsellSkus() =>
        new[] { "501001", "501002", "501003", "501004" };

    private static Dictionary<string, Product> BuildCatalogue()
    {
        Product P(string sku, string name, string? variant, string image, decimal price, decimal was, decimal club, decimal save, bool clubItem = false) =>
            new()
            {
                Sku = sku, Name = name, Variant = variant, Image = image,
                Price = price, WasPrice = was, ClubPrice = clubItem ? null : club,
                ClubSavingPerUnit = save, IsClub = clubItem,
            };

        return new Dictionary<string, Product>
        {
            ["401842"] = P("401842", "Upright Zonal Geranium 'Parade' Mix", "12 x plug plants", "images/products/401842.jpg", 9.99m, 14.99m, 8.49m, 1.50m),
            ["402156"] = P("402156", "Eryngium 'Blue Hobbit'", "1 x 9cm potted plant", "images/products/402156.jpg", 14.97m, 29.97m, 9.72m, 5.25m),
            ["403891"] = P("403891", "Imperata 'Red Baron' - Blood Grass", "1 x 2 Litre Pot", "images/products/403891.jpg", 14.97m, 29.97m, 12.72m, 2.25m),
            ["PA255"] = P("PA255", "Petunia 'Easy Wave' Ultimate Mix", "5 x Garden Ready Plants", "images/products/404220.jpg", 6.99m, 9.99m, 5.94m, 1.05m),
            ["PA256"] = P("PA256", "Petunia 'Easy Wave' Ultimate Mix", "10 x Garden Ready Plants", "images/products/404220.jpg", 12.99m, 19.99m, 11.04m, 1.95m),
            ["404220"] = P("404220", "Pre-Planted 'Summer Sensation' Hanging Baskets", "1 x 35cm basket", "images/products/404220.jpg", 24.98m, 39.98m, 21.23m, 3.75m),
            ["404221"] = P("404221", "Premium Professional Compost", "2 x 50 Litre Bags", "images/products/404220.jpg", 24.98m, 42.97m, 21.23m, 3.75m),
            ["510317"] = P("510317", "Sicilian Lemon Tree", "1 x 4 Litre Pot", "images/products/510317.png", 24.99m, 39.99m, 21.24m, 3.75m),
            ["501001"] = P("501001", "Blooming Fast Superior Soluble Plant Food", "800g tub", "images/products/401842.jpg", 4.99m, 7.99m, 4.24m, 0.75m),
            ["501002"] = P("501002", "Rootgrow Mycorrhizal Fungi", "360g pouch", "images/products/402156.jpg", 3.99m, 5.99m, 3.39m, 0.60m),
            ["501003"] = P("501003", "Bulb Starter Fertiliser with rootgrow", "1 x 1kg tub", "images/products/403891.jpg", 9.99m, 14.99m, 8.49m, 1.50m),
            ["501004"] = P("501004", "Enriched Multi-Purpose Compost", "40L bag", "images/products/404220.jpg", 7.99m, 11.99m, 6.79m, 1.20m),
            [ClubSkuAuto] = P(ClubSkuAuto, "YG Discount Club Yearly Subscription Membership", "Auto renewal", "images/club/discount-club-logo.png", ClubPrice, 20m, 0, 0, true),
            [ClubSkuManual] = P(ClubSkuManual, "YG Discount Club One Year Membership", "1 year", "images/club/discount-club-logo.png", 20m, 20m, 0, 0, true),
        };
    }
}
