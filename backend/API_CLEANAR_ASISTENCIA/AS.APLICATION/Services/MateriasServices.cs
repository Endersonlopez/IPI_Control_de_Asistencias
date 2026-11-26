using System.Collections.Generic;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.TBL_MATERIAS;
using AS.APLICATION.Interface;

namespace AS.APLICATION.Services
{
    public class MateriasServices
    {
        private readonly IMateriasRepository _repo;

        public MateriasServices(IMateriasRepository repo)
        {
            _repo = repo;
        }

        public Task<(int IdGenerado, string CodigoGenerado)> Insertar(Tbl_MateriasCreateDTOs dto) => _repo.InsertAsync(dto);

        public Task<IEnumerable<Tbl_MateriasDTOs>> Listar() => _repo.ListAsync();

        public Task<IEnumerable<Tbl_MateriasDTOs>> Filtrar(string buscar) => _repo.FilterAsync(buscar);

        public Task<int> Editar(Tbl_MateriasUpdateDTOs dto) => _repo.UpdateAsync(dto);

        public Task<int> Eliminar(int id, int idModificador) => _repo.DeleteAsync(id, idModificador);
    }
}
