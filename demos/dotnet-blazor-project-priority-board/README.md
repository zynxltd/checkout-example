# Project Priority Board 2.0

Local follow-along for the Codecademy **Project Priority Board 2.0** Blazor Server lab.

## Run

```bash
cd demos/dotnet-blazor-project-priority-board
dotnet run --launch-profile http
```

Open **http://localhost:5243**

## What this covers

| Area | Files |
|------|--------|
| Shared model | `Models/Project.cs` |
| DI service | `Services/ProjectService.cs`, `Program.cs` |
| Board + reorder | `Components/Pages/Home.razor`, `Components/ProjectCard.razor` |
| Add form + validation | `Components/Pages/AddProject.razor` |
| Detail route + edit | `Components/Pages/ProjectDetail.razor` |
| Nav | `Components/Layout/NavMenu.razor` |

See [TASKS.md](./TASKS.md) for the 15 lab checkpoints mapped to this code.
