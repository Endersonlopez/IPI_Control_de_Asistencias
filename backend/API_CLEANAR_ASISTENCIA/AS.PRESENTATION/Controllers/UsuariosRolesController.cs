using Microsoft.AspNetCore.Mvc;
using AS.APLICATION.Services;
using AS.APLICATION.DTOs.TBL_USUARIOS_ROLES;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosRolesController : ControllerBase
    {
        private readonly UsuariosRolesServices _Services;

        public UsuariosRolesController(UsuariosRolesServices services)
        {
            _Services = services;
        }

        // Listar usuarios roles.
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

        // Insertar usuario rol.
        [HttpPost("insertar")]
        public async Task<IActionResult> Insertar([FromBody] Tbl_Usuarios_RolesDTOs dto)
        {
            try
            {
                if (dto.Id_Usuario <= 0) return BadRequest("Id_Usuario inválido.");
                if (dto.Id_Rol <= 0) return BadRequest("Id_Rol inválido.");

                var id = await _Services.Insertar(dto);
                return CreatedAtAction(nameof(Listar), new { id }, new { message = "UsuarioRol insertado.", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
