using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using ReviewAnalyzer.Application.Services;
using ReviewAnalyzer.PostgreSql;
using ReviewAnalyzer.PostgreSql.Repositories;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
// Add services to the container.

services.AddScoped<IProcessReview, ProcessReviewMoq>();
services.AddScoped<IGroupReviewService, GroupReviewService>();
services.AddScoped<IGroupRepository, GroupRepository>();
services.AddScoped<IReviewRepository, ReviewRepository>();
services.AddScoped<IReviewService, ReviewService>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

services.AddCors(options => 
{
    options.AddDefaultPolicy(p =>
    {
        p.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1024L * 1024L * 200;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 200 * 1024 * 1024; // 200 MB
});

var connectionString = builder.Configuration.GetConnectionString("Postgres");

services.AddDbContext<ReviewDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapOpenApi();

app.MapScalarApiReference(options =>
{
    options.Title = "API Documentation";
    options.Theme = ScalarTheme.Default;
    if(!app.Environment.IsDevelopment())
        options.AddServer("https://api.reviewanalyzer.mixdev.me");
});

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();