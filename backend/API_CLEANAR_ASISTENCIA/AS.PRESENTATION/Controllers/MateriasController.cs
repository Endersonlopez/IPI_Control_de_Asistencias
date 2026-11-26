using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using AS.APLICATION.DTOs.TBL_MATERIAS;
using AS.APLICATION.Services;
using Microsoft.AspNetCore.Mvc;

namespace AS.PRESENTATION.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MateriasController : ControllerBase
    {
        private readonly MateriasServices _services;

        public MateriasController(MateriasServices services)
        {
            _services = services;
        }

        // Listar materias.
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

        // Filtrar materia.
        [HttpGet("filtrar")]
        public async Task<IActionResult> Buscar([FromQuery] string Nombre)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(Nombre))
                    return BadRequest("El parámetro 'Nombre' debe ser texto y no puede estar vacío.");

                var res = await _services.Filtrar(Nombre);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Insertar materia.
        [HttpPost("insertar")]
        public async Task<IActionResult> Post([FromBody] Tbl_MateriasCreateDTOs dto)
        {
            try
            {
                var errors = new List<object>();

                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");
                if (string.IsNullOrWhiteSpace(dto.Nombre_Materia)) errors.Add(new { field = "Nombre_Materia", message = "Nombre_Materia es obligatorio." });
                if (dto.Id_Creador <= 0) errors.Add(new { field = "Id_Creador", message = "Id_Creador inválido." });

                if (errors.Any()) return BadRequest(new { message = "Error de validación.", errors });

                var (id, codigo) = await _services.Insertar(dto);
                return CreatedAtAction(nameof(Get), new { id }, new { message = "Materia insertada.", id, codigo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Actualizar materia.
        [HttpPut("actualizar")]
        public async Task<IActionResult> Put([FromBody] Tbl_MateriasUpdateDTOs dto)
        {
            try
            {
                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");
                if (dto.Id_Materia <= 0) return BadRequest(new { message = "Id_Materia inválido." });

                var id = await _services.Editar(dto);
                return Ok(new { message = "Materia actualizada." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Eliminar materia.
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("Id inválido.");
                if (idModificador <= 0) return BadRequest("Id_Modificador inválido.");

                var res = await _services.Eliminar(id, idModificador);
                return Ok(new { message = "Materia desactivada correctamente.", id = res });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
