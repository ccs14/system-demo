using AnalyticsService.Infrastructure.Messaging;
using AnalyticsService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<RabbitMqOptions>(builder.Configuration.GetSection("RabbitMq"));

// Postgres
builder.Services.AddDbContext<AnalyticsDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("AnalyticsDb")));

// Rabbit consumer background service
builder.Services.AddHostedService<RabbitMqConsumerHostedService>();

// Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (Environment.GetEnvironmentVariable("RUN_MIGRATIONS") == "true")
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AnalyticsDbContext>();
    db.Database.Migrate();
}

bool enableSwagger = false;
var swaggerSetting = Environment.GetEnvironmentVariable("ENABLE_SWAGGER") == "true";
if (app.Environment.IsDevelopment() || swaggerSetting)
{
    enableSwagger = true;
}

if (enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();