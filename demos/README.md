# Stack demo pack (P0 picks)

**Up-to-speed walkthrough (all tasks in order):** [docs/WALKTHROUGH.md](../docs/WALKTHROUGH.md)

One runnable P0 from each stack. Review board marks these as **Built**.

| Stack | Demo | Path | Run |
|-------|------|------|-----|
| Laravel + Python | Club savings calculator | `laravel-python-club-savings/` | `php -S 127.0.0.1:8081 -t public` (+ `python3 scripts/club_lift_report.py`) |
| React / Shopify | Smart cart drawer + upsells | `react-shopify-cart-drawer/` | `npm install && npm run dev` |
| Python + React | Crash course for Laravel → SE role | `python-react-crash-course/` | API `:8200` + Web `:5173` · [COMMANDS](python-react-crash-course/COMMANDS.md) |
| React | Crash course Vue/Laravel → React | `react-crash-course/` | `npm run dev` `:5179` · [COMMANDS](react-crash-course/COMMANDS.md) |
| Node.js + Nuxt | Product quiz → cart | `node-nuxt-product-quiz/` | `npm install && npm run dev` |
| .NET + C# | Member pricing engine | `dotnet-member-pricing/` | `dotnet run` |
| ASP.NET Core | Standard website (Northline) | `aspnet-standard-website/` | `dotnet run --launch-profile http` |
| ASP.NET Core MVC | Crash course for Laravel/Vue → .NET | `dotnet-mvc-crash-course/` | `dotnet run` `:5187` · [COMMANDS](dotnet-mvc-crash-course/COMMANDS.md) |
| Blazor Server | Project Priority Board 2.0 (Codecademy lab) | `dotnet-blazor-project-priority-board/` | `dotnet run --launch-profile http` `:5243` · [TASKS](dotnet-blazor-project-priority-board/TASKS.md) |
| .NET Minimal APIs | Books API (filters + endpoint groups) | `dotnet-minimal-books-api/` | `dotnet run --launch-profile http` `:5094` · [README](dotnet-minimal-books-api/README.md) |
| .NET Minimal APIs | Travel Bucket List (Codecademy lab) | `dotnet-travel-bucket-list-api/` | `dotnet run --launch-profile http` · [TASKS](dotnet-travel-bucket-list-api/TASKS.md) |
| .NET console | OOP SOLID five principles (SRP/OCP/LSP) | `dotnet-oop-solid-five-principles/` | `dotnet run --project OpenClosePrinciple` · [README](dotnet-oop-solid-five-principles/README.md) |
| Swift + SwiftUI | GreenShelf Mac desk (native .app) | `swift-greenshelf-desk/` | `./scripts/run.sh` · [README](swift-greenshelf-desk/README.md) |
| .NET SignalR | Live auction (SOLID + soft-close) | `dotnet-signalr-plant-auction/` | `dotnet run` `:5191` · [README](dotnet-signalr-plant-auction/README.md) · [ARCHITECTURE](dotnet-signalr-plant-auction/ARCHITECTURE.md) |
| .NET Minimal APIs | Order desk (stock + status machine) | `dotnet-minimal-order-desk/` | `dotnet run` `:5192` · [README](dotnet-minimal-order-desk/README.md) · [ARCHITECTURE](dotnet-minimal-order-desk/ARCHITECTURE.md) |
| .NET + React | Click & collect (SPA + Minimal API) | `dotnet-react-click-collect/` | API `:5193` + Web `:5194` · [README](dotnet-react-click-collect/README.md) · [ARCHITECTURE](dotnet-react-click-collect/ARCHITECTURE.md) |
| .NET ML.NET | Plant demand classifier | `dotnet-mlnet-plant-demand/` | `dotnet run` `:5195` · [README](dotnet-mlnet-plant-demand/README.md) |
| .NET Azure AI | Garden tips (stub + Azure OpenAI) | `dotnet-azure-ai-garden-tips/` | `dotnet run` `:5196` · [README](dotnet-azure-ai-garden-tips/README.md) |
| Go | GreenShelf order desk (stdlib HTTP + goroutines) | `golang-greenshelf-desk/` | `go run ./cmd/server` `:5201` · [README](golang-greenshelf-desk/README.md) · [ARCHITECTURE](golang-greenshelf-desk/ARCHITECTURE.md) |
| Go syntax lab | Tour / Effective Go drills (65) | `golang-basics-lab/` | `go run snippets/001-hello.go` · [TASKS](golang-basics-lab/TASKS.md) |
| C# syntax lab | MS Learn classes + Fiddle | `dotnet-csharp-lab/mslearn-classes/` | `dotnet run 03-reference-share.cs` or [.NET Fiddle](https://dotnetfiddle.net/) · [TASKS](dotnet-csharp-lab/mslearn-classes/TASKS.md) |
| .NET NuGet | Author + consume local package | `dotnet-nuget-demo/` | `./scripts/pack-and-run.sh` · [README](dotnet-nuget-demo/README.md) |
| .NET 10 + Aspire + EF Core | Garden club catalogue (Azure DevOps) | `dotnet-aspire-garden-club/` | Web `:5288` or AppHost — see folder README |
| Node.js MVC | Express MVC (Harbor) | `node-mvc-demo/` | `npm run dev` `:3090` · [COMMANDS](node-mvc-demo/COMMANDS.md) |
| Node.js + React | SaaS ops (Plotline) + DevOps bonus | `node-react-saas/` | API `:5210` + Web `:5180` · [DEVOPS](node-react-saas/DEVOPS.md) |
| iGaming / Pixi | HTML5 slot (Neon Reels) | `igaming-pixi-slot/` | `npm install && npm run dev` |
| .NET 10 + React | Green energy SaaS (Verdant Grid) | `green-energy-saas/` | API `:5100` + Web `:5175` — see folder README |
| Tripetto + React | Horizontal autoscroll + custom blocks (Plant Match) | `tripetto-custom-blocks/` | `npm install && npm run dev` → `:5176` |
| React | Animated section BGs + Pip mascot | `garden-mascot-site/` | `npm install && npm run dev` → `:5177` |
| React | YouGarden spin-the-wheel promo | `yougarden-spin-wheel/` | `npm install && npm run dev` → `:5178` |
| Shopify | Liquid vs React (DUSK.com example) | `shopify-liquid-vs-react/` | `npm run dev` in `react-island/` → `:5182` |
| Git + CI/CD | Sprint demo (Actions + GHCR) | `.github/workflows/` + `docs/sprint-demo.md` | Open PR → CI; merge main → CD image |
| Jenkins CI | Local controller + Declarative pipeline | `ci/jenkins/` + `docs/jenkins-walkthrough.md` | `docker compose up` → `:8085` · build `Jenkinsfile` |
| Agile / Scrum | PRs, features, smoke tests | `docs/agile-scrum-prs-smoke-tests.md` | Branch → PR → CI → smoke → demo |
| 2026 landscape | Frameworks, monoliths/microservices, AI, C#/C++ | `docs/2026-stack-landscape.md` | Pick stack by role; don’t boil the ocean |

Each folder has a README with the demo script.

Laravel / Vue CLI maps (commands + debugging): [docs/laravel-to-stack-commands.md](../docs/laravel-to-stack-commands.md).
