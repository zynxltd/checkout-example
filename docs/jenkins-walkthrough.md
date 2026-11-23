# Jenkins walkthrough — CI for this monorepo

Hands-on path if a job mentions **Jenkins** (common in .NET / enterprise / on-prem shops).  
Mental model: **Jenkins ≈ self-hosted GitHub Actions** — you own the controller, agents, plugins, and credentials.

| You already know | Jenkins term |
|------------------|--------------|
| GitHub Actions workflow | **Pipeline** (`Jenkinsfile`) |
| `runs-on: ubuntu-latest` | **Agent** / node label |
| Job / step | **Stage** / **step** |
| Secrets in repo settings | **Credentials** (or Vault) |
| `actions/checkout` | `checkout scm` |
| Matrix / path filters | `when { changeset … }` / parallel stages |
| Forge / Envoyer hooks | Freestyle or Pipeline job triggered by webhook |

Related: [sprint-demo.md](./sprint-demo.md) (GitHub Actions) · [DEVOPS.md](../demos/node-react-saas/DEVOPS.md) · [agile guide](./agile-scrum-prs-smoke-tests.md).

---

## Goals (~60–90 min)

1. Run Jenkins locally (Docker).
2. Create a **Multibranch Pipeline** (or Pipeline from SCM) pointed at this repo.
3. Watch a Declarative `Jenkinsfile` run **PHPUnit** (+ optional Docker / Python / .NET stages).
4. Explain blue ocean vs classic UI, agents, and credentials in interview language.

**Artifacts in repo**

| Path | Purpose |
|------|---------|
| [`ci/jenkins/Jenkinsfile`](../ci/jenkins/Jenkinsfile) | Declarative pipeline (copy or symlink as root `Jenkinsfile`) |
| [`ci/jenkins/docker-compose.yml`](../ci/jenkins/docker-compose.yml) | Local Jenkins LTS + Docker socket (for `docker build` stages) |
| [`ci/jenkins/README.md`](../ci/jenkins/README.md) | Short ops cheat sheet |

---

## Part J0 — Concepts (10 min)

```
Git push / PR
    → Jenkins controller (scheduler + UI)
        → Agent (where shell runs)
            → checkout → install → test → (optional) docker build / deploy
```

**Declarative vs Scripted**

- **Declarative** (`pipeline { … }`) — preferred; readable stages, `when`, `post`.
- **Scripted** (`node { … }`) — Groovy power; use sparingly.

**Why enterprises still use Jenkins**

- Runs inside VPC / air-gapped networks  
- Same pipelines for GitHub, GitLab, Bitbucket, Azure DevOps Git  
- Heavy Windows / .NET agents next to Linux ones  
- Long-lived credentials and shared libraries across many repos  

---

## Part J1 — Boot Jenkins locally (15 min)

```bash
cd ci/jenkins
docker compose up -d
# UI: http://127.0.0.1:8085
```

Unlock password (first boot):

```bash
docker compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

1. Paste password → **Install suggested plugins**.
2. Create admin user.
3. Confirm plugins include: **Pipeline**, **Git**, **Docker Pipeline** (optional), **Multibranch**.

**Done when:** you can open the Jenkins dashboard and create a new item.

---

## Part J2 — Wire this repo as a Pipeline (20 min)

### Option A — Pipeline from SCM (fastest for learning)

1. **New Item** → Pipeline → name `yg-cart-drawer`.
2. Pipeline definition: **Pipeline script from SCM**.
3. SCM: Git  
   - URL: your clone path *or* `https://github.com/<you>/yg-cart-drawer-demo.git`  
   - For local bare path mounts, see [README](../ci/jenkins/README.md) “bind-mount the repo”.
4. Script Path: `ci/jenkins/Jenkinsfile`
5. Save → **Build Now**.

### Option B — Multibranch (closer to real teams)

1. **New Item** → Multibranch Pipeline.
2. Branch Sources → Git → same repo URL.
3. Build Configuration → Mode: by `Jenkinsfile` → Script Path `ci/jenkins/Jenkinsfile`.
4. Scan → builds `main` / feature branches that contain the file.

**Done when:** a build runs and the **Checkout** + **PHPUnit** stages appear in the UI.

---

## Part J3 — Read the Jenkinsfile (15 min)

Open [`ci/jenkins/Jenkinsfile`](../ci/jenkins/Jenkinsfile). Map each stage:

| Stage | What it does | Actions cousin |
|-------|----------------|----------------|
| `Checkout` | Clone workspace | `actions/checkout` |
| `Composer` | `composer install` | cache + composer step |
| `PHPUnit` | Laravel tests | `php artisan test` job |
| `Docker` | `docker build` (optional) | `docker` job in `ci.yml` |
| `Python API` | pytest in crash-course (optional) | python workflow example |
| `Dotnet` | `dotnet build` crash-course (optional) | Azure Pipelines shape |

**Interview line:** “Stages are the contract with the team — fail fast on unit tests before heavier Docker builds.”

---

## Part J4 — Credentials & parameters (10 min)

Practice once:

1. **Manage Jenkins → Credentials** → add a secret text `DEMO_API_TOKEN`.
2. In a throwaway stage (or temporarily), bind it:

```groovy
environment {
  DEMO_API_TOKEN = credentials('DEMO_API_TOKEN')
}
```

3. Rebuild — confirm the value is masked in logs (`****`).

**Done when:** you can explain why tokens never live in the Jenkinsfile.

---

## Part J5 — Failure drill (10 min)

1. Temporarily break a test or change `PHPUnit` stage to `exit 1`.
2. Rebuild — stage goes red; later stages skip (`agent` still releases).
3. Revert; rebuild green.

**Talking point:** same as PR CI — red build blocks merge (when branch protection / GitHub Checks plugin is wired).

---

## Part J6 — Compare to GitHub Actions (5 min)

| Topic | GitHub Actions ([sprint-demo](./sprint-demo.md)) | Jenkins |
|-------|--------------------------------------------------|---------|
| Hosting | GitHub-managed runners | You host controller + agents |
| Config | `.github/workflows/*.yml` | `Jenkinsfile` (+ job config in UI/JCasC) |
| Secrets | Repo/org secrets | Credentials store / HashiCorp Vault |
| UI | Actions tab | Classic / Blue Ocean |
| CD | `cd-preview.yml` → GHCR | Deploy stage, Ansible, or call Argo |

You don’t need both in production — learn **one deeply**, speak the **mapping** for the other.

---

## Checklist (tick in [WALKTHROUGH](./WALKTHROUGH.md))

- [ ] **J1** Jenkins UI up on `:8085`
- [ ] **J2** Pipeline job builds from `ci/jenkins/Jenkinsfile`
- [ ] **J3** Can narrate each stage in 60 seconds
- [ ] **J4** Credential bound + masked in log
- [ ] **J5** Forced red build, then fixed
- [ ] **J6** Explain Jenkins ↔ Actions in one breath

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Permission denied on Docker socket | Ensure compose mounts `/var/run/docker.sock`; user in `docker` group on host |
| `composer` / `php` not found | Use the pipeline’s Docker agent image (`php:8.4-cli`) — don’t rely on host PHP |
| Git HTTPS auth fail | Add Username/Password credential; or use SSH key credential |
| Slow first build | Normal — pulls agent images; later builds reuse layers |
| “Script Path not found” | Confirm Script Path is `ci/jenkins/Jenkinsfile` relative to repo root |

---

## After this

| Next | Path |
|------|------|
| GitHub Actions sprint | [sprint-demo.md](./sprint-demo.md) |
| Plotline Docker / Compose | [DEVOPS.md](../demos/node-react-saas/DEVOPS.md) |
| Azure DevOps YAML | `demos/dotnet-aspire-garden-club/azure-pipelines/` |
| Shared libraries (advanced) | Jenkins “Global Pipeline Libraries” — one `vars/ygNotify.groovy` used by many jobs |
