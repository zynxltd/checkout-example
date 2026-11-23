using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;
using Microsoft.AspNetCore.Mvc;

namespace DotnetMvcCrashCourse.Controllers;

/// <summary>
/// MVC controller — Laravel ProductController + Blade.
/// Depends on <see cref="IProductService"/> (not the store) so delete rules stay out of HTTP.
/// </summary>
public class ProductsController : Controller
{
    private readonly IProductService _products;
    private readonly IProductPolicy _policy;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService products, IProductPolicy policy, ILogger<ProductsController> logger)
    {
        _products = products;
        _policy = policy;
        _logger = logger;
    }

    // GET /Products?category=plants&q=rose
    public IActionResult Index(string? category, string? q)
    {
        ViewBag.Category = category;
        ViewBag.Q = q;
        return View(_products.List(category, q));
    }

    public IActionResult Details(int id)
    {
        var product = _products.Get(id);
        return product is null ? NotFound() : View(product);
    }

    public IActionResult Create() => View(new ProductForm());

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Create(ProductForm form)
    {
        if (!ModelState.IsValid) return View(form);

        var created = _products.Create(form);
        _logger.LogInformation("Created product {Sku} with id {Id}", created.Sku, created.Id);
        TempData["Flash"] = $"Added {created.Name}.";
        return RedirectToAction(nameof(Index));
    }

    // GET /Products/Edit/1
    public IActionResult Edit(int id)
    {
        var product = _products.Get(id);
        if (product is null) return NotFound();

        return View(new ProductForm
        {
            Sku = product.Sku,
            Name = product.Name,
            Category = product.Category,
            Price = product.Price,
            Stock = product.Stock,
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Edit(int id, ProductForm form)
    {
        if (!ModelState.IsValid) return View(form);

        if (!_products.Update(id, form)) return NotFound();

        TempData["Flash"] = $"Updated {form.Name}.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Delete(int id)
    {
        switch (_products.Delete(id))
        {
            case ProductDeleteOutcome.NotFound:
                return NotFound();
            case ProductDeleteOutcome.Conflict:
                TempData["Flash"] = _policy.CannotDeleteReason;
                return RedirectToAction(nameof(Index));
            default:
                TempData["Flash"] = "Product deleted.";
                return RedirectToAction(nameof(Index));
        }
    }
}
