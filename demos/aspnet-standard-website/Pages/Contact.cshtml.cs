using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AspNetStandardWebsite.Pages;

public class ContactModel : PageModel
{
    [BindProperty]
    public ContactInput Input { get; set; } = new();

    public bool Submitted { get; private set; }

    public string? SubmittedName { get; private set; }

    public void OnGet()
    {
    }

    public IActionResult OnPost()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        // Demo only — swap for email/CRM integration in production.
        SubmittedName = Input.Name;
        Submitted = true;
        ModelState.Clear();
        Input = new ContactInput();
        return Page();
    }

    public class ContactInput
    {
        [Required, StringLength(80)]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(120)]
        public string Email { get; set; } = string.Empty;

        [StringLength(120)]
        public string? Company { get; set; }

        [Required, StringLength(2000, MinimumLength = 10)]
        public string Message { get; set; } = string.Empty;
    }
}
