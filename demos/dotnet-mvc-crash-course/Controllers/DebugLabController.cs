using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Services;
using Microsoft.AspNetCore.Mvc;

namespace DotnetMvcCrashCourse.Controllers;

public class DebugLabController : Controller
{
    private readonly IProductService _products;
    private readonly ILogger<DebugLabController> _logger;

    public DebugLabController(IProductService products, ILogger<DebugLabController> logger)
    {
        _products = products;
        _logger = logger;
    }

    // GET /DebugLab?sku=MOWER1
    public IActionResult Index(string? sku)
    {
        var products = _products.List();

        // BREAKPOINT 1
        var match = products.FirstOrDefault(p =>
            string.Equals(p.Sku, sku, StringComparison.OrdinalIgnoreCase));

        // BREAKPOINT 2 — F11 into CalculateMargin
        var margin = match is null ? 0m : CalculateMargin(match.Price, costRatio: 0.62m);

        _logger.LogInformation("DebugLab sku={Sku} found={Found} margin={Margin}", sku, match is not null, margin);

        ViewBag.Sku = sku;
        ViewBag.Match = match;
        ViewBag.Margin = margin;
        ViewBag.Count = products.Count;
        ViewBag.LinqOk = LinqLab.RunSelfCheck();

        return View();
    }

    /// <summary>MOWER1 @ £199 with costRatio 0.62 → margin £75.62.</summary>
    private static decimal CalculateMargin(decimal price, decimal costRatio)
    {
        var cost = decimal.Round(price * costRatio, 2);
        return price - cost;
    }
}
