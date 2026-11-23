var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => Results.Content(
    """
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Hello ASP.NET</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 32rem; margin: 3rem auto; padding: 0 1rem; }
        a { color: #0b5; }
        code { background: #f2f2f2; padding: 0.1rem 0.35rem; }
      </style>
    </head>
    <body>
      <h1>Hello ASP.NET</h1>
      <p>Dead-simple Minimal API app.</p>
      <p>Try <a href="/hello?name=Tom"><code>/hello?name=Tom</code></a></p>
    </body>
    </html>
    """,
    "text/html"));

app.MapGet("/hello", (string? name) =>
{
    var who = string.IsNullOrWhiteSpace(name) ? "world" : name.Trim();
    return Results.Text($"Hello, {who}!");
});

app.Run();
