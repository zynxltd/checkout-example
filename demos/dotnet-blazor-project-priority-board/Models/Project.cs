using System.ComponentModel.DataAnnotations;

namespace ProjectPriorityBoard.Models;

public class Project
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "Deadline is required")]
    [StringLength(50, ErrorMessage = "Deadline cannot exceed 50 characters")]
    public string Deadline { get; set; } = "";

    public string Status { get; set; } = "Planning";
}
