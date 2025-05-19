using Microsoft.EntityFrameworkCore;
using WarehouseManagementSystem.Api.Data;
using Microsoft.AspNetCore.Identity;
using WarehouseManagementSystem.Api.Models; // Required for ApplicationUser
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WarehouseManagementSystem.Api.Services; // Add this using
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Define a CORS policy
const string NextJsClientPolicy = "NextJsClient";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: NextJsClientPolicy,
                      policy  =>
                      {
                          policy.WithOrigins("http://localhost:3000") // Allow your Next.js dev server origin
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// 1. Add Configuration for Connection String and JWT from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var jwtSecret = builder.Configuration["JWT:Secret"];
var jwtIssuer = builder.Configuration["JWT:ValidIssuer"];
var jwtAudience = builder.Configuration["JWT:ValidAudience"];

// 2. Configure DbContext with PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Configure Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options => {
    // Example: Password settings (customize as needed)
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = false;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// 4. Configure JWT Authentication
if (!string.IsNullOrEmpty(jwtSecret) && !string.IsNullOrEmpty(jwtIssuer) && !string.IsNullOrEmpty(jwtAudience))
{
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = builder.Environment.IsProduction(); // True in Production
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });
}
else
{
    // Log or handle missing JWT configuration
    Console.WriteLine("JWT configuration is missing in appsettings.json. JWT Authentication will not be configured.");
}

// Register Repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IItemRepository, ItemRepository>();
// Add other specific repositories here, e.g.:
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<IWarehouseRepository, WarehouseRepository>();
builder.Services.AddScoped<IShelfRepository, ShelfRepository>();
builder.Services.AddScoped<IStockRepository, StockRepository>();

// Register Services
builder.Services.AddScoped<IItemService, ItemService>();
// Add other services here, e.g.:
builder.Services.AddScoped<ISupplierService, SupplierService>();
builder.Services.AddScoped<IWarehouseService, WarehouseService>();
builder.Services.AddScoped<IShelfService, ShelfService>();
builder.Services.AddScoped<IStockService, StockService>();

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed essential roles and default SuperAdmin user
await SeedIdentityDataAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage(); // Useful for debugging in development
}
else
{
    // In production, you might want to add more sophisticated error handling
    app.UseExceptionHandler("/Error"); 
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseCors(NextJsClientPolicy); // IMPORTANT: Add CORS middleware here, before UseAuthentication and UseAuthorization

// IMPORTANT: Authentication middleware MUST be added before Authorization middleware.
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Remove or comment out the weather forecast example if it exists
/*
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();
*/

app.Run();

// Remove WeatherForecast record if it exists
// public record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
// {
//     public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
// }

// Helper method for seeding identity data
async Task SeedIdentityDataAsync(IServiceProvider services)
{
    using (var scope = services.CreateScope())
    {
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>(); // For logging seed operations

        string[] roleNames = { "Logistic", "Manager", "SuperAdmin" };
        IdentityResult roleResult;

        foreach (var roleName in roleNames)
        {
            var roleExist = await roleManager.RoleExistsAsync(roleName);
            if (!roleExist)
            {
                roleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                if (roleResult.Succeeded)
                {
                    logger.LogInformation("Role '{RoleName}' created successfully.", roleName);
                }
                else
                {
                    logger.LogError("Error creating role '{RoleName}'. Errors: {Errors}", roleName, string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                }
            }
        }

        // Check if a SuperAdmin user exists
        var superAdminUsers = await userManager.GetUsersInRoleAsync("SuperAdmin");
        if (!superAdminUsers.Any())
        {
            // You can get these from configuration or define them here
            var superAdminEmail = builder.Configuration["Defaults:SuperAdmin:Email"] ?? "superadmin@example.com";
            var superAdminUsername = builder.Configuration["Defaults:SuperAdmin:Username"] ?? "superadmin";
            var superAdminPassword = builder.Configuration["Defaults:SuperAdmin:Password"] ?? "SuperAdminP@ss123";

            var superAdminUser = await userManager.FindByEmailAsync(superAdminEmail);
            if (superAdminUser == null)
            {
                superAdminUser = new ApplicationUser
                {
                    UserName = superAdminUsername,
                    Email = superAdminEmail,
                    EmailConfirmed = true, // Optional: Confirm email сразу
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                var userResult = await userManager.CreateAsync(superAdminUser, superAdminPassword);
                if (userResult.Succeeded)
                {
                    logger.LogInformation("Default SuperAdmin user '{SuperAdminUsername}' created successfully.", superAdminUsername);
                    await userManager.AddToRoleAsync(superAdminUser, "SuperAdmin");
                    logger.LogInformation("Assigned 'SuperAdmin' role to '{SuperAdminUsername}'.", superAdminUsername);
                }
                else
                {
                     logger.LogError("Error creating default SuperAdmin user '{SuperAdminUsername}'. Errors: {Errors}", 
                        superAdminUsername, string.Join(", ", userResult.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                 // If user exists but not in role (should be rare if logic is correct)
                if (!await userManager.IsInRoleAsync(superAdminUser, "SuperAdmin"))
                {
                    await userManager.AddToRoleAsync(superAdminUser, "SuperAdmin");
                    logger.LogInformation("Assigned 'SuperAdmin' role to existing user '{SuperAdminUsername}'.", superAdminUsername);
                }
            }
        }
    }
}
