using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;
using Microsoft.AspNetCore.Mvc;

namespace DotnetMvcCrashCourse.Controllers;

public class LeadsController : Controller
{
    private readonly ILeadPipeline _pipeline;

    public LeadsController(ILeadPipeline pipeline) => _pipeline = pipeline;

    public IActionResult Index()
    {
        ViewBag.Stats = _pipeline.GetStats();
        return View(_pipeline.All());
    }

    public IActionResult Create() => View(new LeadApplicationForm());

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Create(LeadApplicationForm form)
    {
        if (!ModelState.IsValid) return View(form);

        var lead = _pipeline.Submit(form);
        TempData["Flash"] = $"Lead {lead.ApplicantName} queued ({lead.Id:N}).";
        return RedirectToAction(nameof(Index));
    }
}
