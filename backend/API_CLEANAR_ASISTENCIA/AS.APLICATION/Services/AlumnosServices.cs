using System.Collections.Generic;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.TBL_ALUMNOS;
using AS.APLICATION.Interface;

namespace AS.APLICATION.Services
{
    public class AlumnosServices
    {
        private readonly IAlumnoRepository _repo;

        public AlumnosServices(IAlumnoRepository repo)
        {
            _repo = repo;
        }

        public Task<int> Insertar(Tbl_AlumnosCreateDTOs dto) => _repo.InsertAsync(dto);
        public Task<IEnumerable<Tbl_AlumnosDTOs>> Listar() => _repo.ListAsync();
        public Task<IEnumerable<Tbl_AlumnosDTOs>> Filtrar(string buscar) => _repo.FilterAsync(buscar);
        public Task<int> Editar(Tbl_AlumnosUpdateDTOs dto) => _repo.UpdateAsync(dto);
        public Task<int> Eliminar(int id, int idModificador) => _repo.DeleteAsync(id, idModificador);
        public Task<int> InsertarIntegral(Tbl_AlumnosRegistroIntegralDTOs dto) => _repo.InsertarIntegralAsync(dto);
        public Task<int> Activar(int id, int idModificador) => _repo.ActivarAsync(id, idModificador);
        public Task<int> ObtenerIdAlumnoPorUsuario(int idUsuario) => _repo.ObtenerIdAlumnoPorUsuario(idUsuario);
        public Task<Tbl_AlumnosPerfilDTOs> ObtenerPorUsuario(int idUsuario) => _repo.ObtenerPorUsuarioAsync(idUsuario);
    }
}
