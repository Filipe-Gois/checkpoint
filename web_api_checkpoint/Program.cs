using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using web_api_checkpoint.Contexts;
using web_api_checkpoint.Hubs;
using web_api_checkpoint.Interfaces;
using web_api_checkpoint.Repositories;
using web_api_checkpoint.Services;
using web_api_checkpoint.Utils.Mail;
using WebAPI.Utils.Mail;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

string StringConnectionDataBase = Environment.GetEnvironmentVariable("StringConnectionDataBase")!;
string azureSignalRConnectionString = Environment.GetEnvironmentVariable("AzureSignalRConnectionString")!;


builder.Services.AddSignalR();
    //.AddAzureSignalR(azureSignalRConnectionString);

// Add services to the container.
builder.Services.AddControllers();

// Configuração de autenticação JwtBearer
builder.Services.AddAuthentication(options =>
{
    options.DefaultChallengeScheme = "JwtBearer";
    options.DefaultAuthenticateScheme = "JwtBearer";
})
.AddJwtBearer("JwtBearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("checkpoint-symmetricsecuritykey-api")),
        ClockSkew = TimeSpan.FromMinutes(30),
        ValidIssuer = "API-checkpoint",
        ValidAudience = "API-checkpoint"
    };
});

// Configuração do Swagger para documentação da API
// Configuração do Swagger para documentação da API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API checkpoint",
        Description = "Backend API",
        Contact = new OpenApiContact
        {
            Name = "Checkpoint"
        }
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Value: Bearer TokenJWT ",
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddDbContext<CheckpointContext>(options =>
    options.UseSqlServer(StringConnectionDataBase));

// Configuração do serviço de e-mail
// Configuração do serviço de e-mail
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection(nameof(EmailSettings)));
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddScoped<EmailSendingService>();

// Injeção de dependências para repositórios
builder.Services.AddTransient<IEstagiarioRepository, EstagiarioRepository>();
builder.Services.AddTransient<IExpedienteRepository, ExpedienteRepository>();
builder.Services.AddTransient<IPresencaRepository, PresencaRepository>();
builder.Services.AddTransient<ISquadRepository, SquadRepository>();
builder.Services.AddTransient<ITarefaRepository, TarefaRepository>();
builder.Services.AddTransient<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddTransient<INotificacaoRepository, NotificacaoRepository>();
builder.Services.AddTransient<IJustificativaFaltaRepository, JustificativaFaltaRepository>();
builder.Services.AddScoped<IHubProvider, HubProviderService>();
// Referencia a injeção de dependência --> usado toda vez que usar construtor com parâmetro na controller
builder.Services.AddSingleton<MongoDBService>();

// Configuração de CORS
// Configuração de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configuração do Swagger para estar disponível em produção
app.UseSwagger();
// Configuração do Swagger para estar disponível em produção
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "API checkpoint v1");

    if (app.Environment.IsProduction())
    {
        options.RoutePrefix = string.Empty; // Exibe o Swagger na raiz do site
    }

});

//app.UseCors("CorsPolicy");

//Habilita o CORS
app.UseCors(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("http://localhost:3000")
    .AllowCredentials());
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapHub<HubProvider>("/Hub");

app.Run();

