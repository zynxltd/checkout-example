using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Data;
using DotnetMvcCrashCourse.Services;
using Microsoft.EntityFrameworkCore;

// Without a launch profile, ASP.NET defaults to Production and scoped CSS / static web
// assets break (see /DotnetMvcCrashCourse.styles.css → 500). Prefer Development locally.
if (string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")))
{
    Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Development");
}

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseStaticWebAssets();

builder.Services.AddControllersWithViews();

builder.Services.Configure<LeadOptions>(builder.Configuration.GetSection(LeadOptions.SectionName));

var driver = builder.Configuration["Persistence:Driver"] ?? "sqlite";
var sqlitePath = builder.Configuration["Persistence:SqlitePath"] ?? "greenshelf.db";

if (string.Equals(driver, "memory", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddSingleton<IProductStore, InMemoryProductStore>();
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite($"Data Source={sqlitePath}"));
    builder.Services.AddScoped<IProductStore, EfProductStore>();
}

builder.Services.AddSingleton<IProductPolicy, ProductPolicy>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddSingleton<ILeadPipeline, InMemoryLeadPipeline>();
builder.Services.AddSingleton<ILeadRouter, DefaultLeadRouter>();

builder.Services.Configure<AuditStoreOptions>(builder.Configuration.GetSection(AuditStoreOptions.SectionName));
var auditDriver = builder.Configuration["AuditStore:Driver"] ?? "memory";
if (string.Equals(auditDriver, "mongo", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddSingleton<ILeadAuditStore, MongoLeadAuditStore>();
}
else
{
    builder.Services.AddSingleton<ILeadAuditStore, InMemoryLeadAuditStore>();
}

builder.Services.AddHttpClient<IPartnerWebhook, PartnerWebhookClient>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(3);
});
builder.Services.AddHostedService<LeadQueueWorker>();

var app = builder.Build();

if (string.Equals(driver, "sqlite", StringComparison.OrdinalIgnoreCase)
    || string.Equals(driver, "ef", StringComparison.OrdinalIgnoreCase))
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    ProductSeed.EnsureSeeded(db);
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // wwwroot (Bootstrap, site.css, js) — Laravel public/
app.UseRouting();
app.UseAuthorization();

app.MapStaticAssets();
app.MapControllers();
app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();
