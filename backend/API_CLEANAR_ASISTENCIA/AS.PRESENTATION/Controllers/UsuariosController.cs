using Microsoft.AspNetCore.Mvc;
using AS.APLICATION.Services;
using AS.APLICATION.DTOs.TBL_USUARIOS;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly UsuariosServices _Services;

        public UsuariosController(UsuariosServices services)
        {
            _Services = services;
        }

        // Listar usuarios.
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

        // Filtrar usuario.
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

        // Insertar usuario.
        [HttpPost("insertar")]
        public async Task<IActionResult> Insertar([FromBody] Tbl_UsuariosCreateDTOs dto)
        {
            try
            {
                var errors = new List<object>();

                if (string.IsNullOrWhiteSpace(dto.Primer_Nombre))
                    errors.Add(new { field = "Primer_Nombre", message = "El campo 'Primer_Nombre' es obligatorio." });
                if (string.IsNullOrWhiteSpace(dto.Primer_Apellido))
                    errors.Add(new { field = "Primer_Apellido", message = "El campo 'Primer_Apellido' es obligatorio." });
                if (string.IsNullOrWhiteSpace(dto.Nombre_Usuario))
                    errors.Add(new { field = "Nombre_Usuario", message = "El campo 'Nombre_Usuario' es obligatorio." });
                if (string.IsNullOrWhiteSpace(dto.Contrasena))
                    errors.Add(new { field = "Contrasena", message = "El campo 'Contrasena' es obligatorio." });
                if (string.IsNullOrWhiteSpace(dto.Correo_Electronico))
                    errors.Add(new { field = "Correo_Electronico", message = "El campo 'Correo_Electronico' es obligatorio." });
                if (string.IsNullOrWhiteSpace(dto.Telefono))
                    errors.Add(new { field = "Telefono", message = "El campo 'Telefono' es obligatorio." });
                if (dto.Id_Rol <= 0)
                    errors.Add(new { field = "Id_Rol", message = "El campo 'Id_Rol' es obligatorio (ej. 2 para Profesor, 3 para Alumno)." });
                if (errors.Any())
                    return BadRequest(new { message = "Error de validación.", errors });

                var id = await _Services.Insertar(dto);
                return CreatedAtAction(nameof(Listar), new { id }, new { message = "Usuario insertado y configurado con éxito.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Actualizar usuario.
        [HttpPut("actualizar")]
        public async Task<IActionResult> Editar([FromBody] Tbl_UsuariosUpdateDTOs dto)
        {
            try
            {
                if (dto.Id_Usuario <= 0)
                    return BadRequest(new { message = "Id_Usuario inválido." });

                await _Services.Editar(dto);
                return Ok(new { message = "Usuario actualizado." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Eliminar usuario.
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id, [FromQuery] int idModificador)
        {
            try
            {
                if (id <= 0) return BadRequest("Id inválido.");
                if (idModificador <= 0) return BadRequest("Id_Modificador inválido.");

                await _Services.Eliminar(id, idModificador);
                return Ok(new { message = "Usuario eliminado (desactivado)." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
