using Microsoft.AspNetCore.Mvc.RazorPages;
using YgCartDrawer.Models;
using YgCartDrawer.Services;

namespace YgCartDrawer.Pages;

public class IndexModel : PageModel
{
    private readonly DemoCart _cart;

    public IndexModel(DemoCart cart) => _cart = cart;

    public List<Product> Featured { get; set; } = new();

    public void OnGet()
    {
        _cart.Seed();
        Featured = new[] { "401842", "402156", "404220", "PA255" }
            .Where(sku => DemoCart.Catalogue.ContainsKey(sku))
            .Select(sku => DemoCart.Catalogue[sku])
            .ToList();
    }
}
