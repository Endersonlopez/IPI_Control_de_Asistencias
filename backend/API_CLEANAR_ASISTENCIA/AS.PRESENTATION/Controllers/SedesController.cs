using Microsoft.AspNetCore.Mvc;
using AS.APLICATION.Services;
using AS.APLICATION.DTOs.TBL_SEDES;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SedesController : ControllerBase
    {
        private readonly SedesServices _Services;

        public SedesController(SedesServices services)
        {
            _Services = services;
        }

        //Listar sedes.
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

        // Filtrar sede.
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

        // Insertar sede.
        [HttpPost("insertar")]
        public async Task<IActionResult> Insertar([FromBody] Tbl_SedesCreateDTOs dto)
        {
            try
            {
                var errors = new List<object>();

                if (dto.Id_Institucion <= 0)
                    errors.Add(new { field = "Id_Institucion", message = "El campo 'Id_Institucion' es obligatorio." });

                if (string.IsNullOrWhiteSpace(dto.Nombre_Sede))
                    errors.Add(new { field = "Nombre_Sede", message = "El campo 'Nombre_Sede' es obligatorio." });
                else if (dto.Nombre_Sede.Length > 150)
                    errors.Add(new { field = "Nombre_Sede", message = "El campo 'Nombre_Sede' no puede exceder 150 caracteres." });

                if (dto.Id_Creador <= 0)
                    errors.Add(new { field = "Id_Creador", message = "El campo 'Id_Creador' es obligatorio." });

                if (errors.Any())
                    return BadRequest(new { message = "Error de validación.", errors });

                var id = await _Services.Insertar(dto);
                return CreatedAtAction(nameof(Listar), new { id }, new { message = "Sede insertada.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Actualizar sede.
        [HttpPut("actualizar")]
        public async Task<IActionResult> Editar([FromBody] Tbl_SedesUpdateDTOs dto)
        {
            try
            {
                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");
                if (dto.Id_Sede <= 0) return BadRequest(new { message = "Id_Sede inválido." });

                await _Services.Editar(dto);
                return Ok(new { message = "Sede actualizada.", id = dto.Id_Sede });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Eliminar sede.
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("Id inválido.");
                if (idModificador <= 0) return BadRequest("Id_Modificador inválido.");

                await _Services.Eliminar(id, idModificador);
                return Ok(new { message = "Sede eliminada (desactivada)." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
