using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using PlayerPages.Data;

namespace PlayerPages.Pages
{
    public class IndexModel(PlayerPagesDbContext context) : PageModel
    {
        public string Id { get; set; } = "";

        public Models.PageProperties PageProperties { get; set; } = Models.PagePropertiesModule.Empty;

        public async Task OnGetAsync(string id)
        {
            Id = id;

            if (!await context.Pages.AnyAsync())
            {
                context.Pages.Add(new Data.Page
                {
                    Id = "example1",
                    PageProperties = Models.PagePropertiesModule.Example1,
                    Public = true
                });
                await context.SaveChangesAsync();
            }

            bool isAdmin = Request.IsAdmin();

            var page = await context.Pages
                .Where(p => p.Id == id)
                .Where(p => p.Public || isAdmin)
                .SingleOrDefaultAsync();

            PageProperties = page?.PageProperties ?? Models.PagePropertiesModule.Empty;
        }
    }
}
