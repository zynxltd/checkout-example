using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;
using Microsoft.AspNetCore.Mvc;

namespace DotnetMvcCrashCourse.Controllers.Api;

[ApiController]
[Route("api/products")]
public class ProductsApiController : ControllerBase
{
    private readonly IProductService _products;
    private readonly IProductPolicy _policy;

    public ProductsApiController(IProductService products, IProductPolicy policy)
    {
        _products = products;
        _policy = policy;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetAll([FromQuery] string? category, [FromQuery] string? q)
        => Ok(_products.List(category, q));

    [HttpGet("{id:int}")]
    public ActionResult<Product> GetById(int id)
    {
        var product = _products.Get(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public ActionResult<Product> Create([FromBody] ProductForm form)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var created = _products.Create(form);
        return Created($"/api/products/{created.Id}", created);
    }

    [HttpPut("{id:int}")]
    public ActionResult<Product> Update(int id, [FromBody] ProductForm form)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        if (!_products.Update(id, form)) return NotFound();
        return Ok(_products.Get(id));
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        return _products.Delete(id) switch
        {
            ProductDeleteOutcome.NotFound => NotFound(),
            ProductDeleteOutcome.Conflict => Conflict(new { error = _policy.CannotDeleteReason }),
            _ => NoContent(),
        };
    }
}
