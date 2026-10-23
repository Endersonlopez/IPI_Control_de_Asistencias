using AS.APLICATION.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AS.APLICATION.Interface
{
    public interface IClasesRepository
    {
        Task<IEnumerable<ClasesDto>> ObtenerClasesAsync(int idUsuario, bool esAdmin = false);
        Task<IEnumerable<AlumnoInscritoDto>> ObtenerAlumnosPorMateriaAsync(int idMateria);
        Task<IEnumerable<AlumnoInscritoDto>> ObtenerTodosAlumnosAsync();
        Task GuardarAlumnoMateriaAsync(int idMateria, int idAlumno, int? idCreador = null);
        Task EliminarAlumnoMateriaAsync(int idMateria, int idAlumno);
    }
}