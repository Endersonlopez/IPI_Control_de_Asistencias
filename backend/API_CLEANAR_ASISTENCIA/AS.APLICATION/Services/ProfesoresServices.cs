using System.Collections.Generic;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.TBL_PROFESORES;
using AS.APLICATION.Interface;

namespace AS.APLICATION.Services
{
    public class ProfesoresServices
    {
        private readonly IProfesoresRepository _repo;

        public ProfesoresServices(IProfesoresRepository repo)
        {
            _repo = repo;
        }

        public Task<int> Insertar(Tbl_ProfesoresCreateDTOs dto) => _repo.InsertAsync(dto);

        public Task<IEnumerable<Tbl_ProfesoresDTOs>> Listar() => _repo.ListAsync();

        public Task<IEnumerable<Tbl_ProfesoresDTOs>> Filtrar(string buscar) => _repo.FilterAsync(buscar);

        public Task<int> Editar(Tbl_ProfesoresUpdateDTOs dto) => _repo.UpdateAsync(dto);

        public Task<int> Eliminar(int id, int idModificador) => _repo.DeleteAsync(id, idModificador);

        public Task<int> Activar(int idProfesor, int idModificador) => _repo.ActivarAsync(idProfesor, idModificador);

        public Task<int> InsertarIntegral(Tbl_ProfesoresRegistroIntegralDTOs dto) => _repo.InsertarIntegralAsync(dto);
    }
}