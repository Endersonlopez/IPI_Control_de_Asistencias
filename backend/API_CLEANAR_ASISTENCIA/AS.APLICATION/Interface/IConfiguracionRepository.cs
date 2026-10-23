using AS.APLICATION.DTOs.CONFIGURACION;
using System.Threading.Tasks;

namespace AS.APLICATION.Interface
{
    public interface IConfiguracionRepository
    {
        Task<ConfiguracionUsuarioDTOs> ObtenerAsync(int idUsuario);
        Task ActualizarAsync(int idUsuario, ConfiguracionUsuarioDTOs dto);
    }
}