using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.TBL_PROFESORES;
using AS.APLICATION.Services;
using Microsoft.AspNetCore.Mvc;

namespace AS.PRESENTATION.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfesoresController : ControllerBase
    {
        private readonly ProfesoresServices _services;

        public ProfesoresController(ProfesoresServices services)
        {
            _services = services;
        }

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

        [HttpPost("insertar")]
        public async Task<IActionResult> Post([FromBody] Tbl_ProfesoresCreateDTOs dto)
        {
            try
            {
                var errors = new List<object>();

                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");

                if (string.IsNullOrWhiteSpace(dto.Primer_Nombre)) errors.Add(new { field = "Primer_Nombre", message = "Primer Nombre es obligatorio." });
                if (string.IsNullOrWhiteSpace(dto.Primer_Apellido)) errors.Add(new { field = "Primer_Apellido", message = "Primer Apellido es obligatorio." });
                if (string.IsNullOrWhiteSpace(dto.Nombre_Usuario)) errors.Add(new { field = "Nombre_Usuario", message = "Nombre de Usuario es obligatorio." });
                if (string.IsNullOrWhiteSpace(dto.Correo_Electronico)) errors.Add(new { field = "Correo_Electronico", message = "Correo Electrónico es obligatorio." });
                if (string.IsNullOrWhiteSpace(dto.Facultad)) errors.Add(new { field = "Facultad", message = "Facultad es obligatoria." });
                if (dto.Id_Creador <= 0) errors.Add(new { field = "Id_Creador", message = "Id_Creador inválido." });

                if (errors.Count > 0) return BadRequest(new { message = "Error de validación.", errors });

                var id = await _services.Insertar(dto);
                return CreatedAtAction(nameof(Get), new { id }, new { message = "Profesor insertado.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPut("actualizar")]
        public async Task<IActionResult> Put([FromBody] Tbl_ProfesoresUpdateDTOs dto)
        {
            try
            {
                var errors = new List<object>();

                if (dto == null) return BadRequest("Cuerpo de la petición inválido.");

                if (dto.Id_Profesor <= 0) errors.Add(new { field = "Id_Profesor", message = "Id_Profesor inválido." });
                if (dto.Id_Usuario <= 0) errors.Add(new { field = "Id_Usuario", message = "Id_Usuario inválido." });
                if (string.IsNullOrWhiteSpace(dto.Primer_Nombre)) errors.Add(new { field = "Primer_Nombre", message = "Primer Nombre es obligatorio." });
                if (string.IsNullOrWhiteSpace(dto.Primer_Apellido)) errors.Add(new { field = "Primer_Apellido", message = "Primer Apellido es obligatorio." });
                if (dto.Id_Modificador <= 0) errors.Add(new { field = "Id_Modificador", message = "Id_Modificador inválido." });
                if (errors.Count > 0) return BadRequest(new { message = "Error de validación.", errors });

                var id = await _services.Editar(dto);
                return Ok(new { message = "Profesor actualizado.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("Id inválido.");
                if (idModificador <= 0) return BadRequest("Id_Modificador inválido.");

                var res = await _services.Eliminar(id, idModificador);
                return Ok(new { message = "Profesor desactivado correctamente.", id = res });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPut("activar/{id}")]
        public async Task<IActionResult> Activar(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("Id inválido.");
                if (idModificador <= 0) return BadRequest("Id_Modificador inválido.");

                await _services.Activar(id, idModificador);
                return Ok(new { message = "Profesor reactivado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost("registro_integral")]
        public async Task<IActionResult> RegistrarIntegral([FromBody] Tbl_ProfesoresRegistroIntegralDTOs dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new { message = "Cuerpo de la petición inválido." });

                if (string.IsNullOrWhiteSpace(dto.Nombre_Usuario) || string.IsNullOrWhiteSpace(dto.Contrasena))
                {
                    return BadRequest(new { message = "El nombre de usuario y la contraseña son obligatorios." });
                }

                var id = await _services.InsertarIntegral(dto);

                return Ok(new { message = "Profesor y usuario registrados exitosamente.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error en el servidor: " + ex.Message });
            }
        }
    }
}