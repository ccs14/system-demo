namespace AnalyticsService.Infrastructure.Messaging;

public sealed class RabbitMqOptions
{
    public string HostName { get; init; } = default!;
    public int Port { get; init; }

    public string UserName { get; init; } = default!;
    public string Password { get; init; } = default!;

    public string VirtualHost { get; init; } = "/";
    public string RedditRandomQueue { get; init; } = default!;
    public string RedditTopQueue { get; init; } = default!;
    public int PrefetchCount { get; init; } = 50;
}