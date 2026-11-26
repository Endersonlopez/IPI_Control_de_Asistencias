using System.Threading.Tasks;
using AS.APLICATION.DTOs.TBL_HORARIOS;
using AS.APLICATION.Interface;

namespace AS.APLICATION.Services
{
    public class HorariosServices
    {
        private readonly IHorarioRepository _repo;

        public HorariosServices(IHorarioRepository repo)
        {
            _repo = repo;
        }

        public Task<int> Insertar(Tbl_HorariosCreateDTO dto) => _repo.InsertAsync(dto);
        public Task<int> Editar(Tbl_HorariosUpdateDTO dto) => _repo.UpdateAsync(dto);
        public Task<int> Eliminar(int id, int idModificador) => _repo.DeleteAsync(id, idModificador);
    }
}