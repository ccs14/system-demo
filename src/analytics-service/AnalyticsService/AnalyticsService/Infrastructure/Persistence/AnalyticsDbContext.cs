using AnalyticsService.Domain.Stats;
using Microsoft.EntityFrameworkCore;

namespace AnalyticsService.Infrastructure.Persistence;

public sealed class AnalyticsDbContext : DbContext
{
    public AnalyticsDbContext(DbContextOptions<AnalyticsDbContext> options) : base(options) { }

    public DbSet<EventCount> EventCounts => Set<EventCount>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EventCount>(b =>
        {
            b.ToTable("EventCounts");
            b.HasKey(x => x.EventType);
            b.Property(x => x.EventType).HasMaxLength(200).IsRequired();
            b.Property(x => x.Count).IsRequired();
        });
    }
}