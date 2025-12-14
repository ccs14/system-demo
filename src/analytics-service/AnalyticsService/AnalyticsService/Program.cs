using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Config -> Options
builder.Services.Configure<RabbitMqOptions>(builder.Configuration.GetSection("RabbitMq"));

// Postgres (EF Core)
builder.Services.AddDbContext<AnalyticsDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("AnalyticsDb")));

// Rabbit consumer background service
builder.Services.AddHostedService<>();

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();