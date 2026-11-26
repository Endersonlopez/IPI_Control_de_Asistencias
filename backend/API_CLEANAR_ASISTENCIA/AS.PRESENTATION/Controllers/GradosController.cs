using Microsoft.AspNetCore.Mvc;
using AS.APLICATION.Services;
using AS.APLICATION.DTOs.TBL_GRADOS;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GradosController : ControllerBase
    {
        private readonly GradosServices _Services;

        public GradosController(GradosServices services)
        {
            _Services = services;
        }

        // Listar grados
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

        // Filtrar grado
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

        // Insertar grado
        [HttpPost("insertar")]
        public async Task<IActionResult> Insertar([FromBody] Tbl_GradosCreateDTOs dto)
        {
            try
            {
                var errors = new List<object>();

                if (dto.Id_Sede <= 0)
                    errors.Add(new { field = "Id_Sede", message = "El campo 'Id_Sede' es obligatorio." });

                if (string.IsNullOrWhiteSpace(dto.Nombre_Grado))
                    errors.Add(new { field = "Nombre_Grado", message = "El campo 'Nombre_Grado' es obligatorio." });
                else if (dto.Nombre_Grado.Length > 100)
                    errors.Add(new { field = "Nombre_Grado", message = "El campo 'Nombre_Grado' no puede exceder 100 caracteres." });

                if (dto.Id_Creador <= 0)
                    errors.Add(new { field = "Id_Creador", message = "El campo 'Id_Creador' es obligatorio." });

                if (errors.Any())
                    return BadRequest(new { message = "Error de validación.", errors });

                var id = await _Services.Insertar(dto);
                return CreatedAtAction(nameof(Listar), new { id }, new { message = "Grado insertado.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Actualizar grado
        [HttpPut("actualizar")]
        public async Task<IActionResult> Editar([FromBody] Tbl_GradosUpdateDTOs dto)
        {
            try
            {
                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");
                if (dto.Id_Grado <= 0) return BadRequest(new { message = "Id_Grado inválido." });

                await _Services.Editar(dto);
                return Ok(new { message = "Grado actualizado.", id = dto.Id_Grado });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Eliminar grado
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("Id inválido.");
                if (idModificador <= 0) return BadRequest("Id_Modificador inválido.");

                await _Services.Eliminar(id, idModificador);
                return Ok(new { message = "Grado eliminado (desactivado)." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
