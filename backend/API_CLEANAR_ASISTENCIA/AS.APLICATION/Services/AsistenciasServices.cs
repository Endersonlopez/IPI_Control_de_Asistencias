using AS.APLICATION.DTOs.TBL_ALUMNOS;
using AS.APLICATION.DTOs.TBL_ASISTENCIAS;
using AS.APLICATION.DTOs.TBL_MATERIAS;
using AS.APLICATION.Interface;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AS.APLICATION.Services
{
    public class AsistenciasServices
    {
        private readonly IAsistenciasRepository _repo;

        public AsistenciasServices(IAsistenciasRepository repo)
        {
            _repo = repo;
        }

        public Task<int> Insertar(Tbl_AsistenciasCreateDTOs dto) => _repo.InsertAsync(dto);
        public Task<IEnumerable<Tbl_AsistenciasDTOs>> Listar() => _repo.ListAsync();
        public Task<IEnumerable<Tbl_AsistenciasDTOs>> Filtrar(string? buscar, DateTime? fechaInicio, DateTime? fechaFin)
            => _repo.FilterAsync(buscar, fechaInicio, fechaFin);

        public Task<int> ActualizarAsistencia(AsistenciaUpdateDTOs dto) => _repo.ActualizarAsistencia(dto);
        public Task<int> EliminarAsistencia(AsistenciaEliminarDTO dto) => _repo.EliminarAsistencia(dto);
   
        public Task<ClaseInfoDTOs> RegistrarQR(int idHorario, int idAlumno, string tokenQR)
            => _repo.RegistrarQRAsync(idHorario, idAlumno, tokenQR);

        public Task<EstadisticasAlumnoDTOs> ObtenerEstadisticasAlumno(int idAlumno)
            => _repo.ObtenerEstadisticasAlumnoAsync(idAlumno);

        public Task<IEnumerable<Tbl_AsistenciasDTOs>> ObtenerAsistenciasPorAlumno(int idAlumno)
            => _repo.ObtenerAsistenciasPorAlumnoAsync(idAlumno);

        public Task<IEnumerable<Tbl_AsistenciasDTOs>> ListarFiltrar(
            string? buscar, DateTime? fechaInicio, DateTime? fechaFin,
            int? idClase, string? estadoAsistencia, int? idUsuario, bool esAdmin)
            => _repo.ListarFiltrarAsync(buscar, fechaInicio, fechaFin, idClase, estadoAsistencia, idUsuario, esAdmin);
    }
}