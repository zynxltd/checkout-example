# Lab checklist — Project Priority Board 2.0

Mark off as you study each part in this folder (completed solution is already wired).

## Enterprise architecture

- [ ] **1** Explore structure (`Program.cs`, Home, ProjectCard, About, NavMenu, `app.css`)
- [ ] **2** `Models/Project.cs` — shared `Project` class (removed from Home)
- [ ] **3** `Services/ProjectService.cs` — list, `GetAllProjects`, `AddProject`
- [ ] **4** `Program.cs` — `AddSingleton<ProjectService>()`
- [ ] **5** Home injects service + loads projects in lifecycle

## Forms

- [ ] **6** `AddProject.razor` — `EditForm` / `InputText` / `InputSelect`
- [ ] **7** `HandleValidSubmit` → service add + `Navigation.NavigateTo("/")`
- [ ] **8** NavMenu link to `/add-project`
- [ ] **9** Data annotations + `DataAnnotationsValidator` / `ValidationSummary`

## Lifecycle

- [ ] **10** `isLoading` + “Loading projects...”
- [ ] **11** `GetAllProjectsAsync` + `OnInitializedAsync`

## Routing

- [ ] **12** `@page "/project-detail/{ProjectId:int}"`
- [ ] **13** `OnViewDetails` EventCallback → `NavigateToDetails(index)`
- [ ] **14** `UpdateProject` + save on detail page
- [ ] **15** Smoke-test full flow

## Quick smoke

1. Home shows loading (~1s), then 4 projects  
2. Reorder with Move Up / Down  
3. Add Project (try empty submit for validation)  
4. View Details → edit → Update → back on Home  
