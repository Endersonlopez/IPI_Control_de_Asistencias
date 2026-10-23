using AS.APLICATION.DTOs.DASHBOARD;
using System.Threading.Tasks;

namespace AS.APLICATION.Interface
{
    public interface IDashboardRepository
    {
        Task<DashboardProfesorDTOs> ObtenerDashboardProfesorAsync(int idUsuario);
    }
}