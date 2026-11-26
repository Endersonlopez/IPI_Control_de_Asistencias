using AS.APLICATION.DTOs;
using AS.APLICATION.Interface;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClasesController : ControllerBase
    {
        private readonly IClasesRepository _clasesRepository;

        public ClasesController(IClasesRepository clasesRepository)
        {
            _clasesRepository = clasesRepository;
        }

        // Obtiene las clases asignadas a un profesor
        [HttpGet("{idUsuario}")]
        public async Task<IActionResult> ObtenerClases(int idUsuario)
        {
            var rol = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
            bool esAdmin = rol.Contains("Admin", StringComparison.OrdinalIgnoreCase) ||
                           rol.Contains("Administrador", StringComparison.OrdinalIgnoreCase);

            var clases = await _clasesRepository.ObtenerClasesAsync(idUsuario, esAdmin);
            return Ok(clases);
        }

        // Obtiene los alumnos inscritos en una materia
        [HttpGet("materia/{idMateria}/alumnos")]
        public async Task<IActionResult> ObtenerAlumnosPorMateria(int idMateria)
        {
            var alumnos = await _clasesRepository.ObtenerAlumnosPorMateriaAsync(idMateria);
            return Ok(alumnos);
        }

        // Obtiene todos los alumnos de la universidad
        [HttpGet("alumnos/todos")]
        public async Task<IActionResult> ObtenerTodosAlumnos()
        {
            var alumnos = await _clasesRepository.ObtenerTodosAlumnosAsync();
            return Ok(alumnos);
        }

        [HttpPost("materia/guardar-alumno")]
        public async Task<IActionResult> GuardarAlumnoMateria([FromBody] GuardarAlumnoMateriaDTOs dto)
        {
            try
            {
                await _clasesRepository.GuardarAlumnoMateriaAsync(dto.Id_Materia, dto.Id_Alumno, dto.Id_Creador);
                return Ok(new { mensaje = "Alumno matriculado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al inscribir alumno", detalle = ex.Message });
            }
        }

        [HttpDelete("materia/{idMateria}/alumno/{idAlumno}")]
        public async Task<IActionResult> EliminarAlumnoMateria(int idMateria, int idAlumno)
        {
            try
            {
                await _clasesRepository.EliminarAlumnoMateriaAsync(idMateria, idAlumno);
                return Ok(new { mensaje = "Alumno desinscrito correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al desinscribir alumno", detalle = ex.Message });
            }
        }
    }
}