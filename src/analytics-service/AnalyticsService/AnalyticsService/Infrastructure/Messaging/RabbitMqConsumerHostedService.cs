using AnalyticsService.Domain.Stats;
using AnalyticsService.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace AnalyticsService.Infrastructure.Messaging;

public sealed class RabbitMqConsumerHostedService : BackgroundService
{
    private readonly RabbitMqOptions _opt;
    private readonly IServiceScopeFactory _scopeFactory;

    private IConnection? _connection;
    private IChannel? _channel;

    public RabbitMqConsumerHostedService(IOptions<RabbitMqOptions> options, IServiceScopeFactory scopeFactory)
    {
        _opt = options.Value;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = _opt.HostName,
            Port = _opt.Port,
            UserName = _opt.UserName,
            Password = _opt.Password,
            VirtualHost = _opt.VirtualHost
        };

        _connection = await factory.CreateConnectionAsync(stoppingToken);
        _channel = await _connection.CreateChannelAsync(cancellationToken: stoppingToken);

        await _channel.BasicQosAsync(0, (ushort)_opt.PrefetchCount, false, stoppingToken);

        await StartConsumerAsync(_opt.RedditRandomQueue, stoppingToken);
        await StartConsumerAsync(_opt.RedditTopQueue, stoppingToken);

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    private async Task StartConsumerAsync(string queueName, CancellationToken ct)
    {
        await _channel!.QueueDeclareAsync(
            queue: queueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null,
            cancellationToken: ct);

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (_, ea) =>
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AnalyticsDbContext>();

            var row = await db.EventCounts.FindAsync(new object[] { queueName }, ct);
            if (row is null)
            {
                row = new EventCount(queueName, 0);
                db.EventCounts.Add(row);
            }

            row.Increment();
            await db.SaveChangesAsync(ct);

            await _channel!.BasicAckAsync(ea.DeliveryTag, false, ct);
        };

        await _channel.BasicConsumeAsync(
            queue: queueName,
            autoAck: false,
            consumerTag: string.Empty,
            noLocal: false,
            exclusive: false,
            arguments: null,
            consumer: consumer,
            cancellationToken: ct);
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_channel is not null) await _channel.CloseAsync(cancellationToken);
        if (_connection is not null) await _connection.CloseAsync(cancellationToken);
        await base.StopAsync(cancellationToken);
    }
}