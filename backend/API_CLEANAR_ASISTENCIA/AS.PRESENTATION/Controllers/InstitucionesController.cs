using Microsoft.AspNetCore.Mvc;
using AS.APLICATION.Services;
using AS.APLICATION.DTOs.TBL_INSTITUCIONES;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstitucionesController : ControllerBase
    {
        private readonly InstitucionesServices _Services;

        public InstitucionesController(InstitucionesServices services)
        {
            _Services = services;
        }

        // Listar instituciones
        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var lista = await _Services.Listar();
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Filtrar institución.
        [HttpGet("filtrar")]
        public async Task<IActionResult> Filtrar([FromQuery] string buscar)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(buscar))
                    return BadRequest("El parámetro 'buscar' debe ser texto y no puede estar vacío.");

                var lista = await _Services.Filtrar(buscar);
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Insertar institución.
        [HttpPost("insertar")]
        public async Task<IActionResult> Insertar([FromBody] Tbl_InstitucionesCreateDTOs dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Nombre_Institucion))
                    return BadRequest("Nombre_Institucion es obligatorio.");

                var id = await _Services.Insertar(dto);
                return CreatedAtAction(nameof(Listar), new { id }, new { message = "Institución insertada.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Actualizar institución.
        [HttpPut("actualizar")]
        public async Task<IActionResult> Editar([FromBody] Tbl_InstitucionesUpdateDTOs dto)
        {
            try
            {
                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");
                if (dto.Id_Institucion <= 0) return BadRequest(new { message = "Id_Institucion inválido." });

                var filasAfectadas = await _Services.Editar(dto);

                return Ok(new { message = "Institución actualizada.", id = dto.Id_Institucion });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        // Eliminar institución.
        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("Id inválido.");
                if (idModificador <= 0) return BadRequest("Id_Modificador inválido.");

                var filasAfectadas = await _Services.Eliminar(id, idModificador);

                return Ok(new { message = "Institución eliminada (desactivada).", id = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
