using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
using WardDesk.Database;
using WardDesk.Service;

namespace WardDesk
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Adding and Initializing Firebase Admin SDK
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile("Firebase/firebase-admin-sdk.json")
            });

            // JWT Configuration - Read from Jwt section
            var jwtSecretKey = builder.Configuration["Jwt:SecretKey"];
            var jwtIssuer = builder.Configuration["Jwt:Issuer"];
            var jwtAudience = builder.Configuration["Jwt:Audience"];

            // Validate JWT configuration
            if (string.IsNullOrEmpty(jwtSecretKey))
                throw new InvalidOperationException("Jwt:SecretKey is not configured in appsettings.json");

            if (string.IsNullOrEmpty(jwtIssuer))
                throw new InvalidOperationException("Jwt:Issuer is not configured in appsettings.json");

            if (string.IsNullOrEmpty(jwtAudience))
                throw new InvalidOperationException("Jwt:Audience is not configured in appsettings.json");

            // Database
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // HttpClient
            builder.Services.AddHttpClient();

            // AuthService
            builder.Services.AddScoped<AuthService>();

            //Complaint Service
            builder.Services.AddScoped<ComplaintService>();
            //Vote Service
            builder.Services.AddScoped<VoteService>();


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact", policy =>
                {
                    if (builder.Environment.IsDevelopment())
                    {
                        policy.SetIsOriginAllowed(_ => true)
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    }
              
                });
            });

            // JWT Authentication
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtIssuer,
                        ValidateAudience = true,
                        ValidAudience = jwtAudience,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
                    };
                });

            builder.Services.AddAuthorization();

            // Controllers
            builder.Services.AddControllers();

            // OpenAPI/Scalar
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure pipeline
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }
            app.UseCors("AllowReact");
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}