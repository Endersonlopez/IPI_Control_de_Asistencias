using System.Threading.Tasks;
using AS.APLICATION.DTOs.ESTADISTICAS;

namespace AS.APLICATION.Interface
{
    public interface IEstadisticasRepository
    {
        Task<EstadisticasLoginDTOs> ObtenerEstadisticasLoginAsync();
    }
}