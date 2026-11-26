using System.Threading.Tasks;
using AS.APLICATION.DTOs.ESTADISTICAS;
using AS.APLICATION.Interface;

namespace AS.APLICATION.Services
{
    public class EstadisticasServices
    {
        private readonly IEstadisticasRepository _repo;

        public EstadisticasServices(IEstadisticasRepository repo)
        {
            _repo = repo;
        }

        public Task<EstadisticasLoginDTOs> ObtenerEstadisticasLogin() => _repo.ObtenerEstadisticasLoginAsync();
    }
}