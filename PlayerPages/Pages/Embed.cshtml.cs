using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace PlayerPages.Pages
{
    public class EmbedModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public EmbedModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {

        }
    }
}
