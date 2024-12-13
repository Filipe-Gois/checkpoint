using DotNetEnv;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using web_api_checkpoint.Contexts;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Repositories;


var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices((services) =>
    {

        string connectionString = "Server=tcp:checkpointserver.database.windows.net,1433;Initial Catalog=checkpointdatabase;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;User Id=checkpointsa;Password=Senai@134;";
     
        services.AddDbContext<CheckpointContext>(options =>
            options.UseSqlServer(connectionString));

        // Configura��o dos outros servi�os
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        services.AddScoped<IPresencaRepository, PresencaRepository>();
    })
    .Build();

host.Run();