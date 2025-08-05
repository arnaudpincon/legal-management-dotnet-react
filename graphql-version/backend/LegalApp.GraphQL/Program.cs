using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LegalApp.GraphQL.Data;
using LegalApp.GraphQL.GraphQL.Schema;
using LegalApp.GraphQL.GraphQL.Queries;
using LegalApp.GraphQL.GraphQL.Mutations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Data Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("LegalAppGraphQLDb"));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "LegalApp",
            ValidAudience = "LegalApp",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SuperSecretKeyForJWTAuthentication123456789!@#$%^&*()"))
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5275")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// GraphQL Configuration
builder.Services
    .AddGraphQLServer()
    .AddQueryType<LegalAppQueryType>()
    .AddMutationType<LegalAppMutationType>()
    .AddAuthorization()
    .AddProjections()
    .AddFiltering()
    .AddSorting();

var app = builder.Build();

// pipeline configuration
if (app.Environment.IsDevelopment())
{
    // GraphQL Dev Playground
    //app.MapGraphQLPlayground("/ui/playground");
}

app.UseCors("ReactApp");
app.UseAuthentication();
app.UseAuthorization();

// Controllers REST (for auth)
app.MapControllers();

app.MapGraphQL("/graphql");

// init database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

app.Run();