using Microsoft.AspNetCore.Mvc.RazorPages;
using YgCartDrawer.Models;
using YgCartDrawer.Services;

namespace YgCartDrawer.Pages;

public class PdpModel : PageModel
{
    private readonly DemoCart _cart;

    public PdpModel(DemoCart cart) => _cart = cart;

    public Product? Product { get; set; }

    public void OnGet(string? sku = null)
    {
        _cart.Seed();
        sku ??= DemoCart.PdpSku;
        Product = DemoCart.Catalogue.TryGetValue(sku, out var p)
            ? p
            : DemoCart.Catalogue[DemoCart.PdpSku];
    }
}
