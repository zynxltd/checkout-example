var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Each Use(...) wraps the rest of the pipeline.
// Request flows DOWN (1 → 2 → 3 → endpoint),
// then response flows UP (endpoint → 3 → 2 → 1).

app.Use(async (context, next) =>
{
    Console.WriteLine("→ [1] Enter Guard");
    await next(); // pass to the next middleware
    Console.WriteLine("← [1] Leave Guard");
});

app.Use(async (context, next) =>
{
    Console.WriteLine("  → [2] Enter Logger");
    Console.WriteLine($"     path = {context.Request.Path}");
    await next();
    Console.WriteLine($"  ← [2] Leave Logger (status {context.Response.StatusCode})");
});

app.Use(async (context, next) =>
{
    Console.WriteLine("    → [3] Enter Timer");
    var started = DateTime.UtcNow;
    await next();
    var ms = (DateTime.UtcNow - started).TotalMilliseconds;
    Console.WriteLine($"    ← [3] Leave Timer ({ms:0} ms)");
});

// Endpoint = end of the pipeline (no "next")
app.MapGet("/", () =>
{
    Console.WriteLine("      ★ Endpoint: Home page");
    return Results.Content(
        """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Middleware Pipeline Demo</title>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 36rem; margin: 3rem auto; padding: 0 1rem; line-height: 1.5; }
            code { background: #f2f2f2; padding: 0.1rem 0.35rem; }
            pre { background: #f7f7f7; padding: 1rem; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>Middleware Pipeline Demo</h1>
          <p>Open the terminal where <code>dotnet run</code> is running. Refresh this page and watch the log order.</p>
          <pre>
        → [1] Enter Guard
          → [2] Enter Logger
            → [3] Enter Timer
              ★ Endpoint: Home page
            ← [3] Leave Timer
          ← [2] Leave Logger
        ← [1] Leave Guard
          </pre>
          <p>Also try <a href="/about"><code>/about</code></a>.</p>
        </body>
        </html>
        """,
        "text/html");
});

app.MapGet("/about", () =>
{
    Console.WriteLine("      ★ Endpoint: About page");
    return Results.Text("About — check the console for the same enter/leave order.");
});

app.Run();
