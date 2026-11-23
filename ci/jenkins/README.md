# Jenkins (local) — quick ops

Full lesson: **[docs/jenkins-walkthrough.md](../../docs/jenkins-walkthrough.md)**

## Start

```bash
cd ci/jenkins
docker compose up -d
open http://127.0.0.1:8085

# initial admin password
docker compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

## Point a job at this repo

| Field | Value |
|-------|--------|
| Definition | Pipeline script from SCM |
| SCM | Git (your fork / clone URL) |
| Script Path | `ci/jenkins/Jenkinsfile` |

### Parameters

| Param | Default | Meaning |
|-------|---------|---------|
| `RUN_DOCKER` | true | `docker build` at repo root |
| `RUN_PYTHON` | false | pytest in `demos/python-react-crash-course/api` |
| `RUN_DOTNET` | false | `dotnet build` crash-course |
| `RUN_NUGET` | false | pack + test `demos/dotnet-nuget-demo` |

## Stop / reset

```bash
docker compose down          # keep jenkins_home volume
docker compose down -v       # wipe Jenkins config (full reset)
```

## Note on Docker-in-Jenkins

The compose file mounts the **host** Docker socket so `docker build` stages work. That is convenient for learning and risky in shared environments — production uses dedicated agents or DinD with care.
