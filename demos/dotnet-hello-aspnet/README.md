# Hello ASP.NET — dead simple Minimal API

One `Program.cs`. Two routes. No MVC, no Razor, no database.

## Run

```bash
cd demos/dotnet-hello-aspnet
dotnet run
```

Open **http://127.0.0.1:5197**

| Route | What it does |
|-------|----------------|
| `GET /` | Tiny HTML home page |
| `GET /hello?name=Tom` | Plain-text greeting |
