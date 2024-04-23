using Microsoft.AspNetCore.Mvc.RazorPages;

namespace PlayerPages.Pages
{
    public class IndexModel : PageModel
    {
        public Models.PageProperties PageProperties { get; set; } =
            Models.PagePropertiesModule.Example1;

        public void OnGet()
        {
            PageProperties = Models.PagePropertiesModule.Example1;
        }
    }
}
