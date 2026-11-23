using DotnetMinimalOrderDesk.Contracts;
using DotnetMinimalOrderDesk.Endpoints;
using DotnetMinimalOrderDesk.Filters;
using DotnetMinimalOrderDesk.Options;
using DotnetMinimalOrderDesk.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<OrderDeskOptions>(builder.Configuration.GetSection(OrderDeskOptions.SectionName));
builder.Services.AddSingleton<IOrderClock, SystemOrderClock>();
builder.Services.AddSingleton<IApiKeyValidator, ConfigApiKeyValidator>();
builder.Services.AddSingleton<ISkuCatalog, InMemorySkuCatalog>();
builder.Services.AddSingleton<IOrderPolicy, DefaultOrderPolicy>();
builder.Services.AddSingleton<IOrderStore, InMemoryOrderStore>();
builder.Services.AddSingleton<IOrderService, OrderService>();
builder.Services.AddSingleton<ApiKeyEndpointFilter>();

var app = builder.Build();

app.MapGet("/", () => Results.Content(HtmlPage(), "text/html"));
app.MapOrderDeskApi();

app.Run("http://127.0.0.1:5192");

static string HtmlPage() => """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Order Desk (Minimal APIs)</title>
  <style>
    body{font-family:Segoe UI,system-ui,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem;color:#15241a;background:#f4faf6}
    code,pre{background:#e8f2eb;padding:.15rem .35rem;border-radius:4px}
    pre{padding:.75rem;overflow:auto}
    h1{margin-bottom:.25rem}
    .muted{color:#5a6b60}
  </style>
</head>
<body>
  <h1>GreenShelf order desk</h1>
  <p class="muted">Minimal APIs + SOLID ports — catalog stock, status machine, API key filter, event log.</p>
  <p>Health: <a href="/api/health">/api/health</a> (open) · Catalog needs key</p>
  <pre>
# list catalog
curl -s http://127.0.0.1:5192/api/catalog -H 'X-Api-Key: greenshelf-desk-key'

# create (use list prices from catalog)
curl -s http://127.0.0.1:5192/api/orders \\
  -H 'X-Api-Key: greenshelf-desk-key' \\
  -H 'Content-Type: application/json' \\
  -d '{"customer":"Sam Lee","lines":[{"sku":"ROSE01","qty":2,"unitPrice":24.99}],"notes":"leave by shed"}'

# pack → ship
curl -s -X POST http://127.0.0.1:5192/api/orders/{id}/pack -H 'X-Api-Key: greenshelf-desk-key'
curl -s -X POST http://127.0.0.1:5192/api/orders/{id}/ship \\
  -H 'X-Api-Key: greenshelf-desk-key' -H 'Content-Type: application/json' \\
  -d '{"tracking":"GS-TRACK-1"}'

# cancel (open only, within cancel window)
curl -s -X POST http://127.0.0.1:5192/api/orders/{id}/cancel -H 'X-Api-Key: greenshelf-desk-key'
  </pre>
</body>
</html>
""";
