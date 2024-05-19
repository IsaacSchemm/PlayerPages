using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlayerPages.Data;
using PlayerPages.Models;

namespace PlayerPages.Controllers
{
    [Route("/")]
    public class RenderController(PlayerPagesDbContext context) : Controller
    {
        [HttpGet("public/{id}")]
        public async Task<IActionResult> GetAsync(string id)
        {
            if (!await context.Pages.AnyAsync())
            {
                context.Pages.Add(new Page
                {
                    Id = "example1",
                    PageProperties = PagePropertiesModule.Example1,
                    Public = true
                });
                await context.SaveChangesAsync();
            }

            var page = await context.Pages
                .Where(p => p.Id == id)
                .Where(p => p.Public)
                .SingleOrDefaultAsync();

            return page == null
                ? NotFound()
                : View("Page", page);
        }

        [HttpGet("private/{id}")]
        [PlayerPagesAdminAuthorization]
        public async Task<IActionResult> GetPrivateAsync(string id)
        {
            var page = await context.Pages
                .Where(p => p.Id == id)
                .SingleOrDefaultAsync();

            return page == null
                ? NotFound()
                : View("Page", page);
        }

        [HttpPost("render")]
        [PlayerPagesAdminAuthorization]
        public IActionResult GetPrivateAsync([FromBody]PageProperties pageProperties)
        {
            return View("Page", new Page
            {
                PageProperties = pageProperties
            });
        }
    }
}
