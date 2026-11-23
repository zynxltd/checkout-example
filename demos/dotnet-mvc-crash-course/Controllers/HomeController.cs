using System.Diagnostics;
using DotnetMvcCrashCourse.Models;
using DotnetMvcCrashCourse.Services;
using Microsoft.AspNetCore.Mvc;

namespace DotnetMvcCrashCourse.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger) => _logger = logger;

    public IActionResult Index()
    {
        var linqOk = LinqLab.RunSelfCheck();
        _logger.LogInformation("LinqLab.RunSelfCheck() = {Ok}", linqOk);
        ViewBag.LinqOk = linqOk;
        return View();
    }

    public IActionResult Spa() => View();

    public IActionResult Privacy() => View();

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
        => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
}
