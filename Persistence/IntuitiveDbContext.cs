using intuitive.Models;
using Microsoft.EntityFrameworkCore;

namespace intuitive.Persistence
{
    public class IntuitiveDbContext : DbContext
    {
        public IntuitiveDbContext(DbContextOptions<IntuitiveDbContext> options) : base(options)
        {
            // System.Configuration.ConfigurationManager 
        }

        public DbSet<Measure> Measures { get; set; }
    }
}