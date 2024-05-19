using Microsoft.AspNetCore.Mvc;
using PlayerPages.Data;
using PlayerPages.Models;

namespace PlayerPages.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagesController(IContentDeliveryNetwork cdn, PlayerPagesDbContext context) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync(string id)
        {
            if (Request.IsAdmin()) return Forbid();

            var page = await context.Pages.FindAsync(id);
            return page?.PageProperties is PageProperties pp
                ? Ok(pp)
                : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] PageProperties value)
        {
            if (Request.IsAdmin()) return Forbid();

            return await PutAsync($"{Guid.NewGuid()}", value);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsync(string id, [FromBody] PageProperties value)
        {
            if (Request.IsAdmin()) return Forbid();

            var page = await context.Pages.FindAsync(id);
            if (page == null)
            {
                page = new Page {
                    Id = id,
                    Public = false
                };
                context.Pages.Add(page);
            }
            page.PageProperties = value;
            await context.SaveChangesAsync();

            await cdn.InvalidateCacheAsync(id);

            return new CreatedResult();
        }

        [HttpPost("{id}/show")]
        public async Task<IActionResult> ShowAsync(string id)
        {
            if (Request.IsAdmin()) return Forbid();

            var page = await context.Pages.FindAsync(id);
            if (page != null && !page.Public)
            {
                page.Public = true;
                await context.SaveChangesAsync();
            }

            return NoContent();
        }

        [HttpPost("{id}/hide")]
        public async Task<IActionResult> HideAsync(string id)
        {
            if (Request.IsAdmin()) return Forbid();

            var page = await context.Pages.FindAsync(id);
            if (page != null && page.Public)
            {
                page.Public = false;
                await context.SaveChangesAsync();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            if (Request.IsAdmin()) return Forbid();

            var page = await context.Pages.FindAsync(id);
            if (page != null)
            {
                context.Pages.Remove(page);
                await context.SaveChangesAsync();
                return NoContent();
            }

            await cdn.InvalidateCacheAsync(id);

            return NotFound();
        }
    }
}
