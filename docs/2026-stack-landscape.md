# 2026 stack landscape — frameworks, monoliths, microservices & AI

Field guide for someone strong in **Laravel + Vue** surveying what teams ship with **now**, including **C# / .NET**, **C++**, and how **AI coding tools** fit without replacing engineering judgement.

Companion docs: [command sheets hub](./laravel-to-stack-commands.md) · [Agile / PRs / smoke](./agile-scrum-prs-smoke-tests.md) · demos under `demos/`.

---

## How to read this

| You care about… | Jump to |
|-----------------|--------|
| “What do jobs list in 2026?” | [Common stacks by role](#common-stacks-by-role-2026) |
| Laravel → closest cousins | [Web frameworks map](#web--api-frameworks-map) |
| One deployable vs many services | [Monoliths vs microservices](#monoliths-vs-microservices) |
| Cursor / Claude / Codex at work | [AI in the workflow](#ai-in-the-engineering-workflow) |
| Systems / games / perf | [C++](#c-where-it-still-wins) |
| Nottingham-style .NET roles | [C# / .NET](#c--net) |

You do **not** need every framework. You need: one **backend**, one **UI**, solid **Git/PR**, and the ability to learn the next repo fast — AI helps the last part.

---

## Common stacks by role (2026)

### Product / full-stack web (most SE job ads)

| Layer | Frequent choices | Notes |
|-------|------------------|--------|
| Backend | **Laravel**, **Django/FastAPI**, **ASP.NET Core**, **NestJS/Express**, **Rails**, **Spring Boot** | Laravel skills transfer; syntax changes |
| Frontend | **React**, **Vue**, **Svelte**, **Angular**, **Blazor** | React dominates job volume; Vue still huge in Laravel shops |
| Mobile | React Native, Flutter, native Swift/Kotlin | Often separate team |
| Data | **Postgres**, MySQL, **SQL Server** (Azure), Redis, occasional **MongoDB** | Relational still default |
| Cloud | **AWS**, **Azure**, GCP | Azure common with .NET shops |
| Commerce | **Shopify**, Magento, custom headless | Shopify “plus” on SE ads = liquid/app extensions + JS |

### Internal tools / B2B SaaS

Same as above, plus heavier **auth**, **queues**, **admin UIs**, **audit logs**, **webhooks** — like your lead-queue crash courses.

### Systems / performance / embedded / games

**C++**, Rust, sometimes C# (Unity) or Go — different hiring track than Laravel web.

---

## Web & API frameworks map

### From your Laravel brain

| If you know… | Closest 2026 cousin | Feel |
|--------------|---------------------|------|
| Laravel (PHP) | Symfony, AdonisJS (Node), Django (Python), **ASP.NET Core** (C#) | MVC, Eloquent ≈ ORM, artisan ≈ CLI |
| Blade / Inertia + Vue | Nuxt, Next.js, Remix, SvelteKit | Full-stack JS/TS |
| Vue SPA | Vue 3 + Vite (still current) | Composition API |
| Need React jobs | React 19 + Vite / Next.js | Hooks ≈ composables |
| API-first | FastAPI, ASP.NET Web API, NestJS, Express | OpenAPI / Swagger |

### Backend “big five” you’ll keep seeing

1. **JavaScript/TypeScript** — Node (Express, Nest, Fastify) + Next/Nuxt  
2. **Python** — FastAPI (APIs/AI glue), Django (batteries), Flask (legacy/simple)  
3. **C# / .NET** — ASP.NET Core MVC, Web API, Blazor, minimal APIs (.NET 10 / C# 14 era)  
4. **PHP** — Laravel (still very alive in agencies & ecommerce)  
5. **JVM** — Spring Boot (enterprise)

Also present: **Go** (APIs/infra), **Ruby on Rails**, **Elixir/Phoenix** (niches).

### Frontend “big three”

| Framework | When you see it |
|-----------|-----------------|
| **React** | Default in many SE ads; design systems; Shopify app UIs |
| **Vue** | Laravel shops, EU product teams, Nuxt |
| **Angular** | Larger enterprises, strict TypeScript |

**Blazor** appears on .NET job specs as training/upskill more often than as the only UI.

### Repo labs that match this map

| Stack | Folder |
|-------|--------|
| Laravel + Python script | `demos/laravel-python-club-savings` |
| React refresher | `demos/react-crash-course` |
| React + Shopify feel | `demos/react-shopify-cart-drawer` |
| Python + React SE path | `demos/python-react-crash-course` |
| ASP.NET MVC + API | `demos/dotnet-mvc-crash-course` |
| .NET + React SaaS | `demos/green-energy-saas` |
| Node Express MVC | `demos/node-mvc-demo` |
| **Node + React SaaS** | `demos/node-react-saas` (+ [DEVOPS.md](../demos/node-react-saas/DEVOPS.md)) |
| Nuxt | `demos/node-nuxt-product-quiz` |
| Aspire / multi-project .NET | `demos/dotnet-aspire-garden-club` |

---

## Monoliths vs microservices

### Monolith

**One deployable** (or one main app) owns HTTP, domain logic, DB access, jobs.

| | |
|--|--|
| **Examples** | Classic Laravel app, Rails, Django, modular ASP.NET Core solution shipped as one site |
| **When** | Most products until scale/org pain; startups; agencies; your crash courses |
| **Pros** | Simple debugging, one DB transaction, one PR can ship a vertical feature |
| **Cons** | Huge codebase risk; scaling one hot endpoint scales everything |

**Modular monolith** (2026 favourite compromise): one deploy, clear internal modules/boundaries — “microservice discipline without the network tax.”

### Microservices

**Many deployables** talking over HTTP/gRPC/queues. Each may own its DB.

| | |
|--|--|
| **When** | Multiple teams, independent release cadence, different scale profiles |
| **Pros** | Isolate failure/scale; polyglot possible |
| **Cons** | Distributed debugging, eventual consistency, ops cost, “distributed monolith” if done badly |

### Practical 2026 stance

```text
Start:          Modular monolith (Laravel / ASP.NET / FastAPI+workers)
Extract when:   Clear bounded context + team ownership + real scale need
Glue:           Events / queues / APIs (not shared DB tables across “services”)
```

Your **lead queue worker** (Python / .NET crash courses) is the *shape* of a microservice boundary — even while it still lives in-process. Later that worker becomes its own service + Azure Service Bus / RabbitMQ / SQS.

| Pattern | Laravel | .NET | Node | Python |
|---------|---------|------|------|--------|
| Monolith MVC | Laravel | ASP.NET MVC | Express+EJS | Django |
| Node Express MVC | Express+EJS | Nest + React |
| **API + SPA** | Sanctum + Vue/React | Web API + React/Blazor | Nest + React **or Plotline demo** | FastAPI + React |
| Async boundary | Queues + Horizon | `BackgroundService` / Functions | BullMQ | Celery / RQ / threads |
| Multi-project | Monorepo packages | **Aspire** / multiple csproj | Turborepo | monorepo services |

---

## AI in the engineering workflow

### What’s normal in 2026

Teams treat AI as a **power tool**, not an author of record:

| Tool style | Examples (names change often) | Use |
|------------|-------------------------------|-----|
| IDE agents | Cursor, Claude Code, Codex-class, OpenCode | Implement tickets, explain foreign codebases |
| Chat / design | ChatGPT/Claude/etc. | Specs, trade-offs, rubber-duck |
| CI assist | Autogen tests/docs (reviewed) | Draft only |
| Product AI | Features that call LLM APIs | Separate from “coding with AI” |

Job ads now say: *comfortable using AI; review and validate before production.*

### What still makes you employable

1. **Break down problems** (Agile story → AC → PR)  
2. **Read diffs** — especially AI diffs  
3. **Tests + smoke** after generation  
4. **Security** — authZ, XSS, injection, secrets  
5. **Own production** — logs, rollback, say “this is wrong”

### Sensible AI loop

```text
Ticket → ask AI for approach options → you choose
     → AI drafts → you run tests / smoke
     → you fix / simplify → PR with human summary
```

Anti-patterns: paste secrets into prompts; merge AI code unread; skip tests “because the agent said it’s fine.”

Crash-course practice: Python/React **Ex 10** and React **Ex 10** (deliberately bad AI fixtures).

---

## C# / .NET

### Where it sits in 2026

| Area | Tech |
|------|------|
| Web | **ASP.NET Core** (MVC, Razor Pages, **Web API**, minimal APIs) |
| UI options | React/Vue SPAs, **Blazor**, desktop (MAUI/WPF — niche) |
| Language | **C# 14** era on **.NET 10** |
| Data | EF Core, **Azure SQL** / SQL Server, Dapper |
| Cloud | **Azure** (App Service, Functions, Service Bus, Aspire) |
| Style | Strong typing, DI-first, excellent tooling (Rider/VS) |

### Laravel → C# cheat

| Laravel | C# / ASP.NET |
|---------|----------------|
| `artisan serve` | `dotnet run` |
| Eloquent | EF Core |
| FormRequest | DataAnnotations / FluentValidation |
| Service container | `builder.Services` |
| Queues | Hosted services / Azure queues |
| Blade | Razor |

**When to learn it:** Azure/.NET job specs (e.g. Nottingham-style ads), finance/enterprise UK shops, mixed stacks with React.

**Lab:** `demos/dotnet-mvc-crash-course` + [COMMANDS](../demos/dotnet-mvc-crash-course/COMMANDS.md).

---

## C++ — where it still wins

Not a Laravel replacement. Different career/problem class.

| Domain | Why C++ |
|--------|---------|
| Games (engines), real-time | Performance, control |
| Embedded / IoT / robotics | Close to hardware |
| High-frequency trading / low-latency | Determinism |
| Browsers, databases, OS layers | Existing codebases |
| Native modules | Node/Python addons via N-API / pybind |

### 2026 C++ flavour

| Piece | Common |
|-------|--------|
| Standard | C++17/20/23 in industry (C++20 increasingly baseline) |
| Build | **CMake**, sometimes Bazel |
| Package | **vcpkg**, Conan |
| IDE | VS, CLion, VS Code + clangd |
| Test | GoogleTest, Catch2 |
| Safety trend | More teams evaluate **Rust** for new greenfield systems; C++ remains for existing & perf-critical |

### Tiny “hello” shape (awareness)

```bash
# macOS / Linux sketch — not a full course
brew install cmake   # or apt
# CMakeLists.txt + main.cpp → cmake -B build && cmake --build build
```

| | |
|--|--|
| **When you need it** | Job explicitly lists C++; native extension; game/engine path |
| **When you don’t** | Typical Shopify/Laravel/React product SE roles |
| **AI help** | Excellent for explaining templates/build errors — still verify UB/lifetime issues carefully |

### C++ vs C# vs Node vs Python (one glance)

| | C++ | C# | Node | Python | PHP/Laravel |
|--|-----|----|------|--------|-------------|
| Web apps | Rare | Strong | Strong | Strong | Strong |
| Memory control | Manual/RAII | GC | GC | GC | GC |
| Job volume (web SE) | Low | High (enterprise) | High | High | High (agencies) |
| AI codegen | Good | Excellent | Excellent | Excellent | Excellent |
| Typical cloud | Custom | Azure | AWS/Azure | AWS/GCP | Any |

---

## Polyglot reality (most companies)

A “2026 codebase” is often:

```text
[ React or Vue SPA ]
        │
        ▼
[ API: Laravel  or  .NET  or  FastAPI  or  Nest ]
        │
        ├── Postgres / Azure SQL
        ├── Redis queue
        └── Worker / Functions
```

Plus: Terraform/Bicep, GitHub Actions, Datadog/App Insights, Feature flags.

**Monorepo** (Turborepo, Nx, big Git repo) vs **polyrepo** — process preference, not morality.

---

## What to practise (given your path)

| Priority | Why |
|----------|-----|
| 1. React refresher + PR/smoke habits | Appears on almost every SE ad |
| 2. Python FastAPI **or** ASP.NET Web API | Match the job family you’re applying to |
| 3. Monolith module boundaries + one async worker | Microservice *thinking* without over-engineering |
| 4. AI review drills | Explicit in modern ads |
| 5. C# if targeting Azure/.NET | Your .NET crash course |
| 6. C++ only if roles ask | Separate track |

---

## Glossary (2026 interviews)

| Term | One-liner |
|------|-----------|
| **SPA** | Single-page app (React/Vue) talking to an API |
| **SSR / RSC** | Server-rendered HTML / React Server Components (Next, etc.) |
| **Headless commerce** | Shopify/etc. as backend; your front end |
| **CQRS / events** | Split read/write; services react to messages |
| **Observability** | Logs + metrics + traces |
| **IaC** | Infra as code (Terraform, Bicep, Pulumi) |
| **Aspire** | .NET multi-service local orchestration |
| **Edge** | CDN/workers close to users |

---

## Related sheets

| Doc | Contents |
|-----|----------|
| [React COMMANDS](../demos/react-crash-course/COMMANDS.md) | npm / Vite / debug |
| [Node COMMANDS](../demos/node-mvc-demo/COMMANDS.md) | Express / npm / inspect |
| [.NET COMMANDS](../demos/dotnet-mvc-crash-course/COMMANDS.md) | `dotnet` / EF / F5 |
| [Python COMMANDS](../demos/python-react-crash-course/COMMANDS.md) | venv / uvicorn / pytest |
| [Agile / PRs / smoke](./agile-scrum-prs-smoke-tests.md) | How work ships |
