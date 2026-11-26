using Microsoft.AspNetCore.Mvc;
using AS.APLICATION.Services;
using AS.APLICATION.DTOs.TBL_HORARIOS;
using System;
using System.Threading.Tasks;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HorariosController : ControllerBase
    {
        private readonly HorariosServices _services;

        public HorariosController(HorariosServices services)
        {
            _services = services;
        }

        [HttpPost("insertar")]
        public async Task<IActionResult> Insertar([FromBody] Tbl_HorariosCreateDTO dto)
        {
            try
            {
                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");
                if (dto.Id_Materia <= 0 || dto.Id_Profesor <= 0 || dto.Dia_Semana <= 0)
                    return BadRequest("Materia, profesor y día son obligatorios.");

                var id = await _services.Insertar(dto);
                return Ok(new { message = "Horario creado exitosamente.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPut("actualizar")]
        public async Task<IActionResult> Editar([FromBody] Tbl_HorariosUpdateDTO dto)
        {
            try
            {
                if (dto == null || dto.Id_Horario <= 0) return BadRequest("Id_Horario inválido.");

                await _services.Editar(dto);
                return Ok(new { message = "Horario actualizado." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("Id inválido.");
                if (idModificador <= 0) return BadRequest("Id_Modificador inválido.");

                await _services.Eliminar(id, idModificador);
                return Ok(new { message = "Horario desactivado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}