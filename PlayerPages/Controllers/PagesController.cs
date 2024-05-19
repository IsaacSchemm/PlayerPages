using Microsoft.AspNetCore.Mvc;
using PlayerPages.Data;
using PlayerPages.Models;

namespace PlayerPages.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagesController(PlayerPagesDbContext context) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync(string id)
        {
            var page = await context.Pages.FindAsync(id);
            return page?.PageProperties is PageProperties pp
                ? Ok(pp)
                : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] PageProperties value)
        {
            return await PutAsync($"{Guid.NewGuid()}", value);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsync(string id, [FromBody] PageProperties value)
        {
            var page = await context.Pages.FindAsync(id);
            if (page == null)
            {
                page = new Page { Id = id };
                context.Pages.Add(page);
            }
            page.PageProperties = value;
            await context.SaveChangesAsync();
            return new CreatedResult();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var page = await context.Pages.FindAsync(id);
            if (page != null)
            {
                context.Pages.Remove(page);
                await context.SaveChangesAsync();
                return NoContent();
            }

            return NotFound();
        }
    }
}
