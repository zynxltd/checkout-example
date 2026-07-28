# Sample sprint demo — Git + CI/CD

15–20 minute walkthrough using **yg-cart-drawer-demo**.

## Sprint story (demo script)

> **As a** stakeholder  
> **I want** the cart drawer preview to run in CI/CD  
> **So that** every PR is tested and `main` ships a runnable Docker image.

| Ceremony | What you show |
|----------|----------------|
| Backlog item | This story + acceptance: PHPUnit green + Docker builds |
| Branch | `feature/sprint-demo-ci` from `main` |
| Commit | Workflow files + this doc |
| PR | Open PR → GitHub Actions **CI** runs |
| Review | Green checks required before merge |
| CD | Merge to `main` → **CD** pushes image to GHCR |
| Demo | Pull/run image or point at http://localhost:8080 (Colima) |

---

## Acceptance criteria

- [ ] `php artisan test` passes in CI
- [ ] `docker build` succeeds in CI
- [ ] Push to `main` publishes `ghcr.io/<owner>/<repo>:latest`
- [ ] Local Colima preview still works: `docker compose up -d` → :8080

---

## Commands (live demo)

```bash
# 0. Start from a clean main
git checkout main
git pull

# 1. Sprint branch
git checkout -b feature/sprint-demo-ci

# 2. Stage CI/CD assets (if not already committed)
git add .github/workflows/ci.yml .github/workflows/cd-preview.yml docs/sprint-demo.md
git commit -m "$(cat <<'EOF'
Add CI/CD for sprint demo: PHPUnit + Docker build, GHCR publish on main.

EOF
)"

# 3. Push + PR
git push -u origin HEAD
gh pr create --title "Sprint demo: CI/CD for cart drawer" --body "$(cat <<'EOF'
## Summary
- GitHub Actions CI: PHPUnit + Docker build on PRs
- CD: publish image to GHCR on main

## Test plan
- [ ] CI green on this PR
- [ ] After merge, GHCR has `:latest`

EOF
)"

# 4. Watch CI
gh pr checks --watch

# 5. Merge when green
gh pr merge --squash --delete-branch
```

---

## What CI/CD does

```
PR / push ──► CI workflow
               ├─ PHPUnit (PHP 8.4)
               └─ docker build

main push ──► CD workflow
               └─ push ghcr.io/.../checkout-example:latest
```

Workflows live in:

- `.github/workflows/ci.yml`
- `.github/workflows/cd-preview.yml`

---

## Local + container (already set up)

```bash
colima status
docker compose up -d
open http://localhost:8080
```

---

## Rollback talking point

```bash
git revert <merge-sha>
git push
# CD rebuilds previous-good image on next main green
```
