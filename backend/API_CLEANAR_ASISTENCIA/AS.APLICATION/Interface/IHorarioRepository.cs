using System.Collections.Generic;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.TBL_HORARIOS;

namespace AS.APLICATION.Interface
{
    public interface IHorarioRepository
    {
        Task<int> InsertAsync(Tbl_HorariosCreateDTO dto);
        Task<int> UpdateAsync(Tbl_HorariosUpdateDTO dto);
        Task<int> DeleteAsync(int idHorario, int idModificador);
    }
}