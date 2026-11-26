using AS.APLICATION.DTOs.CONFIGURACION;
using AS.APLICATION.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AS.PRESENTATION.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfiguracionController : ControllerBase
    {
        private readonly ConfiguracionServices _services;
        public ConfiguracionController(ConfiguracionServices services) => _services = services;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(idClaim)) return Unauthorized();
            int idUsuario = int.Parse(idClaim);
            var config = await _services.Obtener(idUsuario);
            return Ok(config);
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] ConfiguracionUsuarioDTOs dto)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(idClaim)) return Unauthorized();
            int idUsuario = int.Parse(idClaim);
            await _services.Actualizar(idUsuario, dto);
            return Ok(new { message = "Configuración actualizada." });
        }
    }
}