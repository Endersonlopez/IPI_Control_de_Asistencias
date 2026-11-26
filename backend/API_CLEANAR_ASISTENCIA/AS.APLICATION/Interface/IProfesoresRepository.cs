using AS.APLICATION.DTOs.TBL_PROFESORES;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AS.APLICATION.Interface
{
    public interface IProfesoresRepository
    {
        Task<int> InsertAsync(Tbl_ProfesoresCreateDTOs dto);
        Task<IEnumerable<Tbl_ProfesoresDTOs>> ListAsync();
        Task<IEnumerable<Tbl_ProfesoresDTOs>> FilterAsync(string busqueda);
        Task<int> UpdateAsync(Tbl_ProfesoresUpdateDTOs dto);
        Task<int> DeleteAsync(int idProfesor, int idModificador);
        Task<int> ActivarAsync(int idProfesor, int idModificador);
        Task<int> InsertarIntegralAsync(Tbl_ProfesoresRegistroIntegralDTOs dto);
    }
}