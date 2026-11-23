# Master walkthrough — Laravel/Vue → React, Node, Python, .NET + DevOps

**One checklist to follow tomorrow.** Tick boxes in the **Progress board** below (`[ ]` → `[x]`).  
Scroll down for how-to / commands; full acceptance criteria live in each demo’s `EXERCISES.md`.

Suggested pace: **2–3 focused days** (or one intense weekend). Skip parts that don’t match the job (e.g. skip .NET if you’re only chasing Python+React).

---

## Progress board

> **How:** open this file in the editor, change `[ ]` to `[x]` when done. Jump links go to the how-to section.

### Part 0 — Orient (~1 h) → [details](#part-0--orient-4560-min)

- [x] **0.1** Skim [2026-stack-landscape.md](./2026-stack-landscape.md)
- [x] **0.2** Skim [agile-scrum-prs-smoke-tests.md](./agile-scrum-prs-smoke-tests.md)
- [x] **0.2b** Skim [OOP-patterns-cross-stack.md](./OOP-patterns-cross-stack.md) *
- [x] **0.2c** Skim [LLM-quick-runthrough.md](./LLM-quick-runthrough.md)
- [x] **0.2d** Skim [csharp-language-basics.md](./csharp-language-basics.md) *(if .NET roles)* *
- [x] **0.2e** Skim [basics-react-dotnet-asp-wpf-python.md](./basics-react-dotnet-asp-wpf-python.md)
- [ ] **0.3** Bookmark React / Node / Python / .NET COMMANDS sheets *
- [ ] **0.4** Create branch `learn/stack-walkthrough` *

### Part 1 — React refresher (3–4 h) → [details](#part-1--react-refresher-34-h)

- [x] **1.0** Boot — app at `:5179` (Shop / Debug / AI)
- [x] **1.1** ProductCard — props, stock badge, Add disabled when OOS
- [x] **1.2** ProductGrid — `.map` + `key={id}`
- [x] **1.3** SearchBar clear button (+ optional Escape)
- [x] **1.4** Filter: `cat:plants` vs name/SKU search
- [x] **1.5** Explain `useEffect` cleanup (`cancelled`) + retry on error
- [x] **1.6** `useLocalStorage` + `useDebouncedValue` hooks
- [x] **1.7** Cart drawer — empty, ± qty, disable checkout, Escape closes
- [x] **1.8** Debug session — fix `margin()` → £75.62; `npm test`
- [x] **1.9** Accessible LeadForm (controlled + validation + aria)
- [x] **1.10** Review AiMessyLeadForm; Testing Library test; `npm test` green
- [x] **1.S** Smoke — add → drawer → qty → refresh keeps cart → empty

### Part 2 — Node + SaaS + DevOps (2–3 h) → [details](#part-2--node-foundations--saas-23-h)

- [x] **2.1** Node MVC — open `/`, `/products`, `/products/:id`, `/contact`
- [x] **2.2** Trace request: routes → controller → model → views
- [x] **2.3** Breakpoint in a controller (`--inspect`)
- [x] **2.4** Plotline UI — dashboard, clubs, alerts (`:5180`)
- [x] **2.5** Pause Coastal Plots; Trial → **409**
- [x] **2.6** Toggle chart; skim `server.js` + `App.jsx`
- [x] **2.7** `./scripts/smoke.sh http://127.0.0.1:5210`

- [ ] **2.8** Docker all-in-one + smoke *
- [ ] **2.9** Docker Compose split
- [ ] **2.10** DevOps bonuses — pick ≥3:
  - [ ] D1 CI workflow
  - [ ] D2 Docker layer cache
  - [ ] D3 staging / health env
  - [ ] D4 rollback drill
  - [ ] D5 pause logging / metrics
  - [ ] D6 `infra/NOTES.md`

### Part 3 — Python + React SE (4–6 h) → [details](#part-3--python--react-se-path-46-h)

- [x] **3.0** Boot — UI + `/api/health` + Swagger `/docs`
- [x] **3.1** `ProductStore.search` (category + q)
- [x] **3.2** `ProductStore.update` + PUT API
- [x] **3.3** Extend pytest — `pytest -q`
- [x] **3.4** `ProductStore.delete` + 409 when stock > 0
- [x] **3.5** Debug #1 — margin → 75.62
- [x] **3.6** React polish — loading, double-submit, lead polling
- [x] **3.7** `python_lab.py` → self-check `{ok:true}`
- [x] **3.8** Lead SaaS — ≥3 of 8a–8e
- [x] **3.9** Git/PR habit (+ optional CI)
- [x] **3.10** AI fixture → clean discount + debug #2 + NOTES
- [x] **3.S** Smoke + pytest green

### Part 4 — .NET / ASP.NET (4–6 h) → [details](#part-4--net--aspnet-path-46-h)

- [x] **4.0** Boot — Home, Products, Leads, Debug lab (`:5187`)
- [x] **4.1** MVC filter + LINQ `Search`
- [x] **4.2** Edit product (GET/POST + view)
- [x] **4.3** API `GET /api/products/{id}`
- [x] **4.4** DELETE + `ProductRules`
- [x] **4.5** Debug #1 — margin £75.62
- [x] **4.6** EF Core + SQLite persist
- [x] **4.7** `LinqLab` self-check
- [x] **4.8** Lead SaaS — ≥3 of 8a–8e
- [x] **4.9** Front end Path A Spa **or** React/Blazor
- [x] **4.10** Debug #2 + audit store + SOLID tidy
- [x] **4.S** Smoke OK

### Part 5 — Delivery habits (~1 h) → [details](#part-5--delivery-habits-6090-min)

- [ ] **5.1** Write one PR description (Summary + Test plan + Smoke)
- [ ] **5.2** Cross-stack smoke of what you finished today
- [ ] **5.3** 10-min verbal drill (Laravel map, ship flow, AI, monolith)
- [ ] **5.4** Skim [sprint-demo.md](./sprint-demo.md) *(optional)*
- [ ] **5.5** Skim [jenkins-walkthrough.md](./jenkins-walkthrough.md) *(optional — or do Optional Jenkins J1–J6)*

### Optional — Shopify

- [ ] Skim [shopify-liquid-vs-react.md](./shopify-liquid-vs-react.md) (DUSK = Liquid, SKIMS = Hydrogen)
- [ ] Run `demos/shopify-liquid-vs-react/react-island` → `:5182`

### Optional — NuGet package (~30–45 min) → [details](#optional--nuget-package-3045-min)

- [ ] **N1** Pack `GreenShelf.Pricing` → `demos/dotnet-nuget-demo/nupkg`
- [ ] **N2** Run consumer via `PackageReference` (not ProjectReference)
- [ ] **N3** `dotnet test` green on pricing tests
- [ ] **N4** Explain NuGet ↔ Composer + private feed in one breath

### Optional — .NET swing apps (~45–120 min)

- [ ] **S1** SignalR auction — SOLID board + soft-close + lot closer (`:5191`) · [README](../demos/dotnet-signalr-plant-auction/README.md) · [ARCHITECTURE](../demos/dotnet-signalr-plant-auction/ARCHITECTURE.md)
- [ ] **S2** Minimal order desk — catalog stock + status machine (`:5192`) · [README](../demos/dotnet-minimal-order-desk/README.md) · [ARCHITECTURE](../demos/dotnet-minimal-order-desk/ARCHITECTURE.md)
- [ ] **S3** React + ASP.NET click & collect — SPA + Minimal API (`:5194` / `:5193`) · [README](../demos/dotnet-react-click-collect/README.md) · [ARCHITECTURE](../demos/dotnet-react-click-collect/ARCHITECTURE.md)
- [ ] **S4** ML.NET plant demand — train + predict (`:5195`) · [README](../demos/dotnet-mlnet-plant-demand/README.md)
- [ ] **S5** Azure AI garden tips — stub + optional Azure OpenAI (`:5196`) · [README](../demos/dotnet-azure-ai-garden-tips/README.md)
- [ ] **S6** MongoDB lead audit — `AuditStore:Driver=mongo` · [MONGO.md](../demos/dotnet-mvc-crash-course/MONGO.md)
- [ ] **G1** Go GreenShelf desk — interfaces + goroutine audit (`:5201`) · [README](../demos/golang-greenshelf-desk/README.md) · [ARCHITECTURE](../demos/golang-greenshelf-desk/ARCHITECTURE.md)

### Optional — Jenkins CI (~60–90 min) → [details](#optional--jenkins-ci-6090-min)

- [ ] **J1** Boot Jenkins UI (`:8085`) — [jenkins-walkthrough.md](./jenkins-walkthrough.md)
- [ ] **J2** Pipeline job from `ci/jenkins/Jenkinsfile`
- [ ] **J3** Narrate Checkout → Composer → PHPUnit → Docker
- [ ] **J4** Bind a credential (masked in log)
- [ ] **J5** Force a red build, then fix
- [ ] **J6** Explain Jenkins ↔ GitHub Actions in one breath

---

## How to use this

1. Tick the **Progress board** at the top as you go.
2. For each step: **run → read → implement → smoke → optional tiny PR**.
3. Treat every exercise as an Agile ticket ([agile guide](./agile-scrum-prs-smoke-tests.md)).
4. Use AI for speed, but **you** run tests and review diffs ([landscape / AI](./2026-stack-landscape.md)).

### Repo root

```bash
cd /Users/tom/Herd/yg-cart-drawer-demo   # or your clone path
```

### Progress legend

- `[ ]` not started · `[x]` done  
- **Time** = rough guide  
- **Detail** = full instructions live in the section / `EXERCISES.md`

---

## Part 0 — Orient (45–60 min)

Goal: know *where* things live before coding. Tick **0.1–0.4** in the Progress board.

Skim: [landscape](./2026-stack-landscape.md) · [agile](./agile-scrum-prs-smoke-tests.md) · [OOP](./OOP-patterns-cross-stack.md) · [LLMs](./LLM-quick-runthrough.md) · [C#](./csharp-language-basics.md) · [basics](./basics-react-dotnet-asp-wpf-python.md)

Command sheets: [React](../demos/react-crash-course/COMMANDS.md) · [Node](../demos/node-mvc-demo/COMMANDS.md) · [Python](../demos/python-react-crash-course/COMMANDS.md) · [.NET](../demos/dotnet-mvc-crash-course/COMMANDS.md)

```bash
git checkout main
git pull
git checkout -b learn/stack-walkthrough
```

**Done when:** you can say out loud which demo folder matches which job ad.

---

## Part 1 — React refresher (3–4 h)

**Folder:** `demos/react-crash-course` · **Detail:** [EXERCISES.md](../demos/react-crash-course/EXERCISES.md) · **Port:** `:5179`  
Tick **1.0–1.S** in the Progress board.

```bash
cd demos/react-crash-course
npm install
npm run dev
```

Tasks in order: ProductCard → ProductGrid → SearchBar → filters → `useEffect` cleanup → hooks → cart drawer → debug margin → LeadForm → AiMessyLeadForm + tests.

**Smoke:** add in-stock → drawer → qty → refresh keeps cart (after 1.6) → remove to empty.

**Optional PR:** `feat/react-crash-ex1-7` with test plan checklist.

---

## Part 2 — Node foundations + SaaS (2–3 h)

Tick **2.1–2.10** in the Progress board.

### 2A — Express MVC (30–45 min)

**Folder:** `demos/node-mvc-demo` · **Port:** `:3090` · **Commands:** [COMMANDS.md](../demos/node-mvc-demo/COMMANDS.md)

```bash
cd demos/node-mvc-demo
npm install
npm run dev
```

Open `/`, `/products`, `/products/:id`, `/contact`. Trace routes → controller → model → views. Breakpoint with `--inspect`.

### 2B — Plotline Node + React SaaS (60–90 min)

**Folder:** `demos/node-react-saas` · API `:5210` · Web `:5180` · [README](../demos/node-react-saas/README.md)

```bash
# terminal 1
cd demos/node-react-saas/api && npm install && npm run dev

# terminal 2
cd demos/node-react-saas/web && npm install && npm run dev
```

Dashboard → pause Coastal Plots / Trial 409 → chart toggle → `./scripts/smoke.sh http://127.0.0.1:5210`

### 2C — DevOps bonus (90–120 min) — pick ≥3

**Detail:** [DEVOPS.md](../demos/node-react-saas/DEVOPS.md)

```bash
cd demos/node-react-saas
docker build -t plotline .
docker run --rm -p 5210:5210 plotline
./scripts/smoke.sh http://127.0.0.1:5210
# UI at http://127.0.0.1:5210
```

Compose: `docker compose up --build`. Bonuses D1–D6 listed in Progress board.

**Done when:** you can demo Plotline locally **and** via Docker, plus narrate smoke + rollback.

---

## Part 3 — Python + React SE path (4–6 h)

**Folder:** `demos/python-react-crash-course` · **Detail:** [EXERCISES.md](../demos/python-react-crash-course/EXERCISES.md)  
**API:** `:8200` · **Web:** `:5173` · **Commands:** [COMMANDS.md](../demos/python-react-crash-course/COMMANDS.md)  
Tick **3.0–3.S** in the Progress board.

```bash
cd demos/python-react-crash-course/api
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8200
# docs: http://127.0.0.1:8200/docs

cd ../web
npm install
npm run dev
```

Tasks: search → update → pytest → delete 409 → debug margin → React polish → python_lab → lead SaaS (≥3) → PR habit → AI fixture / debug #2.

**Smoke**

```bash
curl -s http://127.0.0.1:8200/api/health
curl -s -X POST http://127.0.0.1:8200/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"applicant_name":"Sam Lee","email":"sam@example.com","loan_amount":7500,"product_type":"personal"}'
# refresh UI — status → routed
.venv/bin/pytest -q
```

**Done when:** you can explain FastAPI ≈ `api.php`, Pydantic ≈ FormRequest, worker ≈ `queue:work`.

---

## Part 4 — .NET / ASP.NET path (4–6 h)

**Folder:** `demos/dotnet-mvc-crash-course` · **Detail:** [EXERCISES.md](../demos/dotnet-mvc-crash-course/EXERCISES.md)  
**Port:** `:5187` · **Commands:** [COMMANDS.md](../demos/dotnet-mvc-crash-course/COMMANDS.md)  
Tick **4.0–4.S** in the Progress board.

```bash
cd demos/dotnet-mvc-crash-course
dotnet restore
dotnet run --launch-profile http
```

Tasks: LINQ search → edit → API get-by-id → DELETE/rules → debug margin → EF Core → LinqLab → lead SaaS → Spa/React → debug #2.

**Smoke**

```bash
curl -s http://localhost:5187/api/products
curl -s -X POST http://localhost:5187/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"applicantName":"Sam Lee","email":"sam@example.com","loanAmount":7500,"productType":"personal"}'
# open /Leads — Routed within ~1s
```

**Optional next:** `demos/dotnet-aspire-garden-club` or `demos/green-energy-saas` (.NET API + React).

**Done when:** you can map `Program.cs` ↔ Laravel providers/routes, and debug with the Call Stack confidently.

---

## Optional — NuGet package (30–45 min)

**Folder:** `demos/dotnet-nuget-demo` · **Detail:** [README](../demos/dotnet-nuget-demo/README.md)  
Tick **N1–N4** in the Progress board.

Composer cousin: author a library → pack → consume via lockfile / constraint.

```bash
cd demos/dotnet-nuget-demo
./scripts/pack-and-run.sh
```

Flow: `dotnet pack` → `.nupkg` in `./nupkg` → consumer `PackageReference` restores from local `nuget.config` feed → prints margin **£75.62** + club quote.

**Done when:** you can map `PackageReference` ↔ `composer require`, and say when you’d use Azure Artifacts vs nuget.org.

---

## Optional — .NET swing apps (45–120 min)

Small apps so you feel **different ASP.NET / .NET shapes** after the MVC crash course.

| App | Port | Swing |
|-----|------|--------|
| [SignalR plant auction](../demos/dotnet-signalr-plant-auction/README.md) | `:5191` | Real-time push (WebSockets) |
| [Minimal order desk](../demos/dotnet-minimal-order-desk/README.md) | `:5192` | HTTP JSON only — no controllers |
| [React click & collect](../demos/dotnet-react-click-collect/README.md) | API `:5193` · Web `:5194` | SPA front + .NET API |
| [ML.NET plant demand](../demos/dotnet-mlnet-plant-demand/README.md) | `:5195` | In-process ML train + score |
| [Azure AI garden tips](../demos/dotnet-azure-ai-garden-tips/README.md) | `:5196` | Azure OpenAI shape + stub |
| [Mongo lead audit](../demos/dotnet-mvc-crash-course/MONGO.md) | with `:5187` | Real Mongo behind `ILeadAuditStore` |

```bash
cd demos/dotnet-signalr-plant-auction && dotnet run   # two browser tabs
cd demos/dotnet-minimal-order-desk && dotnet run      # curl + API key

# S3 — two terminals
cd demos/dotnet-react-click-collect/api && dotnet run --launch-profile http
cd demos/dotnet-react-click-collect/web && npm install && npm run dev

cd demos/dotnet-mlnet-plant-demand && dotnet run      # :5195
cd demos/dotnet-azure-ai-garden-tips && dotnet run    # :5196
# S6: docker compose -f demos/dotnet-mvc-crash-course/docker-compose.mongo.yml up -d
```

**Done when:** you can say when you’d pick SignalR vs Minimal APIs vs MVC vs React+API vs ML.NET vs Azure AI vs Mongo.

---

## Optional — Go desk (~30–45 min)

**Folder:** `demos/golang-greenshelf-desk` · **Port:** `:5201`  
Tick **G1** in the Progress board.

```bash
brew install go   # once
cd demos/golang-greenshelf-desk
go run ./cmd/server
go test ./...
```

**Done when:** you can map Go interfaces ↔ C# contracts, and `chan`+goroutine ↔ Laravel `queue:work`.

---

## Optional — Jenkins CI (60–90 min)

**Detail:** [jenkins-walkthrough.md](./jenkins-walkthrough.md) · **Artifacts:** [`ci/jenkins/`](../ci/jenkins/)  
Tick **J1–J6** in the Progress board.

Enterprise / on-prem cousin of [sprint-demo.md](./sprint-demo.md) (GitHub Actions).

```bash
cd ci/jenkins
docker compose up -d
# http://127.0.0.1:8085
docker compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

1. Install suggested plugins → create admin  
2. New Item → Pipeline from SCM → Script Path `ci/jenkins/Jenkinsfile`  
3. **Build Now** — watch PHPUnit (+ optional Docker / Python / .NET params)  
4. Do the credentials + red-build drills in the doc  

**Done when:** you can explain controller vs agent, Declarative stages, and when you’d pick Jenkins over Actions.

---

## Part 5 — Delivery habits (60–90 min)

Do this once you’ve completed at least **Part 1 + (3 or 4)**. Tick **5.1–5.5** in the Progress board.

1. PR description from the Agile doc template  
2. Cross-stack smoke of today’s work  
3. Verbal drill: Laravel map · ship flow · AI · monolith vs extract  
4. Optional: [sprint-demo.md](./sprint-demo.md) (GitHub Actions)  
5. Optional: [jenkins-walkthrough.md](./jenkins-walkthrough.md) (or full **J1–J6**)

---

## Job-shaped shortcuts

| If the role is… | Prioritise |
|-----------------|------------|
| **Python + React SE** | Parts **0 → 1 → 2 → 3 → 5** (skip or skim 4) |
| **.NET / Azure** | Parts **0 → 1 (light) → 4 → 2C DevOps → 5** (+ Jenkins optional) |
| **Enterprise CI / on-prem** | [jenkins-walkthrough.md](./jenkins-walkthrough.md) + [sprint-demo.md](./sprint-demo.md) |
| **Node / full-stack JS** | Parts **0 → 1 → 2 (all) → 5** |
| **Generalist / unsure** | **0 → 1 → 2 → 3** then add 4 if time |

---

## Single “day plan” example

### Tomorrow — Day 1 (React + Node SaaS)

Morning: Part 0 + Part 1 (through 1.7)  
Afternoon: Part 1.8–1.10 + Part 2A–2B + Docker 2.8  
Evening: Part 5.3 verbal drill (React + Plotline only)

### Day 2 — Python SE **or** .NET

Full Part 3 **or** full Part 4 (+ leftover DevOps D-tasks).

### Day 3 — Polish

Finish remaining exercises, open 1–2 tidy PRs, Part 5.1–5.4.

---

## Quick command cheat (copy-paste)

```bash
# React
cd demos/react-crash-course && npm run dev          # :5179

# Node MVC
cd demos/node-mvc-demo && npm run dev               # :3090

# Plotline
cd demos/node-react-saas/api && npm run dev         # :5210
cd demos/node-react-saas/web && npm run dev         # :5180

# Python
cd demos/python-react-crash-course/api
.venv/bin/uvicorn app.main:app --reload --port 8200
cd ../web && npm run dev                            # :5173

# .NET
cd demos/dotnet-mvc-crash-course
dotnet run --launch-profile http                    # :5187

# .NET swing — SignalR / Minimal APIs
cd demos/dotnet-signalr-plant-auction && dotnet run # :5191
cd demos/dotnet-minimal-order-desk && dotnet run    # :5192
# S3: api :5193 + web :5194 — demos/dotnet-react-click-collect
```

---

## Index of detail docs

| Topic | Path |
|-------|------|
| This walkthrough | `docs/WALKTHROUGH.md` |
| OOP patterns (all stacks) | `docs/OOP-patterns-cross-stack.md` |
| LLMs quick run-through | `docs/LLM-quick-runthrough.md` |
| C# language basics | `docs/csharp-language-basics.md` |
| React / .NET / ASP / WPF / Python basics | `docs/basics-react-dotnet-asp-wpf-python.md` |
| Agile / PRs / smoke | `docs/agile-scrum-prs-smoke-tests.md` |
| 2026 landscape | `docs/2026-stack-landscape.md` |
| Commands hub | `docs/laravel-to-stack-commands.md` |
| React exercises | `demos/react-crash-course/EXERCISES.md` |
| Python exercises | `demos/python-react-crash-course/EXERCISES.md` |
| .NET exercises | `demos/dotnet-mvc-crash-course/EXERCISES.md` |
| SignalR / Minimal / React+API / ML.NET / Azure AI / Mongo / Go | .NET swings + `demos/golang-greenshelf-desk` |
| NuGet pack/consume demo | `demos/dotnet-nuget-demo/README.md` |
| Plotline DevOps | `demos/node-react-saas/DEVOPS.md` |
| Jenkins CI walkthrough | `docs/jenkins-walkthrough.md` · `ci/jenkins/` |
| Demo pack list | `demos/README.md` |

Good luck tomorrow — start at **Part 0**, don’t skip the smoke ticks.
