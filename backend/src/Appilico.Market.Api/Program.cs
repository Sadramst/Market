using System.Text;
using System.Text.Json.Serialization;
using Appilico.Market.Api.Middleware;
using Appilico.Market.Application.Admin.Services;
using Appilico.Market.Application.Auth.Services;
using Appilico.Market.Application.Categories.Services;
using Appilico.Market.Application.Providers.Importing;
using Appilico.Market.Application.Providers.Services;
using Appilico.Market.Application.Reports.Services;
using Appilico.Market.Application.Reviews.Services;
using Appilico.Market.Application.Enquiries.Services;
using Appilico.Market.Application.Settings.Services;
using Appilico.Market.Application.Social.Services;
using Appilico.Market.Application.Subscriptions.Services;
using Appilico.Market.Application.Validators;
using Appilico.Market.Domain.Auth;
using Appilico.Market.Domain.Common;
using Appilico.Market.Infrastructure.Data;
using Appilico.Market.Infrastructure.Data.Seed;
using Appilico.Market.Infrastructure.Services.Email;
using Appilico.Market.Infrastructure.Services.Storage;
using AspNetCoreRateLimit;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// --- Serilog ---
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();
builder.Host.UseSerilog();

// --- Database ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- Identity ---
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    options.User.RequireUniqueEmail = true;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// --- JWT Authentication ---
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// --- CORS ---
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy("AppilicoPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// --- Rate Limiting ---
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

// --- FluentValidation ---
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

// --- Application Services ---
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProviderService, ProviderService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<ISocialService, SocialService>();
builder.Services.AddScoped<IEnquiryService, EnquiryService>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();
builder.Services.AddScoped<IAdminUserService, AdminUserService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IAppSettingService, AppSettingService>();
builder.Services.AddScoped<IProviderSubscriptionService, ProviderSubscriptionService>();
builder.Services.AddScoped<IProviderImportParser, CsvProviderImportParser>();
builder.Services.AddScoped<IProviderImportValidator, ProviderImportValidator>();
builder.Services.AddScoped<IProviderImportService, ProviderImportService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// --- Infrastructure Services ---
builder.Services.AddSingleton<IStorageService>(new LocalStorageService());
builder.Services.AddSingleton<IEmailService, ConsoleEmailService>();

// --- Controllers + Swagger ---
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Appilico Market API",
        Version = "v1",
        Description = "Multi-brand marketplace API - Beauty, IT Services & more"
    });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

var seedServicesOnly = args.Any(a =>
    a.Equals("seed:services", StringComparison.OrdinalIgnoreCase) ||
    a.Equals("--seed:services", StringComparison.OrdinalIgnoreCase));

// --- Middleware Pipeline ---
app.UseExceptionHandling();
app.UseSerilogRequestLogging();
app.UseIpRateLimiting();

var swaggerEnabled = app.Environment.IsDevelopment() || builder.Configuration.GetValue<bool>("Swagger:Enabled");
if (swaggerEnabled)
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Appilico Market API v1"));
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AppilicoPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// --- Health Check ---
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
    .WithTags("Health");

if (seedServicesOnly)
{
    using var scope = app.Services.CreateScope();
    await DatabaseSeeder.SeedServicesAsync(scope.ServiceProvider);
    Log.Information("Completed services marketplace seed command");
    return;
}

// --- Seed Database ---
var skipDbSeed = builder.Configuration.GetValue<bool>("SkipDatabaseSeed", false);
if (!skipDbSeed)
{
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            await DatabaseSeeder.SeedAsync(scope.ServiceProvider);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error occurred while seeding the database");
        }
    }
}
else
{
    Log.Information("Skipping database seeding because 'SkipDatabaseSeed' is true");
}

app.Run();
