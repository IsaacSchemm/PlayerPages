using Microsoft.EntityFrameworkCore;

namespace PlayerPages.Data
{
    public class PlayerPagesDbContext(DbContextOptions<PlayerPagesDbContext> options) : DbContext(options)
    {
        public DbSet<Page> Pages { get; set; }
    }
}
