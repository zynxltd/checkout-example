using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;
using Microsoft.AspNetCore.Mvc;

namespace DotnetMvcCrashCourse.Controllers.Api;

[ApiController]
[Route("api/leads")]
public class LeadsApiController : ControllerBase
{
    private readonly ILeadPipeline _pipeline;
    private readonly ILeadAuditStore _audit;
    private readonly ILogger<LeadsApiController> _logger;

    public LeadsApiController(ILeadPipeline pipeline, ILeadAuditStore audit, ILogger<LeadsApiController> logger)
    {
        _pipeline = pipeline;
        _audit = audit;
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<IEnumerable<LeadApplication>> List() => Ok(_pipeline.All());

    [HttpGet("stats")]
    public ActionResult<LeadStats> Stats() => Ok(_pipeline.GetStats());

    [HttpGet("{id:guid}")]
    public ActionResult<LeadApplication> Get(Guid id)
    {
        var lead = _pipeline.Find(id);
        return lead is null ? NotFound() : Ok(lead);
    }

    [HttpGet("{id:guid}/audit")]
    public ActionResult<IEnumerable<LeadAuditDocument>> Audit(Guid id)
    {
        if (_pipeline.Find(id) is null) return NotFound();
        return Ok(_audit.ForLead(id));
    }

    [HttpPost]
    public ActionResult<LeadApplication> Create([FromBody] LeadApplicationForm form)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var lead = _pipeline.Submit(form);
        _logger.LogInformation("Lead accepted {LeadId} — queued for processing", lead.Id);
        return Accepted($"/api/leads/{lead.Id}", lead);
    }

    [HttpPost("{id:guid}/requeue")]
    public ActionResult<LeadApplication> Requeue(Guid id)
    {
        if (!_pipeline.TryRequeue(id, out var error))
        {
            if (error == "Lead not found") return NotFound(new { error });
            return Conflict(new { error });
        }

        return Ok(_pipeline.Find(id));
    }
}
