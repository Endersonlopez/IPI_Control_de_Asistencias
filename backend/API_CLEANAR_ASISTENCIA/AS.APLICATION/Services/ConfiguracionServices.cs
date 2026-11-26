using AS.APLICATION.DTOs.CONFIGURACION;
using AS.APLICATION.Interface;
using System.Threading.Tasks;

namespace AS.APLICATION.Services
{
    public class ConfiguracionServices
    {
        private readonly IConfiguracionRepository _repo;
        public ConfiguracionServices(IConfiguracionRepository repo) => _repo = repo;

        public Task<ConfiguracionUsuarioDTOs> Obtener(int idUsuario) => _repo.ObtenerAsync(idUsuario);
        public Task Actualizar(int idUsuario, ConfiguracionUsuarioDTOs dto) => _repo.ActualizarAsync(idUsuario, dto);
    }
}