using AS.APLICATION.DTOs.TBL_ASISTENCIAS;
using AS.APLICATION.DTOs.TBL_MATERIAS;
using AS.APLICATION.DTOs.TBL_ALUMNOS;
using AS.APLICATION.Interface;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class AsistenciasRepository : IAsistenciasRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public AsistenciasRepository(DBConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        // Insertar asistencia
        public async Task<int> InsertAsync(Tbl_AsistenciasCreateDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Asistencias_Insertar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Alumno", dto.Id_Alumno);
            cmd.Parameters.AddWithValue("@Id_Materia", dto.Id_Materia);
            cmd.Parameters.AddWithValue("@Id_Profesor", dto.Id_Profesor);
            cmd.Parameters.AddWithValue("@Id_Estado_Asistencia", dto.Id_Estado_Asistencia);
            cmd.Parameters.AddWithValue("@Id_Creador", dto.Id_Creador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
            }

            return 0;
        }

        // Justificar asistencia
        public async Task<int> JustificarAsync(int idAsistencia, int idModificador)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Asistencias_Justificar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Asistencia", idAsistencia);
            cmd.Parameters.AddWithValue("@Id_Modificador", idModificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
            }

            return 0;
        }

        // Listar asistencias
        public async Task<IEnumerable<Tbl_AsistenciasDTOs>> ListAsync()
        {
            var list = new List<Tbl_AsistenciasDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Asistencias_Listar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(MapReaderToDto(reader));
            }

            return list;
        }

        // Filtrar asistencias
        public async Task<IEnumerable<Tbl_AsistenciasDTOs>> FilterAsync(string? buscar, DateTime? fechaInicio, DateTime? fechaFin)
        {
            var list = new List<Tbl_AsistenciasDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Asistencias_Filtrar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Busqueda", (object?)buscar ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@FechaInicio", (object?)fechaInicio ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@FechaFin", (object?)fechaFin ?? DBNull.Value);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(MapReaderToDto(reader));
            }

            return list;
        }

        #region Actualizar y eliminar

        //Actualizar asistencia
        public async Task<int> ActualizarAsistencia(AsistenciaUpdateDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Asistencias_Actualizar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Asistencia", dto.Id_Asistencia);
            cmd.Parameters.AddWithValue("@Id_Alumno", dto.Id_Alumno);
            cmd.Parameters.AddWithValue("@Id_Materia", dto.Id_Materia);
            cmd.Parameters.AddWithValue("@Id_Profesor", dto.Id_Profesor);
            cmd.Parameters.AddWithValue("@Fecha", dto.Fecha);
            cmd.Parameters.AddWithValue("@Hora", dto.Hora);
            cmd.Parameters.AddWithValue("@Id_Estado_Asistencia", dto.Id_Estado_Asistencia);
            cmd.Parameters.AddWithValue("@Id_Estado", dto.Id_Estado);
            cmd.Parameters.AddWithValue("@Id_Modificador", dto.Id_Modificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
            }

            return 0;
        }

        //Eliminar asistencia (Borrado Lógico)
        public async Task<int> EliminarAsistencia(AsistenciaEliminarDTO dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Asistencias_Eliminar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Asistencia", dto.Id_Asistencia);
            cmd.Parameters.AddWithValue("@Id_Modificador", dto.Id_Modificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
            }

            return 0;
        }

        #endregion Actualizar y eliminar

        // Mapear SqlDataReader a DTO
        private Tbl_AsistenciasDTOs MapReaderToDto(SqlDataReader reader)
        {
            return new Tbl_AsistenciasDTOs
            {
                Id_Asistencia = reader.GetInt32(reader.GetOrdinal("Id_Asistencia")),
                Id_Alumno = reader.GetInt32(reader.GetOrdinal("Id_Alumno")),
                Nombre_Alumno = reader.IsDBNull(reader.GetOrdinal("Nombre_Alumno")) ? null : reader.GetString(reader.GetOrdinal("Nombre_Alumno")),
                Id_Materia = reader.GetInt32(reader.GetOrdinal("Id_Materia")),
                Nombre_Materia = reader.IsDBNull(reader.GetOrdinal("Nombre_Materia")) ? null : reader.GetString(reader.GetOrdinal("Nombre_Materia")),
                Codigo_Materia = reader.IsDBNull(reader.GetOrdinal("Codigo_Materia")) ? null : reader.GetString(reader.GetOrdinal("Codigo_Materia")),
                Id_Profesor = reader.GetInt32(reader.GetOrdinal("Id_Profesor")),
                Nombre_Profesor = reader.IsDBNull(reader.GetOrdinal("Nombre_Profesor")) ? null : reader.GetString(reader.GetOrdinal("Nombre_Profesor")),
                Fecha = reader.GetDateTime(reader.GetOrdinal("Fecha")),
                Hora = reader.GetTimeSpan(reader.GetOrdinal("Hora")),
                Id_Estado_Asistencia = reader.GetInt32(reader.GetOrdinal("Id_Estado_Asistencia")),
                Nombre_Estado_Asistencia = reader.IsDBNull(reader.GetOrdinal("Nombre_Estado_Asistencia")) ? null : reader.GetString(reader.GetOrdinal("Nombre_Estado_Asistencia")),
                Descripcion = reader.IsDBNull(reader.GetOrdinal("Descripcion")) ? null : reader.GetString(reader.GetOrdinal("Descripcion")),
                Id_Estado = reader.GetInt32(reader.GetOrdinal("Id_Estado")),
                Nombre_Estado = reader.IsDBNull(reader.GetOrdinal("Nombre_Estado")) ? null : reader.GetString(reader.GetOrdinal("Nombre_Estado")),
                Id_Creador = reader.GetInt32(reader.GetOrdinal("Id_Creador")),
                Fecha_Creacion = reader.GetDateTime(reader.GetOrdinal("Fecha_Creacion")),
                Id_Modificador = reader.IsDBNull(reader.GetOrdinal("Id_Modificador")) ? null : reader.GetInt32(reader.GetOrdinal("Id_Modificador")),
                Fecha_Modificacion = reader.IsDBNull(reader.GetOrdinal("Fecha_Modificacion")) ? null : reader.GetDateTime(reader.GetOrdinal("Fecha_Modificacion")),
                Hora_Clase_Inicio = reader.IsDBNull(reader.GetOrdinal("Hora_Clase_Inicio")) ? null : reader.GetString(reader.GetOrdinal("Hora_Clase_Inicio")),
                Hora_Clase_Fin = reader.IsDBNull(reader.GetOrdinal("Hora_Clase_Fin")) ? null : reader.GetString(reader.GetOrdinal("Hora_Clase_Fin")),
                Id_Estado_Alumno = reader.IsDBNull(reader.GetOrdinal("Id_Estado_Alumno")) ? 1 : reader.GetInt32(reader.GetOrdinal("Id_Estado_Alumno")),
                Retraso = reader.IsDBNull(reader.GetOrdinal("Retraso")) ? null : reader.GetString(reader.GetOrdinal("Retraso")),
                Minutos_Retraso = reader.IsDBNull(reader.GetOrdinal("Minutos_Retraso")) ? 0 : reader.GetInt32(reader.GetOrdinal("Minutos_Retraso"))
            };
        }

        // Registrar asistencia mediante QR
        public async Task<ClaseInfoDTOs> RegistrarQRAsync(int idHorario, int idAlumno, string tokenQR)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Asistencias_RegistrarQR", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@Id_Horario", idHorario);
            cmd.Parameters.AddWithValue("@Id_Alumno", idAlumno);
            cmd.Parameters.AddWithValue("@TokenQR", tokenQR);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new ClaseInfoDTOs
                {
                    Nombre_Materia = reader.GetString(reader.GetOrdinal("Nombre_Materia")),
                    Codigo_Materia = reader.GetString(reader.GetOrdinal("Codigo_Materia")),
                    Nombre_Profesor = reader.GetString(reader.GetOrdinal("Nombre_Profesor")),
                    Hora_Inicio = reader.GetString(reader.GetOrdinal("Hora_Inicio")),
                    Hora_Fin = reader.GetString(reader.GetOrdinal("Hora_Fin"))
                };
            }
            return null;
        }

        // Obtener estadísticas de asistencias de un alumno
        public async Task<EstadisticasAlumnoDTOs> ObtenerEstadisticasAlumnoAsync(int idAlumno)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Estadisticas_Alumno", conn) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.AddWithValue("@Id_Alumno", idAlumno);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new EstadisticasAlumnoDTOs
                {
                    TotalAsistencias = reader.GetInt32(0),
                    EsteMes = reader.GetInt32(1),
                    EstaSemana = reader.GetInt32(2)
                };
            }
            return null;
        }

        // Obtener asistencias de un alumno
        public async Task<IEnumerable<Tbl_AsistenciasDTOs>> ObtenerAsistenciasPorAlumnoAsync(int idAlumno)
        {
            var list = new List<Tbl_AsistenciasDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Asistencias_PorAlumno", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@Id_Alumno", idAlumno);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(MapReaderToDto(reader));
            }
            return list;
        }

        public async Task<IEnumerable<Tbl_AsistenciasDTOs>> ListarFiltrarAsync(
    string? buscar, DateTime? fechaInicio, DateTime? fechaFin,
    int? idClase, string? estadoAsistencia, int? idUsuario, bool esAdmin)
        {
            var list = new List<Tbl_AsistenciasDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Asistencias_ListarFiltrar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Busqueda", (object?)buscar ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@FechaInicio", (object?)fechaInicio ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@FechaFin", (object?)fechaFin ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Id_Clase", (object?)idClase ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@EstadoAsistencia", (object?)estadoAsistencia ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Id_Usuario", (object?)idUsuario ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@EsAdmin", esAdmin ? 1 : 0);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(MapReaderToDto(reader));
            }
            return list;
        }
    }
}