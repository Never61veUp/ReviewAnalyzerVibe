using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ReviewAnalyzer.PostgreSql;

var builder = Host.CreateDefaultBuilder(args)
    .ConfigureServices((context, services) =>
    {
        services.AddDbContext<ReviewDbContext>(options =>
            options.UseNpgsql(context.Configuration.GetConnectionString("Postgres")));

        services.AddScoped<IMigrationService, MigrationService>();
    });

var app = builder.Build();

using var scope = app.Services.CreateScope();
var migrator = scope.ServiceProvider.GetRequiredService<IMigrationService>();
await migrator.ApplyMigrationsAsync();

public class MigrationService : IMigrationService
{
    private readonly ReviewDbContext _db;
    private readonly ILogger<MigrationService> _logger;

    public MigrationService(ReviewDbContext db, ILogger<MigrationService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task ApplyMigrationsAsync()
    {
        try
        {
            _logger.LogInformation("Applying migrations...");
            await _db.Database.MigrateAsync();
            _logger.LogInformation("Migrations applied.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Migration failed.");
            throw;
        }
    }
}


public interface IMigrationService
{
    Task ApplyMigrationsAsync();
}
