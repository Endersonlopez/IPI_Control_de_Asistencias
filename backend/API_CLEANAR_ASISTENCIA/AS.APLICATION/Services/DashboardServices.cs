using AS.APLICATION.DTOs.DASHBOARD;
using AS.APLICATION.Interface;
using System.Threading.Tasks;

namespace AS.APLICATION.Services
{
    public class DashboardServices
    {
        private readonly IDashboardRepository _repo;

        public DashboardServices(IDashboardRepository repo)
        {
            _repo = repo;
        }

        public Task<DashboardProfesorDTOs> ObtenerDashboardProfesor(int idUsuario)
            => _repo.ObtenerDashboardProfesorAsync(idUsuario);
    }
}