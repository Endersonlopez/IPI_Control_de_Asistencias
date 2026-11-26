using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AS.APLICATION.Services;
using AS.APLICATION.DTOs.TBL_ESTADOS;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstadosController : ControllerBase
    {
        private readonly EstadosServices _Services;

        public EstadosController(EstadosServices services)
        {
            _Services = services;
        }

        // Listar estados.
        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var lista = await _Services.ListarEStado();
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Filtrar estado.
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

        //Insertar estado.
        [HttpPost("insertar")]
        public async Task<IActionResult> Insertar([FromBody] Tbl_EstadosCreateDTOs oEstado)
        {
            try
            {
                if (oEstado == null) return BadRequest("Cuerpo de la petición inválido.");
                if (string.IsNullOrWhiteSpace(oEstado.Nombre_Estado)) return BadRequest(new { message = "Nombre_Estado es obligatorio." });

                await _Services.Insertar(oEstado);
                return Ok(new { message = "Estado insertado." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Actualizar estado
        [HttpPut("actualizar")]
        public async Task<IActionResult> Editar([FromBody] Tbl_EstadosUpdateDTOs oEstado)
        {
            try
            {
                if (oEstado == null) return BadRequest("Cuerpo de la petición inválido.");
                if (oEstado.Id_Estado <= 0) return BadRequest(new { message = "Id_Estado inválido." });
                if (string.IsNullOrWhiteSpace(oEstado.Nombre_Estado)) return BadRequest(new { message = "Nombre_Estado es obligatorio." });

                await _Services.Editar(oEstado);
                return Ok(new { message = "Estado actualizado." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


    }
}
