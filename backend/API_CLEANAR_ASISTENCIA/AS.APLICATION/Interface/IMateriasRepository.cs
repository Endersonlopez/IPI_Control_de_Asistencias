using System.Collections.Generic;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.TBL_MATERIAS;

namespace AS.APLICATION.Interface
{
    public interface IMateriasRepository
    {
        Task<(int IdGenerado, string CodigoGenerado)> InsertAsync(Tbl_MateriasCreateDTOs dto);
        Task<IEnumerable<Tbl_MateriasDTOs>> ListAsync();
        Task<IEnumerable<Tbl_MateriasDTOs>> FilterAsync(string busqueda);
        Task<int> UpdateAsync(Tbl_MateriasUpdateDTOs dto);
        Task<int> DeleteAsync(int idMateria, int idModificador);
    }
}
