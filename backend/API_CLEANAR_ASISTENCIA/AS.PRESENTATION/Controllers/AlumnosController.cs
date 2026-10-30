using AS.APLICATION.DTOs.TBL_ALUMNOS;
using AS.APLICATION.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlumnosController : ControllerBase
    {
        private readonly AlumnosServices _services;

        public AlumnosController(AlumnosServices services)
        {
            _services = services;
        }

        // Listar alumnos
        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var lista = await _services.Listar();
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Filtrar alumno
        [HttpGet("filtrar")]
        public async Task<IActionResult> FiltrarAlumnos([FromQuery] string buscar)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(buscar))
                    return BadRequest("El parámetro 'buscar' debe ser texto y no puede estar vacío.");

                var lista = await _services.Filtrar(buscar);
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        // Insertar alumno
        [HttpPost("insertar")]
        public async Task<IActionResult> Insertar([FromBody] Tbl_AlumnosCreateDTOs dto)
        {
            try
            {
                var errors = new List<object>();

                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");
                if (dto.Id_Usuario <= 0) errors.Add(new { field = "Id_Usuario", message = "Id_Usuario inválido." });
                if (dto.Id_Grado <= 0) errors.Add(new { field = "Id_Grado", message = "Id_Grado inválido." });
                if (string.IsNullOrWhiteSpace(dto.Documento_Identidad)) errors.Add(new { field = "Documento_Identidad", message = "Documento_Identidad es obligatorio." });
                if (dto.Id_Creador <= 0) errors.Add(new { field = "Id_Creador", message = "Id_Creador inválido." });

                if (errors.Count > 0) return BadRequest(new { message = "Error de validación.", errors });

                var id = await _services.Insertar(dto);
                return CreatedAtAction(nameof(Listar), new { id }, new { message = "Alumno insertado.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Actualizar alumno
        [HttpPut("actualizar")]
        public async Task<IActionResult> Editar([FromBody] Tbl_AlumnosUpdateDTOs dto)
        {
            try
            {
                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");
                if (dto.Id_Alumno <= 0) return BadRequest(new { message = "Id_Alumno inválido." });

                await _services.Editar(dto);
                return Ok(new { message = "Alumno actualizado." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Eliminar alumno
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("Id inválido.");
                if (idModificador <= 0) return BadRequest("Id_Modificador inválido.");

                await _services.Eliminar(id, idModificador);
                return Ok(new { message = "Alumno desactivado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Registro integral de usuario y alumno
        [HttpPost("registro_integral")]
        public async Task<IActionResult> RegistrarIntegral([FromBody] Tbl_AlumnosRegistroIntegralDTOs dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Cuerpo de la petición inválido." });

                if (string.IsNullOrWhiteSpace(dto.Nombre_Usuario) || string.IsNullOrWhiteSpace(dto.Documento_Identidad))
                {
                    return BadRequest(new { message = "El nombre de usuario y documento de identidad son obligatorios." });
                }

                if (dto.Id_Grado <= 0)
                    return BadRequest(new { message = "Debe seleccionar un grado válido." });

                var id = await _services.InsertarIntegral(dto);

                return Ok(new { message = "Alumno y usuario registrados exitosamente.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error en el servidor: " + ex.Message });
            }
        }

        // Activar alumno
        [HttpPut("activar/{id}")]
        public async Task<IActionResult> Activar(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("Id inválido.");
                if (idModificador <= 0) return BadRequest("Id_Modificador inválido.");

                await _services.Activar(id, idModificador);
                return Ok(new { message = "Alumno reactivado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Obtener perfil del alumno autenticado.
        [HttpGet("perfil")]
        public async Task<IActionResult> Perfil()
        {
            try
            {
                var idUsuarioClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(idUsuarioClaim)) return Unauthorized();
                int idUsuario = int.Parse(idUsuarioClaim);
                var alumno = await _services.ObtenerPorUsuario(idUsuario);
                if (alumno == null) return NotFound();
                return Ok(new { alumno.Primer_Nombre, alumno.Primer_Apellido, alumno.Correo_Electronico, alumno.Telefono });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}