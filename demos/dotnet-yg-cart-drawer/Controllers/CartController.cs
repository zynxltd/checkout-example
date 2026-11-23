using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using YgCartDrawer.Models;
using YgCartDrawer.Services;

namespace YgCartDrawer.Controllers;

[ApiController]
[Route("cart")]
[IgnoreAntiforgeryToken]
public class CartController : Controller
{
    private readonly DemoCart _cart;
    private readonly IRazorViewEngine _viewEngine;
    private readonly ITempDataProvider _tempData;

    public CartController(DemoCart cart, IRazorViewEngine viewEngine, ITempDataProvider tempData)
    {
        _cart = cart;
        _viewEngine = viewEngine;
        _tempData = tempData;
    }

    [HttpGet("fragment")]
    public async Task<IActionResult> Fragment()
    {
        var state = _cart.State();
        var html = await RenderPartialAsync("_Drawer", state);
        return Ok(new { html, cart = ToClientCart(state) });
    }

    public record SkuQty(string? Sku, int Qty = 1, string? Variant = null);
    public record CodeBody(string? Type, string? Code);
    public record ClubBody(string? Sku);
    public record ToggleBody(bool Enabled);
    public record OptionBody(string? Key, bool Enabled);

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] SkuQty body)
    {
        var sku = string.IsNullOrWhiteSpace(body.Sku) ? DemoCart.PdpSku : body.Sku!;
        if (!DemoCart.Catalogue.ContainsKey(sku))
            return UnprocessableEntity(new { error = "Unknown product." });
        _cart.AddItem(sku, body.Qty, body.Variant);
        return await Fragment();
    }

    [HttpPost("qty")]
    public async Task<IActionResult> Qty([FromBody] SkuQty body)
    {
        if (string.IsNullOrWhiteSpace(body.Sku))
            return UnprocessableEntity(new { error = "Missing sku." });
        _cart.SetQty(body.Sku, Math.Max(0, body.Qty));
        return await Fragment();
    }

    [HttpPost("remove")]
    public async Task<IActionResult> Remove([FromBody] SkuQty body)
    {
        if (!string.IsNullOrWhiteSpace(body.Sku))
            _cart.Remove(body.Sku!);
        return await Fragment();
    }

    [HttpPost("code")]
    public async Task<IActionResult> ApplyCode([FromBody] CodeBody body)
    {
        if (!string.Equals(body.Type, "offer", StringComparison.OrdinalIgnoreCase))
            return UnprocessableEntity(new { error = "Gift vouchers can only be applied at checkout." });
        if (!_cart.ApplyOffer(body.Code ?? "", out var error))
            return UnprocessableEntity(new { error });
        return await Fragment();
    }

    [HttpDelete("code")]
    public async Task<IActionResult> RemoveCode([FromBody] CodeBody? body)
    {
        if (body?.Type is not null && !string.Equals(body.Type, "offer", StringComparison.OrdinalIgnoreCase))
            return UnprocessableEntity(new { error = "Gift vouchers can only be removed at checkout." });
        _cart.RemoveOffer();
        return await Fragment();
    }

    [HttpPost("club")]
    public async Task<IActionResult> Club([FromBody] ClubBody? body)
    {
        if (_cart.IsClubMember())
            return UnprocessableEntity(new { error = "You are already a club member." });
        if (_cart.HasClubInCart())
            return UnprocessableEntity(new { error = "Club membership is already in your basket." });

        var sku = string.IsNullOrWhiteSpace(body?.Sku) ? DemoCart.ClubSkuAuto : body!.Sku!;
        if (sku is not (DemoCart.ClubSkuAuto or DemoCart.ClubSkuManual))
            return UnprocessableEntity(new { error = "Unknown membership product." });

        _cart.AddClub(sku);
        return await Fragment();
    }

    [HttpPost("reset")]
    public async Task<IActionResult> Reset()
    {
        _cart.ResetSeed();
        return await Fragment();
    }

    [HttpPost("toggle-option")]
    public async Task<IActionResult> ToggleOption([FromBody] OptionBody body)
    {
        if (string.IsNullOrWhiteSpace(body.Key))
            return UnprocessableEntity(new { error = "Unknown option." });

        if (string.Equals(body.Key, "club_member", StringComparison.OrdinalIgnoreCase))
        {
            _cart.ToggleOption(body.Key, body.Enabled);
            return Ok(new { ok = true, reload = true });
        }

        if (!_cart.ToggleOption(body.Key!, body.Enabled))
            return UnprocessableEntity(new { error = "Unknown option." });

        return await Fragment();
    }

    private static object ToClientCart(CartState s) => new
    {
        items = s.Items.Select(i => new
        {
            sku = i.Sku,
            name = i.Name,
            variant = i.Variant,
            image = i.Image,
            qty = i.Qty,
            price = i.Price,
            unit_price = i.UnitPrice,
            was_price = i.WasPrice,
            line_saving = i.LineSaving,
            line_total = i.LineTotal,
            is_club = i.IsClub,
            url = i.Url,
        }),
        upsells = s.Upsells.Select(u => new
        {
            sku = u.Sku,
            name = u.Name,
            image = u.Image,
            price = u.Price,
            from = u.From,
            in_basket = u.InBasket,
        }),
        is_empty = s.IsEmpty,
        item_count = s.ItemCount,
        subtotal = s.Subtotal,
        basket_total = s.BasketTotal,
        total = s.Total,
        your_savings = s.YourSavings,
        offer_code = s.OfferCode,
        offer_discount = s.OfferDiscount,
        club_member = s.ClubMember,
        club_in_cart = s.ClubInCart,
        club_savings = s.ClubSavings,
        club_member_savings = s.ClubMemberSavings,
        club_price = s.ClubPrice,
        club_was_price = s.ClubWasPrice,
        club_manual_price = s.ClubManualPrice,
        show_free_delivery_bar = s.ShowFreeDeliveryBar,
        show_upsells = s.ShowUpsells,
        wide_drawer = s.WideDrawer,
        drawer_enabled = s.DrawerEnabled,
        gift_spend_more = s.GiftSpendMore,
        gift_progress_percent = s.GiftProgressPercent,
        gift_qualified = s.GiftQualified,
    };

    private async Task<string> RenderPartialAsync(string viewName, object model)
    {
        var actionContext = new ActionContext(HttpContext, RouteData, new ActionDescriptor());
        await using var sw = new StringWriter();
        var viewResult = _viewEngine.FindView(actionContext, viewName, false);
        if (!viewResult.Success)
            viewResult = _viewEngine.GetView(null, $"~/Pages/Shared/{viewName}.cshtml", false);
        if (!viewResult.Success)
            throw new InvalidOperationException($"View {viewName} not found");

        var viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
        {
            Model = model,
        };
        var viewContext = new ViewContext(
            actionContext,
            viewResult.View,
            viewDictionary,
            new TempDataDictionary(HttpContext, _tempData),
            sw,
            new HtmlHelperOptions());
        await viewResult.View.RenderAsync(viewContext);
        return sw.ToString();
    }
}
