using AS.APLICATION.DTOs.TBL_ASISTENCIAS;
using AS.APLICATION.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AS.PRESENTATION.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsistenciasController : ControllerBase
    {
        private readonly AsistenciasServices _services;
        private readonly AlumnosServices _alumnosServices;

        public AsistenciasController(AsistenciasServices services, AlumnosServices alumnosServices)
        {
            _services = services;
            _alumnosServices = alumnosServices;
        }

        // Listar asistencias
        [HttpGet("listar")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var res = await _services.Listar();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Filtrar asistencia
        [HttpGet("filtrar")]
        public async Task<IActionResult> Buscar(
            [FromQuery] string? buscar,
            [FromQuery] DateTime? fechaInicio,
            [FromQuery] DateTime? fechaFin)
        {
            try
            {
                var res = await _services.Filtrar(buscar, fechaInicio, fechaFin);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Insertar asistencia
        [HttpPost("insertar")]
        public async Task<IActionResult> Post([FromBody] Tbl_AsistenciasCreateDTOs dto)
        {
            try
            {
                var errors = new List<object>();

                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");
                if (dto.Id_Alumno <= 0) errors.Add(new { field = "Id_Alumno", message = "Id_Alumno inválido." });
                if (dto.Id_Materia <= 0) errors.Add(new { field = "Id_Materia", message = "Id_Materia inválido." });
                if (dto.Id_Profesor <= 0) errors.Add(new { field = "Id_Profesor", message = "Id_Profesor inválido." });
                if (dto.Id_Estado_Asistencia <= 0) errors.Add(new { field = "Id_Estado_Asistencia", message = "Id_Estado_Asistencia inválido." });
                if (dto.Id_Creador <= 0) errors.Add(new { field = "Id_Creador", message = "Id_Creador inválido." });

                if (errors.Count > 0) return BadRequest(new { message = "Error de validación.", errors });

                var id = await _services.Insertar(dto);
                return CreatedAtAction(nameof(Get), new { id }, new { message = "Asistencia registrada.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Actualizar asistencia
        [HttpPut("actualizar")]
        public async Task<IActionResult> Actualizar([FromBody] AsistenciaUpdateDTOs dto)
        {
            try
            {
                var id = await _services.ActualizarAsistencia(dto);
                if (id > 0)
                {
                    return Ok(new { message = "Asistencia actualizada exitosamente.", id = id });
                }
                return BadRequest("No se pudo actualizar la asistencia. Verifica el ID.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Eliminar asistencia
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("El ID de la asistencia es inválido.");
                if (idModificador <= 0) return BadRequest("El ID del modificador es obligatorio y debe ser válido.");

                var dto = new AsistenciaEliminarDTO
                {
                    Id_Asistencia = id,
                    Id_Modificador = idModificador
                };

                var resultId = await _services.EliminarAsistencia(dto);

                if (resultId > 0)
                {
                    return Ok(new { message = "Asistencia eliminada exitosamente.", id = resultId });
                }

                return BadRequest("No se pudo eliminar la asistencia. Verifica que el ID exista.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Registrar asistencia mediante QR
        [HttpPost("registrar-qr")]
        public async Task<IActionResult> RegistrarQR([FromBody] RegistrarQRDTOs dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.TokenQR))
                    return BadRequest("Token QR inválido.");

                var idUsuarioClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(idUsuarioClaim))
                    return Unauthorized("No se pudo identificar al usuario.");

                int idUsuario = int.Parse(idUsuarioClaim);
                int idAlumno = await _alumnosServices.ObtenerIdAlumnoPorUsuario(idUsuario);
                if (idAlumno <= 0)
                    return BadRequest("El usuario no es un alumno activo.");

                var partes = dto.TokenQR.Split('-');
                if (partes.Length < 3 || !int.TryParse(partes[1], out int idHorario))
                    return BadRequest("Formato de QR incorrecto.");

                var resultado = await _services.RegistrarQR(idHorario, idAlumno, dto.TokenQR);
                return Ok(new { message = "Asistencia registrada correctamente.", clase = resultado });
            }
            catch (SqlException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno: " + ex.Message);
            }
        }

        // Obtener estadísticas del alumno
        [HttpGet("estadisticas-alumno")]
        public async Task<IActionResult> EstadisticasAlumno()
        {
            try
            {
                var idUsuarioClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(idUsuarioClaim))
                    return Unauthorized();

                int idUsuario = int.Parse(idUsuarioClaim);
                int idAlumno = await _alumnosServices.ObtenerIdAlumnoPorUsuario(idUsuario);

                if (idAlumno <= 0)
                    return BadRequest("El usuario no es un alumno activo.");

                var stats = await _services.ObtenerEstadisticasAlumno(idAlumno);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Obtener asistencias del alumno
        [HttpGet("mis-asistencias")]
        public async Task<IActionResult> MisAsistencias()
        {
            try
            {
                var idUsuarioClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(idUsuarioClaim))
                    return Unauthorized();

                int idUsuario = int.Parse(idUsuarioClaim);
                int idAlumno = await _alumnosServices.ObtenerIdAlumnoPorUsuario(idUsuario);

                if (idAlumno <= 0)
                    return BadRequest("El usuario no es un alumno activo.");

                var asistencias = await _services.ObtenerAsistenciasPorAlumno(idAlumno);
                return Ok(asistencias);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("listar-filtrar")]
        public async Task<IActionResult> ListarFiltrar(
        [FromQuery] string? buscar,
        [FromQuery] DateTime? fechaInicio,
        [FromQuery] DateTime? fechaFin,
        [FromQuery] int? idClase,
        [FromQuery] string? estadoAsistencia)
        {
            var idUsuarioClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var rol = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
            int? idUsuario = string.IsNullOrEmpty(idUsuarioClaim) ? null : int.Parse(idUsuarioClaim);
            bool esAdmin = rol.Contains("Admin", StringComparison.OrdinalIgnoreCase);

            var idUsuarioFiltro = esAdmin ? null : idUsuario;

            var resultado = await _services.ListarFiltrar(buscar, fechaInicio, fechaFin, idClase, estadoAsistencia, idUsuarioFiltro, esAdmin);
            return Ok(resultado);
        }
    }
}