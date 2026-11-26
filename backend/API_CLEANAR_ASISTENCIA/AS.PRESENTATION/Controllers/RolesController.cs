using Microsoft.AspNetCore.Mvc;
using AS.APLICATION.Services;
using AS.APLICATION.DTOs.TBL_ROLES;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly RolesServices _Services;

        public RolesController(RolesServices services)
        {
            _Services = services;
        }

        // Listar roles.
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

        // Filtrar roles.
        [HttpGet("filtrar")]
        public async Task<IActionResult> Filtrar([FromQuery] string buscar)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(buscar))
                    return BadRequest("El parámetro 'buscar' debe ser texto y no puede estar vacío.");

                if (int.TryParse(buscar, out _))
                    return BadRequest("El parámetro 'buscar' no puede ser un número, debe ser texto.");

                var lista = await _Services.Filtrar(buscar);
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Insertar roles.
        [HttpPost("insertar")]
        public async Task<IActionResult> Insertar([FromBody] Tbl_RolesCreateDTOs oRol)
        {
            try
            {
                var errors = new List<object>();

                if (string.IsNullOrWhiteSpace(oRol.Nombre_Rol))
                    errors.Add(new { field = "Nombre_Rol", message = "El campo 'Nombre_Rol' es obligatorio." });
                else if (oRol.Nombre_Rol.Length > 50)
                    errors.Add(new { field = "Nombre_Rol", message = "El campo 'Nombre_Rol' no puede exceder 50 caracteres." });

                if (string.IsNullOrWhiteSpace(oRol.Descripcion))
                    errors.Add(new { field = "Descripcion", message = "El campo 'Descripcion' es obligatorio." });
                else if (oRol.Descripcion.Length > 150)
                    errors.Add(new { field = "Descripcion", message = "El campo 'Descripcion' no puede exceder 150 caracteres." });

                // Validación de Id_Estado
                if (oRol.Id_Estado <= 0)
                    errors.Add(new { field = "Id_Estado", message = "El campo 'Id_Estado' debe ser mayor a 0." });

                // Si quieres restringir a estados válidos conocidos (ejemplo: 1=Activo, 2=Inactivo)
                var estadosValidos = new[] { 1, 2, 3, 4, 5 };
                if (!estadosValidos.Contains(oRol.Id_Estado))
                    errors.Add(new { field = "Id_Estado", message = "El campo 'Id_Estado' no corresponde a un estado válido." });

                if (errors.Any())
                    return BadRequest(new { message = "Error de validación.", errors });

                var id = await _Services.Insertar(oRol);
                return CreatedAtAction(nameof(Listar), new { id }, new { message = "Rol insertado.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Actualizar roles.
        [HttpPut("actualizar")]
        public async Task<IActionResult> Editar([FromBody] Tbl_RolesUpdateDTOs oRol)
        {
            try
            {
                var errors = new List<object>();

                if (oRol.Id_Rol <= 0)
                    errors.Add(new { field = "Id_Rol", message = "Id_Rol inválido." });

                if (string.IsNullOrWhiteSpace(oRol.Nombre_Rol))
                    errors.Add(new { field = "Nombre_Rol", message = "El campo 'Nombre_Rol' es obligatorio." });
                else if (oRol.Nombre_Rol.Length > 50)
                    errors.Add(new { field = "Nombre_Rol", message = "El campo 'Nombre_Rol' no puede exceder 50 caracteres." });

                if (string.IsNullOrWhiteSpace(oRol.Descripcion))
                    errors.Add(new { field = "Descripcion", message = "El campo 'Descripcion' es obligatorio." });
                else if (oRol.Descripcion.Length > 150)
                    errors.Add(new { field = "Descripcion", message = "El campo 'Descripcion' no puede exceder 150 caracteres." });

                // Validación de Id_Estado
                if (oRol.Id_Estado <= 0)
                    errors.Add(new { field = "Id_Estado", message = "El campo 'Id_Estado' debe ser mayor a 0." });

                var estadosValidos = new[] { 1, 2 };
                if (!estadosValidos.Contains(oRol.Id_Estado))
                    errors.Add(new { field = "Id_Estado", message = "El campo 'Id_Estado' no corresponde a un estado válido." });

                if (errors.Any())
                    return BadRequest(new { message = "Error de validación.", errors });

                await _Services.Editar(oRol);
                return Ok(new { message = "Rol actualizado." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
