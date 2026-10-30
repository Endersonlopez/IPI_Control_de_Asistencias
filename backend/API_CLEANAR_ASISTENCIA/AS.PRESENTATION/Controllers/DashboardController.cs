using AS.APLICATION.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AS.PRESENTATION.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardServices _dashboardServices;

        public DashboardController(DashboardServices dashboardServices)
        {
            _dashboardServices = dashboardServices;
        }

        [HttpGet("profesor")]
        public async Task<IActionResult> GetDashboardProfesor()
        {
            try
            {
                var idUsuarioClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(idUsuarioClaim))
                    return Unauthorized();

                int idUsuario = int.Parse(idUsuarioClaim);
                var resultado = await _dashboardServices.ObtenerDashboardProfesor(idUsuario);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}