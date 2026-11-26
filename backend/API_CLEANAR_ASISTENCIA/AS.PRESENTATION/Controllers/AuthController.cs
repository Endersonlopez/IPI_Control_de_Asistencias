using AS.APLICATION.DTOs.AUTH;
using AS.APLICATION.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace AS.PRESENTATION.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthServices _services;
        private readonly IConfiguration _config;

        public AuthController(AuthServices services, IConfiguration config)
        {
            _services = services;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Nombre_Usuario) || string.IsNullOrWhiteSpace(dto.Contrasena))
                    return BadRequest("El usuario y la contraseña son obligatorios.");

                var usuarioAuth = await _services.Autenticar(dto);

                if (usuarioAuth == null)
                {
                    // Advertencia "No autorizado"
                    return Unauthorized(new { message = "Usuario o contraseña incorrectos, o usuario inactivo." });
                }

                string tokenString = GenerarTokenJWT(usuarioAuth);

                return Ok(new
                {
                    message = "Autenticación exitosa",
                    usuario = usuarioAuth,
                    token = tokenString
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Método que genera el token JWT
        private string GenerarTokenJWT(LoginResponseDTO usuario)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? ""));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id_Usuario.ToString()),
                new Claim(ClaimTypes.Email, usuario.Correo_Electronico ?? ""),
                new Claim(ClaimTypes.Role, usuario.Roles ?? ""),
                new Claim(ClaimTypes.Name, $"{usuario.Primer_Nombre} {usuario.Primer_Apellido}")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Solicitar cambio de contraseña (accesible sin token, desde el login)
        [AllowAnonymous]
        [HttpPost("solicitar-cambio")]
        public async Task<IActionResult> SolicitarCambio([FromBody] SolicitarCambioDTOs dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Nombre_Usuario))
                    return BadRequest("El nombre de usuario es obligatorio.");

                await _services.SolicitarCambioContrasena(dto.Nombre_Usuario);
                return Ok(new { message = "Solicitud enviada. Un administrador atenderá tu caso." });
            }
            catch (SqlException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Administrador: listar solicitudes pendientes
        [HttpGet("solicitudes-pendientes")]
        public async Task<IActionResult> SolicitudesPendientes()
        {
            try
            {
                var lista = await _services.ListarSolicitudesPendientes();
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Administrador: asignar nueva contraseña
        [HttpPost("asignar-contrasena")]
        public async Task<IActionResult> AsignarContrasena([FromBody] AsignarContrasenaDTOs dto)
        {
            try
            {
                var idAdminClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(idAdminClaim)) return Unauthorized();
                int idAdmin = int.Parse(idAdminClaim);

                await _services.AsignarNuevaContrasena(dto.Id_Solicitud, dto.Nueva_Contrasena, idAdmin);
                return Ok(new { message = "Contraseña asignada correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Usuario autenticado: cambiar contraseña
        [HttpPost("cambiar-contrasena")]
        public async Task<IActionResult> CambiarContrasena([FromBody] CambioContrasenaDTOs dto)
        {
            try
            {
                var idUsuarioClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(idUsuarioClaim)) return Unauthorized();
                int idUsuario = int.Parse(idUsuarioClaim);

                await _services.CambiarContrasena(idUsuario, dto.ContrasenaActual, dto.ContrasenaNueva);
                return Ok(new { message = "Contraseña actualizada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Administrador: descartar solicitud de cambio de contraseña
        [HttpPost("descartar-solicitud")]
        public async Task<IActionResult> DescartarSolicitud([FromBody] DescartarSolicitudDTOs dto)
        {
            try
            {
                var idAdminClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(idAdminClaim)) return Unauthorized();
                int idAdmin = int.Parse(idAdminClaim);

                await _services.DescartarSolicitud(dto.Id_Solicitud, idAdmin);
                return Ok(new { message = "Solicitud descartada." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}