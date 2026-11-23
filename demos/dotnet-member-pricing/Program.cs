using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var catalog = new List<Product>
{
    new("PA255", "Strawberry Collection", "plants", 14.99m),
    new("ROSE01", "Rose Bush", "plants", 24.99m),
    new("FEED01", "Bird Feeder Kit", "plants", 9.99m),
    new("MOWER1", "Compact Lawn Mower", "machinery", 199.00m),
};

app.MapGet("/", () => Results.Content(HtmlPage(), "text/html"));

app.MapPost("/api/quote", async (HttpRequest request) =>
{
    var payload = await JsonSerializer.DeserializeAsync<QuoteRequest>(
        request.Body,
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

    if (payload?.Lines is null || payload.Lines.Count == 0)
    {
        return Results.BadRequest(new { error = "Add at least one line." });
    }

    var quote = MemberPricing.Quote(payload.Lines, payload.IsMember);
    return Results.Json(quote);
});

app.MapGet("/api/catalog", () => Results.Json(catalog));

app.Run("http://127.0.0.1:5088");

static string HtmlPage() => """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Member pricing engine — .NET P0</title>
  <style>
    :root { --bg:#eef2f7; --ink:#152033; --accent:#1f4b99; --card:#fff; --line:#cfd8e6; --muted:#5b6b82; }
    body { margin:0; font-family: "Segoe UI", system-ui, sans-serif; background:linear-gradient(#d9e4f5,#eef2f7 40%); color:var(--ink); }
    main { max-width:720px; margin:0 auto; padding:2rem 1.25rem; }
    .pill { display:inline-block; font-size:.75rem; border:1px solid var(--line); border-radius:999px; padding:.15rem .5rem; color:var(--muted); }
    .card { background:var(--card); border:1px solid var(--line); border-radius:8px; padding:1rem; margin-top:1rem; }
    button { font:inherit; cursor:pointer; border:0; border-radius:6px; padding:.5rem .85rem; background:var(--accent); color:#fff; font-weight:600; }
    button.ghost { background:#fff; color:var(--ink); border:1px solid var(--line); }
    .row { display:flex; justify-content:space-between; gap:1rem; align-items:center; }
    .muted { color:var(--muted); }
    .saving { color:var(--accent); font-size:1.4rem; font-weight:700; }
    table { width:100%; border-collapse:collapse; }
    th,td { text-align:left; padding:.4rem 0; border-bottom:1px solid var(--line); font-size:.95rem; }
  </style>
</head>
<body>
<main>
  <p class="pill">.NET + C# · P0</p>
  <h1>Member pricing engine</h1>
  <p class="muted">C# quotes plants at 15% and machinery at 7.5%. Toggle member and call <code>/api/quote</code>.</p>
  <section class="card">
    <div class="row">
      <div>
        <strong id="role">Guest</strong>
        <div class="muted">Club £10/year</div>
      </div>
      <button class="ghost" id="toggle" type="button">View as member</button>
    </div>
  </section>
  <section class="card">
    <h2>Catalog</h2>
    <div id="catalog"></div>
  </section>
  <section class="card">
    <h2>Quote</h2>
    <div id="quote" class="muted">Add products to see a quote.</div>
  </section>
</main>
<script>
  let isMember = false;
  const lines = [];

  async function loadCatalog() {
    const items = await fetch('/api/catalog').then(r => r.json());
    const root = document.getElementById('catalog');
    root.innerHTML = items.map(p => `
      <div class="row" style="padding:.45rem 0;border-bottom:1px solid var(--line)">
        <div><strong>${p.name}</strong><div class="muted">£${p.price.toFixed(2)} · ${p.category}</div></div>
        <button type="button" data-sku="${p.sku}">Add</button>
      </div>`).join('');
    root.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      const item = items.find(i => i.sku === btn.dataset.sku);
      const existing = lines.find(l => l.sku === item.sku);
      if (existing) existing.qty += 1;
      else lines.push({ ...item, qty: 1 });
      refreshQuote();
    }));
  }

  async function refreshQuote() {
    if (!lines.length) {
      document.getElementById('quote').textContent = 'Add products to see a quote.';
      return;
    }
    const quote = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ isMember, lines }),
    }).then(r => r.json());
    document.getElementById('quote').innerHTML = `
      <table>
        <thead><tr><th>Item</th><th>Qty</th><th>Guest</th><th>Member</th><th>Save</th></tr></thead>
        <tbody>
          ${quote.lines.map(l => `<tr>
            <td>${l.name}</td><td>${l.qty}</td>
            <td>£${l.lineTotal.toFixed(2)}</td>
            <td>£${l.memberLineTotal.toFixed(2)}</td>
            <td>£${l.saving.toFixed(2)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="margin-top:1rem">
        <div class="muted">${isMember ? 'Member subtotal' : 'You could save with Club'}</div>
        <div class="saving">£${(isMember ? quote.memberSubtotal : quote.clubSaving).toFixed(2)}</div>
        <div class="muted">Guest £${quote.guestSubtotal.toFixed(2)} · Member £${quote.memberSubtotal.toFixed(2)}</div>
      </div>`;
  }

  document.getElementById('toggle').addEventListener('click', () => {
    isMember = !isMember;
    document.getElementById('role').textContent = isMember ? 'Club member' : 'Guest';
    document.getElementById('toggle').textContent = isMember ? 'View as guest' : 'View as member';
    refreshQuote();
  });

  loadCatalog();
</script>
</body>
</html>
""";

public record Product(string Sku, string Name, string Category, decimal Price);

public record QuoteLine(string Sku, string Name, string Category, decimal Price, int Qty);

public record QuoteRequest(bool IsMember, List<QuoteLine> Lines);

public static class MemberPricing
{
    public const decimal ClubAnnual = 10m;
    public const decimal PlantRate = 0.15m;
    public const decimal MachineryRate = 0.075m;

    public static object Quote(List<QuoteLine> lines, bool isMember)
    {
        decimal guest = 0, member = 0;
        var priced = new List<object>();

        foreach (var line in lines)
        {
            var rate = line.Category == "machinery" ? MachineryRate : PlantRate;
            var lineTotal = decimal.Round(line.Price * line.Qty, 2);
            var memberLine = decimal.Round(lineTotal * (1 - rate), 2);
            var saving = lineTotal - memberLine;
            guest += lineTotal;
            member += memberLine;
            priced.Add(new
            {
                line.Sku,
                line.Name,
                line.Category,
                line.Price,
                line.Qty,
                LineTotal = lineTotal,
                MemberLineTotal = memberLine,
                Saving = saving,
            });
        }

        guest = decimal.Round(guest, 2);
        member = decimal.Round(member, 2);
        var clubSaving = guest - member;

        return new
        {
            IsMember = isMember,
            GuestSubtotal = guest,
            MemberSubtotal = member,
            ClubSaving = clubSaving,
            PaysForItself = clubSaving >= ClubAnnual,
            Lines = priced,
        };
    }
}

public partial class Program { }
