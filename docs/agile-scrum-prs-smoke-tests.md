# Agile Scrum → PRs, features & smoke tests

Practical map from **Scrum language** to how you actually ship (Git, pull requests, demos).  
Written for someone used to **Laravel delivery** joining teams that say “we’re Agile”.

Related in this repo: [sprint-demo.md](./sprint-demo.md) (GitHub Actions CI/CD) · [jenkins-walkthrough.md](./jenkins-walkthrough.md) (self-hosted Jenkins) · crash-course `EXERCISES.md` files (one exercise ≈ one ticket).

---

## Mental model (1 minute)

| Scrum word | What you do in Git / the IDE |
|------------|------------------------------|
| **Product backlog** | Prioritised list of problems (Jira / Linear / GitHub Issues) |
| **Sprint** | Fixed time box (often 1–2 weeks) of committed work |
| **User story / ticket** | One deliverable outcome + acceptance criteria |
| **Feature branch** | `feature/…` or `feat/…` from `main` |
| **PR (pull request)** | Ask for review + CI before merge |
| **Definition of Done** | “Merged + checks green + smoke OK” (team-specific) |
| **Sprint review / demo** | Show working software, not slides |
| **Retro** | What to improve next sprint |

You are **not** paid to “close tickets blindly”. Good teams give **problems**; you propose an approach, then ship in thin vertical slices (API + UI + test when needed).

---

## Ceremonies → your calendar

| Ceremony | When | Your job |
|----------|------|----------|
| **Refinement / backlog grooming** | Mid-sprint or pre-sprint | Ask questions; split big stories; clarify acceptance |
| **Sprint planning** | Start of sprint | Commit to what fits; flag risk |
| **Daily stand-up** | Daily (~15 min) | Yesterday / today / blockers — be concrete |
| **Review / demo** | End of sprint | Show the PR’d feature on a URL or local |
| **Retro** | End of sprint | One improvement you’ll actually try |

Stand-up anti-pattern: “I worked on stuff.”  
Better: “PR #42 search filter — waiting on review; unblocked after design clarified `cat:` prefix.”

---

## Features & user stories

### Shape of a good ticket

```text
Title: Product search by category and SKU

As a shopper/ops user
I want to filter the catalogue by text or category
So that I can find items without scrolling

Acceptance criteria:
- [ ] GET /api/products?q=rose returns matching name/SKU
- [ ] GET /api/products?category=plants returns plants only
- [ ] React search box uses the API (or client filter — say which)
- [ ] pytest/vitest covers the happy path
- [ ] Smoke: manual check on /Products or Shop tab
```

| | |
|--|--|
| **When** | Before you write code — or rewrite the ticket once you discover scope |
| **How** | If AC is vague, ask in the ticket comment before building a palace |
| **Use case** | Same discipline as a clear Laravel GitHub issue |

### Story points / estimates (light)

Teams use points (Fibonacci) or “S/M/L”. Treat as **relative effort + uncertainty**, not hours.  
If it’s a “2” that balloons, split or renegotiate — don’t silently absorb infinite scope.

### Epic vs story vs task

| Level | Example |
|-------|---------|
| **Epic** | “Loan lead SaaS intake” |
| **Story** | “POST /api/leads returns 202 and queues processing” |
| **Task** | “Add LeadPipeline worker thread” (optional sub-checklist) |

Ship **stories** end-to-end when you can. Avoid 10 tasks that only make a half-feature on `main`.

---

## Branching & PRs (the real delivery unit)

### Feature branch flow

```bash
git checkout main
git pull

git checkout -b feat/product-search
# … commit small, focused chunks …

git push -u origin HEAD
gh pr create --title "feat: product search by q and category" --body "$(cat <<'EOF'
## Summary
- Add ProductStore.search + API query params
- Wire Shop search box

## Test plan
- [ ] pytest / phpunit / vitest green in CI
- [ ] curl '/api/products?q=rose'
- [ ] Smoke: type rose in UI, list filters

EOF
)"
```

| Convention | Example | When |
|------------|---------|------|
| `feat/…` | `feat/product-search` | New behaviour |
| `fix/…` | `fix/cart-qty-zero` | Bug |
| `chore/…` | `chore/ci-node-22` | Tooling |
| `docs/…` | `docs/agile-guide` | Docs only |

### PR hygiene (Definition of Ready for review)

- [ ] One story / one concern (not “search + rewrite auth + rename everything”)
- [ ] Description: **why** + **how to test**
- [ ] CI green (or explained)
- [ ] Self-reviewed the diff
- [ ] Screenshots/GIF for UI
- [ ] No secrets in the diff

### Review & merge

| Role | Does |
|------|------|
| Author | Respond to comments; don’t take nitpicks personally |
| Reviewer | Ask “would I own this at 2am?” — design, tests, security |
| Merge | Squash or merge per team norm; delete branch after |

**When to request review early:** draft PR for direction.  
**When to wait:** unfinished spike with broken main path.

---

## Mapping crash-course exercises → tickets

Treat each exercise as a **sprint backlog item**:

| Lab | Example ticket |
|-----|----------------|
| React Ex 7 | “Cart drawer qty controls + empty state” |
| Python Ex 8 | “Lead queue routing rules + stats endpoint” |
| .NET Ex 6 | “Persist products with EF Core SQLite” |
| Node MVC | “Add product show page smoke path” |

Branch name = ticket: `feat/ex7-cart-drawer`.  
PR body = acceptance criteria copied from `EXERCISES.md`.

That’s how Agile feels day-to-day — not the sticky notes.

---

## Testing pyramid (where smoke fits)

```text
        /\
       /  \      E2E / UI (few, slow)
      /----\
     /      \    Integration / API (some)
    /--------\
   /          \  Unit (many, fast)
  --------------
```

| Layer | Laravel | Node / Python / .NET / React | When |
|-------|---------|------------------------------|------|
| Unit | Pest unit | pytest / xUnit / Vitest helpers | Pure rules, money, LINQ |
| Integration | Feature / HTTP tests | TestClient, Supertest, WebApplicationFactory | API contracts |
| **Smoke** | Manual or scripted “happy path” | See below | After deploy / before demo |
| E2E | Dusk / Playwright | Playwright / Cypress | Critical journeys only |

---

## Smoke tests

### What they are

**Smoke tests** = shallow, fast checks that the build isn’t on fire.  
Not full regression. “Can a user open the app and complete one primary path?”

Cousin: after `php artisan migrate` on staging, you click login + one CRUD — that’s a smoke.

### When to run smokes

| Moment | Why |
|--------|-----|
| After merge to `main` / deploy | Catch config/env breaks CI missed |
| Before a sprint demo | Don’t demo a blank screen |
| After dependency bumps | `npm ci` / `composer update` surprises |
| Hotfix validation | Fix didn’t collapse something else |

### Manual smoke checklist (template)

Copy into the PR **Test plan** or a staging runbook:

```markdown
## Smoke — GreenShelf / demo

### React (`npm run dev` :5179)
- [ ] App loads, no console errors
- [ ] Catalogue renders (after Ex 1–2)
- [ ] Add to cart → drawer opens → qty works

### Python API (:8200) + web (:5173)
- [ ] GET /api/health → ok
- [ ] GET /api/products → 200 list
- [ ] POST /api/leads → 202; /Leads or UI shows Routed within ~2s

### .NET (:5187)
- [ ] /Products lists items
- [ ] GET /api/products → JSON
- [ ] /DebugLab?sku=MOWER1 renders

### Node Express (:3090)
- [ ] / and /products return 200
- [ ] /contact form loads
```

### Automated smoke (lightweight)

```bash
# API up?
curl -sf http://127.0.0.1:8200/api/health | grep -q ok

# HTML shell up?
curl -sf -o /dev/null -w "%{http_code}" http://127.0.0.1:5179/ | grep -q 200
```

Wire into CD after deploy (GitHub Action step) — fail the release if health is down.

| | |
|--|--|
| **How** | 5–20 seconds; no brittle full UI suite |
| **Use case** | Gate “is staging alive?” before humans test deeper |
| **Debug** | Smoke fail → check logs, env, migrations, wrong port |

### Smoke vs regression

| Smoke | Full regression |
|-------|-----------------|
| Few paths | Many paths / edge cases |
| Minutes or seconds | Can be hours |
| “Does it boot + one journey?” | “Did we break anything?” |

Don’t replace unit/API tests with only smokes — smokes catch **wiring**, tests catch **logic**.

---

## Example: one story through Scrum

1. **Backlog:** “Filter products by `q` and `category`.”  
2. **Planning:** Fits sprint; AC agreed.  
3. **Branch:** `feat/product-search`.  
4. **Build:** Implement store + API + UI.  
5. **Unit/API tests:** pytest / vitest green locally.  
6. **PR:** Summary + test plan + smoke bullets.  
7. **CI:** runs tests (see [sprint-demo.md](./sprint-demo.md)).  
8. **Review:** Approve.  
9. **Merge** to `main`.  
10. **Smoke** on staging/demo URL.  
11. **Sprint review:** show search live.  
12. **Retro:** “PRs without smoke checklists slipped twice — add template.”

---

## AI-assisted work (still your ownership)

Teams (including the Python/React SE role) use AI for speed. Agile doesn’t change accountability:

- [ ] You understand every line you merge  
- [ ] Tests/smoke still required  
- [ ] Security review on AI output (auth, XSS, secrets)  
- [ ] PR description written by you — not “AI did a thing”

---

## Anti-patterns

| Anti-pattern | Do this instead |
|--------------|-----------------|
| God branch open 2 weeks | Split stories; merge thin slices |
| PR with 40 files “misc” | One concern per PR |
| “Works on my machine” only | CI + smoke on clean env |
| Ticket closed without demo path | AC includes how to verify |
| Skipping review on “tiny” fixes | Tiny fixes break prod too |
| Estimating in silence then missing | Surface risk mid-sprint |

---

## Quick glossary

| Term | Meaning |
|------|---------|
| **AC** | Acceptance criteria — done when these pass |
| **DoD** | Definition of Done — team bar for “finished” |
| **WIP** | Work in progress — limit it |
| **Spike** | Time-boxed research; outcome is learning, maybe a throwaway PR |
| **Blocker** | Something outside your control stopping the story — say it in stand-up |
| **Regression** | Old behaviour broke while adding new |
| **Smoke** | Fast “not on fire” check |

---

## Cheat sheet — commands you’ll use every story

```bash
# start story
git checkout main && git pull
git checkout -b feat/short-name

# while building (examples)
npm test / pytest -q / dotnet test / php artisan test

# open PR
git push -u origin HEAD
gh pr create

# after merge / before demo — smoke
curl -sf http://127.0.0.1:8200/api/health
curl -sf -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5179/
```

---

## Related docs in this repo

| Doc | Focus |
|-----|--------|
| [sprint-demo.md](./sprint-demo.md) | Live CI/CD sprint demo script |
| [laravel-to-stack-commands.md](./laravel-to-stack-commands.md) | Stack CLI maps |
| `demos/*/EXERCISES.md` | Practice backlog (ticket-sized) |
| `demos/*/COMMANDS.md` | React / Node / .NET / Python day-to-day CLI |
