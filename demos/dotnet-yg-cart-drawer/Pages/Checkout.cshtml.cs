using Microsoft.AspNetCore.Mvc.RazorPages;
using YgCartDrawer.Models;
using YgCartDrawer.Services;

namespace YgCartDrawer.Pages;

public class CheckoutModel : PageModel
{
    private readonly DemoCart _cart;

    public CheckoutModel(DemoCart cart) => _cart = cart;

    public CartState Cart { get; set; } = new();

    public void OnGet()
    {
        _cart.Seed();
        Cart = _cart.State();
    }
}
