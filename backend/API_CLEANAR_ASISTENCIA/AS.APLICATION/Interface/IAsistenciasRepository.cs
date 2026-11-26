using AS.APLICATION.DTOs.TBL_ASISTENCIAS;
using AS.APLICATION.DTOs.TBL_ALUMNOS;
using AS.APLICATION.DTOs.TBL_MATERIAS;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AS.APLICATION.Interface
{
    public interface IAsistenciasRepository
    {
        Task<int> InsertAsync(Tbl_AsistenciasCreateDTOs dto);
        Task<IEnumerable<Tbl_AsistenciasDTOs>> ListAsync();
        Task<IEnumerable<Tbl_AsistenciasDTOs>> FilterAsync(string? buscar, DateTime? fechaInicio, DateTime? fechaFin);
        Task<int> ActualizarAsistencia(AsistenciaUpdateDTOs dto);
        Task<int> EliminarAsistencia(AsistenciaEliminarDTO dto);
        Task<ClaseInfoDTOs> RegistrarQRAsync(int idHorario, int idAlumno, string tokenQR);
        Task<EstadisticasAlumnoDTOs> ObtenerEstadisticasAlumnoAsync(int idAlumno);
        Task<IEnumerable<Tbl_AsistenciasDTOs>> ObtenerAsistenciasPorAlumnoAsync(int idAlumno);
        Task<IEnumerable<Tbl_AsistenciasDTOs>> ListarFiltrarAsync(
            string? buscar, DateTime? fechaInicio, DateTime? fechaFin,
            int? idClase, string? estadoAsistencia, int? idUsuario, bool esAdmin);
    }
}