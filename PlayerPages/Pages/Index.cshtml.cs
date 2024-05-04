using Microsoft.AspNetCore.Mvc.RazorPages;

namespace PlayerPages.Pages
{
    public class IndexModel : PageModel
    {
        public Models.PageProperties PageProperties { get; set; }
            = Models.PagePropertiesModule.Empty;

        public void OnGet(string id)
        {
            if (id == "example1")
                PageProperties = Models.PagePropertiesModule.Example1;
        }
    }
}
