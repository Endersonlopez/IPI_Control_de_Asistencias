using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AS.APLICATION.Services;
using AS.APLICATION.DTOs.TBL_ESTADOS_ASISTENCIA;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstadosAsistenciaController : ControllerBase
    {
        private readonly EstadosAsistenciaServices _Services;

        public EstadosAsistenciaController(EstadosAsistenciaServices services)
        {
            _Services = services;
        }

        // Listar estados asistencias.
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

        // Filtrar estado asistencia.
        [HttpGet("filtrar")]
        public async Task<IActionResult> FiltrarNombre([FromQuery] string buscar)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(buscar))
                    return BadRequest("El parámetro 'buscar' debe ser texto y no puede estar vacío.");

                var lista = await _Services.FiltrarNombre(buscar);
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Insertar estado asistencia.
        [HttpPost("insertar")]
        public async Task<IActionResult> Insertar([FromBody] Tbl_Estados_AsistenciaCreateDTOs oEstado)
        {
            try
            {
                if (oEstado == null) return BadRequest("Cuerpo de la petición inválido.");
                if (string.IsNullOrWhiteSpace(oEstado.Nombre_Estado)) return BadRequest(new { message = "Nombre_Estado es obligatorio." });

                await _Services.Insertar(oEstado);
                return Ok(new { message = "Estado de asistencia insertado." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        //Actualizar estado asistencia.
        [HttpPut("actualizar")]
        public async Task<IActionResult> Editar([FromBody] Tbl_Estados_AsistenciaUpdateDTOs oEstado)
        {
            try
            {
                if (oEstado == null) return BadRequest("Cuerpo de la petición inválido.");
                if (oEstado.Id_Estado_Asistencia <= 0) return BadRequest(new { message = "Id_Estado_Asistencia inválido." });
                if (string.IsNullOrWhiteSpace(oEstado.Nombre_Estado)) return BadRequest(new { message = "Nombre_Estado es obligatorio." });

                await _Services.Editar(oEstado);
                return Ok(new { message = "Estado de asistencia actualizado." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

    }
}
