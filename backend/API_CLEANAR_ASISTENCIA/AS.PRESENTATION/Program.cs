using AS.APLICATION.Interface;
using AS.APLICATION.Services;
using AS.INFRAESTRUCTURE.DATABASE;
using AS.INFRAESTRUCTURE.REPOSITORY;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//cadena de conexion
var connetionstring = builder.Configuration.GetConnectionString("default");
builder.Services.AddSingleton(new DBConnectionFactory(connetionstring));

//inyecion de dependencias
builder.Services.AddScoped<IEstadosRepository, EstadoRepository>();
builder.Services.AddScoped<EstadosServices>();
builder.Services.AddScoped<IEstadosAsistenciaRepository, EstadoAsistenciaRepository>();
builder.Services.AddScoped<EstadosAsistenciaServices>();
builder.Services.AddScoped<IRolesRepository, RolesRepository>();
builder.Services.AddScoped<RolesServices>();
builder.Services.AddScoped<IUsuariosRepository, UsuariosRepository>();
builder.Services.AddScoped<UsuariosServices>();
builder.Services.AddScoped<IUsuariosRolesRepository, UsuariosRolesRepository>();
builder.Services.AddScoped<UsuariosRolesServices>();
builder.Services.AddScoped<IInstitucionesRepository, InstitucionesRepository>();
builder.Services.AddScoped<InstitucionesServices>();
builder.Services.AddScoped<ISedesRepository, SedesRepository>();
builder.Services.AddScoped<SedesServices>();
builder.Services.AddScoped<IGradosRepository, GradosRepository>();
builder.Services.AddScoped<GradosServices>();

// alumnos
builder.Services.AddScoped<IAlumnoRepository, AlumnoRepository>();
builder.Services.AddScoped<AlumnosServices>();

// profesores
builder.Services.AddScoped<IProfesoresRepository, ProfesoresRepository>();
builder.Services.AddScoped<ProfesoresServices>();

// materias
builder.Services.AddScoped<IMateriasRepository, MateriasRepository>();
builder.Services.AddScoped<MateriasServices>();

// clases
builder.Services.AddScoped<IClasesRepository, ClasesRepository>();
// builder.Services.AddScoped<ClasesServices>();

// asistencias (solo Listar y Filtrar)
builder.Services.AddScoped<IAsistenciasRepository, AsistenciasRepository>();
builder.Services.AddScoped<AsistenciasServices>();

// autenticación
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<AuthServices>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// estadísticas para login
builder.Services.AddScoped<IEstadisticasRepository, EstadisticasRepository>();
builder.Services.AddScoped<EstadisticasServices>();

// horarios
builder.Services.AddScoped<IHorarioRepository, HorarioRepository>();
builder.Services.AddScoped<HorariosServices>();

// Dashboard
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<DashboardServices>();

// Configuraciones del usuario
builder.Services.AddScoped<IConfiguracionRepository, ConfiguracionRepository>();
builder.Services.AddScoped<ConfiguracionServices>();

//cors
builder.Services.AddCors(op =>
{
    op.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin();
    });
});

builder.Services.AddControllers(options =>
{
    var policy = new AuthorizationPolicyBuilder()
                     .RequireAuthenticatedUser()
                     .Build();

    options.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.AddAuthorization();

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

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
        };
    });

// Configuración del host para escuchar todas las interfaces de red
builder.WebHost.UseUrls("http://0.0.0.0:5110");

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(s => {
    s.SwaggerEndpoint("/Swagger/v1/Swagger.json", "API ASISTENCIA");
    s.RoutePrefix = string.Empty;
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();