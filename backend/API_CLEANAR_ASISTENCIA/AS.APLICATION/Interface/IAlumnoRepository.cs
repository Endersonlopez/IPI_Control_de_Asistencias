using System.Collections.Generic;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.TBL_ALUMNOS;

namespace AS.APLICATION.Interface
{
    public interface IAlumnoRepository
    {
        Task<int> InsertAsync(Tbl_AlumnosCreateDTOs dto);
        Task<IEnumerable<Tbl_AlumnosDTOs>> ListAsync();
        Task<IEnumerable<Tbl_AlumnosDTOs>> FilterAsync(string busqueda);
        Task<int> UpdateAsync(Tbl_AlumnosUpdateDTOs dto);
        Task<int> DeleteAsync(int idAlumno, int idModificador);
        Task<int> InsertarIntegralAsync(Tbl_AlumnosRegistroIntegralDTOs dto);
        Task<int> ActivarAsync(int idAlumno, int idModificador);
        Task<int> ObtenerIdAlumnoPorUsuario(int idUsuario);
        Task<Tbl_AlumnosPerfilDTOs> ObtenerPorUsuarioAsync(int idUsuario);
    }
}
