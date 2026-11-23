# .NET / ASP.NET commands — Laravel / Vue → .NET

Cheat sheet for day-to-day **.NET 10 / ASP.NET Core** when you already know **Laravel + Vue / Composer / Artisan**.

Companion lab: [`demos/dotnet-mvc-crash-course`](../dotnet-mvc-crash-course/).

---

## Mental model

| Laravel | ASP.NET Core |
|---------|----------------|
| `composer` | **`dotnet` CLI** (+ NuGet) |
| `artisan` | **`dotnet`** (`new`, `build`, `run`, `ef`, `test`) |
| `php artisan serve` | `dotnet run` |
| `routes/web.php` + `api.php` | `MapControllerRoute` + `[Route]` / minimal APIs |
| Blade / Vue | Razor (`.cshtml`) and/or React SPA |
| Eloquent | EF Core `DbContext` |
| `.env` | `appsettings.json` + env vars / user secrets |
| `storage/logs` | Console + `ILogger<T>` (+ App Insights in Azure) |

---

## Install & check SDK

```bash
dotnet --version          # e.g. 10.0.x
dotnet --list-sdks
dotnet --list-runtimes
dotnet --info             # full dump when support asks
```

| | |
|--|--|
| **When** | First machine setup; CI image checks |
| **Debug** | Wrong SDK → set `global.json` or install matching SDK |

---

## Create projects (≈ `composer create-project` / `artisan make:*`)

```bash
# Empty / class library
dotnet new console -n HelloCli
dotnet new classlib -n MyLib

# Web
dotnet new mvc -n MyMvc --framework net10.0
dotnet new webapi -n MyApi --framework net10.0
dotnet new blazor -n MyBlazor --framework net10.0

# Solution (many projects — like a monorepo)
dotnet new sln -n MySolution
dotnet sln add MyMvc/MyMvc.csproj
dotnet sln add MyApi/MyApi.csproj
```

| Command | Laravel cousin | When |
|---------|----------------|------|
| `dotnet new mvc` | Laravel app with Blade | Server-rendered + forms |
| `dotnet new webapi` | `api.php` only API | SPA front ends (React) |
| `dotnet new blazor` | Livewire-ish / SPA in .NET | Advert “Blazor” training |
| `dotnet new sln` | Multi-package repo | Microservices / Aspire layouts |

List templates:

```bash
dotnet new list
dotnet new mvc -h
```

---

## This repo’s crash course

```bash
cd demos/dotnet-mvc-crash-course
dotnet restore
dotnet build
dotnet run --launch-profile http
# → http://localhost:5187

dotnet watch run --launch-profile http   # hot reload (≈ Vite HMR for .NET)
```

| | |
|--|--|
| **When** | Daily local work |
| **Use case** | MVC + Web API learning path |
| **Debug** | Prefer **F5** in Cursor/VS/Rider with breakpoints (see below) |

---

## Packages (≈ Composer)

```bash
dotnet add package Newtonsoft.Json
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design

dotnet remove package Newtonsoft.Json
dotnet list package
dotnet list package --outdated

dotnet restore          # like composer install
```

| | |
|--|--|
| **When** | Need EF, JSON, Azure SDKs, test libs |
| **How** | Updates `.csproj`; restore on CI |
| **Debug** | Version conflicts → `dotnet list package --include-transitive` |

NuGet ≈ Packagist. Locking is via project assets / CI restore — commit `.csproj` + `PackageReference` versions.

### Author your own package (demo)

```bash
cd demos/dotnet-nuget-demo
./scripts/pack-and-run.sh
# pack → ./nupkg/*.nupkg  · consumer restores via nuget.config local feed
```

| Command | Composer cousin |
|---------|-----------------|
| `dotnet pack` | build a distributable archive |
| `PackageReference` | `composer require` |
| `nuget.config` feed | private Packagist / Satis / Artifactory |
| `dotnet nuget push` | `composer publish` to a remote |

Full walkthrough: [dotnet-nuget-demo/README.md](../dotnet-nuget-demo/README.md).

---

## Build, run, clean

```bash
dotnet build                 # compile
dotnet build -c Release      # production config
dotnet run                   # build + run
dotnet run --project path/to/App.csproj
dotnet run --launch-profile http
dotnet clean
dotnet publish -c Release -o ./publish   # deploy folder (≈ optimized build)
```

| Command | Laravel / Node cousin | When |
|---------|----------------------|------|
| `dotnet build` | `composer dump` + compile step | Check compile errors |
| `dotnet run` | `artisan serve` | Local |
| `dotnet watch run` | `npm run dev` HMR | Iterate controllers/views |
| `dotnet publish` | `npm run build` + deploy | IIS / Azure / Docker |

Pass args / URLs:

```bash
ASPNETCORE_URLS=http://127.0.0.1:5187 dotnet run --no-launch-profile
```

---

## EF Core (≈ migrations / Eloquent)

```bash
# tool once per machine
dotnet tool install --global dotnet-ef
dotnet ef --version

dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet ef migrations list
dotnet ef database drop --force
```

In code (crash course Ex 6): SQLite locally; Azure SQL later via:

```csharp
options.UseSqlServer(configuration.GetConnectionString("AzureSql"));
```

| | |
|--|--|
| **When** | Persist products/leads — job advert **Azure SQL** |
| **Use case** | Same as `artisan migrate` |
| **Debug** | Connection string wrong → exception on startup; enable sensitive logging only in Dev |

---

## Testing (≈ Pest / PHPUnit)

```bash
dotnet new xunit -n MyTests
dotnet add MyTests/MyTests.csproj reference MyApi/MyApi.csproj
dotnet test
dotnet test --filter "FullyQualifiedName~Products"
dotnet test -c Release
```

| | |
|--|--|
| **When** | Rules, API contracts, LINQ helpers |
| **Use case** | PR gate like `php artisan test` |
| **Debug** | Failing test → click stack in Test Explorer; debug test with breakpoint |

---

## Everyday “Artisan-like” tasks

| Goal | Laravel | .NET |
|------|---------|------|
| New controller | `make:controller` | Add `Controllers/FooController.cs` (or `dotnet new` snippets) |
| New model | `make:model` | `Models/Foo.cs` class / record |
| Serve | `artisan serve` | `dotnet run` |
| Tinker | `artisan tinker` | `dotnet script` / Rider scratch / small console |
| Env | `.env` | `appsettings.Development.json` + `dotnet user-secrets` |
| Clear caches | `optimize:clear` | stop app; no opcode cache locally |

User secrets (dev secrets not in git):

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:AzureSql" "Server=..."
```

---

## Debugging

### IDE (best path)

1. Open `.csproj` / folder in **Cursor / VS Code + C# Dev Kit**, **Rider**, or **Visual Studio**
2. Set breakpoints (gutter)
3. **F5** Start Debugging (or Run and Debug panel)
4. **F10** Step over · **F11** Step into · **Shift+F11** Step out
5. Locals / Watch / Call Stack / Debug Console

Crash course: `/DebugLab?sku=MOWER1` and `LeadQueueWorker`.

### Logging (≈ `Log::info` / `dd`)

```csharp
_logger.LogInformation("Created {Sku} id={Id}", sku, id);
_logger.LogDebug("...");
_logger.LogError(ex, "Failed");
```

```bash
# verbosity via env / appsettings
"Logging": { "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning" } }
```

Temporary:

```csharp
System.Diagnostics.Debugger.Break(); // if debugger attached
Console.WriteLine(payload);          // quick & dirty
```

### HTTP debugging

```bash
curl -i http://localhost:5187/api/products
curl -i -X POST http://localhost:5187/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"applicantName":"Sam","email":"s@x.com","loanAmount":7500,"productType":"personal"}'
```

Swagger: add Swashbuckle/OpenAPI in Web API templates — or use `/api/...` + curl.

### Common failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| Port in use | Another `dotnet run` | Change `launchSettings.json` URL |
| 500 in Dev | Unhandled exception | Read stack in browser / console |
| CSS/JS 404 or unstyled page | Static files / env | Ensure `UseStaticFiles()`, run with `ASPNETCORE_ENVIRONMENT=Development` or `dotnet run --launch-profile http`. Don’t link missing `*.styles.css` |
| DI error on start | Missing `AddSingleton`/`AddDbContext` | Register in `Program.cs` |
| Razor `@csrf` compile error | `@` is code in Razor | Escape as `@@csrf` in docs/views |

---

## Docker / Azure (awareness)

```bash
dotnet publish -c Release -o out
# Dockerfile: copy out/ → aspnet runtime image
```

| | |
|--|--|
| **When** | Job advert Azure / cloud-native |
| **Use case** | Same app; host on App Service / Container Apps |
| **Next in repo** | `demos/dotnet-aspire-garden-club` |

---

## Use-case recipes

| Use case | Commands |
|----------|----------|
| Learn MVC from Laravel | `dotnet run` in `dotnet-mvc-crash-course` + `EXERCISES.md` |
| API for React | `dotnet new webapi` or existing `/api/*` routes |
| DB like Eloquent | EF + `dotnet ef migrations add` |
| Hot reload | `dotnet watch run` |
| CI compile | `dotnet restore && dotnet build && dotnet test` |
| Interview debug story | F5 + DebugLab + Call Stack |

---

## Quick “I used to type…” map

| Laravel / Vue | .NET |
|---------------|------|
| `composer install` | `dotnet restore` |
| `php artisan serve` | `dotnet run` |
| `php artisan migrate` | `dotnet ef database update` |
| `php artisan test` | `dotnet test` |
| `composer require X` | `dotnet add package X` |
| `npm run dev` (assets) | Razor/wwwroot or separate React `npm run dev` |
| `dd($x)` / `Log::info` | Breakpoint / `ILogger` |
| `.env` | `appsettings.*.json` + user-secrets |
| `route:list` | Swagger / glance `Map*` + `[Route]` attributes |

Language checklist (generics, delegates, events, collections, modern C#):  
[docs/csharp-language-basics.md](../../docs/csharp-language-basics.md)
