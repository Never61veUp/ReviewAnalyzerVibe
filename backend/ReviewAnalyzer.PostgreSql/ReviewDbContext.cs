using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReviewAnalyzer.PostgreSql.Configuration;
using ReviewAnalyzer.PostgreSql.Model;

namespace ReviewAnalyzer.PostgreSql;

public class ReviewDbContext(DbContextOptions<ReviewDbContext> options) : DbContext(options)
{
    public DbSet<ReviewEntity> Reviews { get; set; }
    public DbSet<ReviewGroupEntity> ReviewGroups { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new ReviewConfiguration());
        modelBuilder.ApplyConfiguration(new ReviewGroupConfiguration());
    }
}