using ProjectPriorityBoard.Models;

namespace ProjectPriorityBoard.Services;

public class ProjectService
{
    private readonly List<Project> projects =
    [
        new Project { Name = "Mobile App Redesign", Deadline = "March 15, 2024", Status = "Active" },
        new Project { Name = "API Documentation", Deadline = "February 28, 2024", Status = "Active" },
        new Project { Name = "Security Audit", Deadline = "April 10, 2024", Status = "Planning" },
        new Project { Name = "Performance Optimization", Deadline = "May 5, 2024", Status = "On Hold" }
    ];

    public List<Project> GetAllProjects() => projects;

    public async Task<List<Project>> GetAllProjectsAsync()
    {
        await Task.Delay(1000);
        return projects;
    }

    public void AddProject(Project project) => projects.Add(project);

    public void UpdateProject(int index, Project project)
    {
        if (index >= 0 && index < projects.Count)
        {
            projects[index] = project;
        }
    }
}
