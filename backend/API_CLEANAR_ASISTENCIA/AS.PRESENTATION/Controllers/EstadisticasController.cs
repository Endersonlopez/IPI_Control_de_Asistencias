using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AS.APLICATION.Services;
using System;
using System.Threading.Tasks;

namespace AS.PRESENTATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class EstadisticasController : ControllerBase
    {
        private readonly EstadisticasServices _services;

        public EstadisticasController(EstadisticasServices services)
        {
            _services = services;
        }

        [HttpGet("login-stats")]
        public async Task<IActionResult> ObtenerStatsLogin()
        {
            try
            {
                var stats = await _services.ObtenerEstadisticasLogin();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}