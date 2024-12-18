using Chathub.API.Infrastructure.Data.Context;
using Chathub.API.Infrastructure.Data.Entities;
using Chathub.API.Domain.Services.Abstract;
using Chathub.API.Domain.Services.Implementation;
using Chathub.API.Domain.UnitOfWorks.Abstract;
using Chathub.API.Domain.UnitOfWorks.Implementation;
using Chathub.API.Infrastructure.Repositories.Abstract;
using Chathub.API.Infrastructure.Repositories.Implementation;
using Chathub.API.Misc.MapperProfiles;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Hosting;
using Chathub.API.Domain.Hubs;

namespace Chathub.API
{
    public class Program
    {
        private static readonly string _corsPolicy = "AllowAll";
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddSignalR();

            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(_corsPolicy, policy =>
                {
                    policy.AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials()
                            .SetIsOriginAllowed(hostname => true);
                });
            });

            builder.Services.AddDbContext<ChathubContext>(options =>
            {
                options.UseNpgsql(builder.Configuration["ConnectionStrings:Local"]);
            });

            builder.Services.AddIdentityCore<User>(options =>
            {
                options.Password.RequiredLength = 8;
                options.User.RequireUniqueEmail = true;
            }).AddEntityFrameworkStores<ChathubContext>();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidateLifetime = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.Unicode.GetBytes(builder.Configuration["Jwt:Key"])),
                    ClockSkew = TimeSpan.Zero
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            (path.StartsWithSegments("/chat")))
                        {
                            context.Token = accessToken;

                        }

                        return Task.CompletedTask;
                    }
                };
            }).AddCookie(options =>
            {
                options.Cookie.HttpOnly = true;
                options.ReturnUrlParameter = string.Empty;
                options.AccessDeniedPath = string.Empty;
                options.LoginPath = string.Empty;
                options.Events.OnRedirectToAccessDenied =
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
            });

            //Repository
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
            builder.Services.AddScoped<IChatRoomRepository, ChatRoomRepository>();
            builder.Services.AddScoped<IChatMemberRepository, ChatMemberRepository>();
            builder.Services.AddScoped<IChatMessageRepository, ChatMessageRepository>();
            builder.Services.AddScoped<IChatFileRepository, ChatFileRepository>();
            builder.Services.AddScoped<IRoleRepository, RoleRepository>();

            //Unit Of Work
            builder.Services.AddScoped<IUserUnitOfWork, UserUnitOfWork>();
            builder.Services.AddScoped<IDeviceUnitOfWork, DeviceUnitOfWork>();
            builder.Services.AddScoped<IChatRoomUnitOfWork, ChatRoomUnitOfWork>();
            builder.Services.AddScoped<IChatMemberUnitOfWork, ChatMemberUnitOfWork>();

            //Service
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IChatRoomService, ChatRoomService>();

            builder.Services.AddAutoMapper(typeof(ChatRoomProfile));

            var app = builder.Build();

            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

            // Configure the HTTP request pipeline.
            app.UseCors(_corsPolicy);
            app.UseAuthorization();


            app.MapControllers();
            app.MapHub<ChatHub>("/chat");

            app.Run();
        }
    }
}
