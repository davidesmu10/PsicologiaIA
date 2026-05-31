using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using PsicologiaIAAPI.Data;
using System.Net;
using System.Net.Http;
using System.Net.Sockets;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "PsicologiaIA API",
                Version = "v1"
            });
        });

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                builder.Configuration.GetConnectionString("DefaultConnection"),
                sqlServerOptionsAction: sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(3),
                        errorNumbersToAdd: null
                    );
                }
            ));

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("PermitirTodo", policy =>
            {
                policy.WithOrigins("http://localhost:3000") 
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials(); 
            });
        });

        builder.Services.AddHttpClient("", client =>
        {
        })
        .ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler
        {
            ConnectCallback = async (context, cancellationToken) =>
            {
                var host = context.DnsEndPoint.Host;
                var port = context.DnsEndPoint.Port;

                if (host.Equals("router.huggingface.co", StringComparison.OrdinalIgnoreCase))
                {
                    host = "108.138.85.122"; 
                }

                var socket = new System.Net.Sockets.Socket(
                    System.Net.Sockets.AddressFamily.InterNetwork,
                    System.Net.Sockets.SocketType.Stream,
                    System.Net.Sockets.ProtocolType.Tcp
                );

                try
                {
                    await socket.ConnectAsync(host, port, cancellationToken);
                    return new NetworkStream(socket, ownsSocket: true);
                }
                catch
                {
                    socket.Dispose();
                    throw;
                }
            }
        });

        var app = builder.Build();

        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "PsicologiaIA API V1");
        });

        if (!app.Environment.IsDevelopment())
        {
            app.UseHttpsRedirection();
        }

        app.UseCors("PermitirTodo");

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}