using AS.APLICATION.DTOs;
using AS.APLICATION.Interface;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class ClasesRepository : IClasesRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public ClasesRepository(DBConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<ClasesDto>> ObtenerClasesAsync(int idUsuario, bool esAdmin = false)
        {
            var list = new List<ClasesDto>();
            using var conn = _dbConnectionFactory.createconnection();

            using var cmd = new SqlCommand("SQM_GENERAL.sp_Horarios_Clases", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Usuario", idUsuario);
            cmd.Parameters.AddWithValue("@EsAdmin", esAdmin ? 1 : 0);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            int idxProfesor = -1;
            int idxEstadoHorario = -1;
            for (int i = 0; i < reader.FieldCount; i++)
            {
                string colName = reader.GetName(i);
                if (colName.Equals("Nombre_Profesor", StringComparison.OrdinalIgnoreCase))
                    idxProfesor = i;
                else if (colName.Equals("Estado_Horario", StringComparison.OrdinalIgnoreCase))
                    idxEstadoHorario = i;
            }

            while (await reader.ReadAsync())
            {
                string nombreProfesor = (idxProfesor != -1 && !reader.IsDBNull(idxProfesor))
                    ? reader.GetString(idxProfesor) : "No asignado";
                int estadoHorario = (idxEstadoHorario != -1 && !reader.IsDBNull(idxEstadoHorario))
                    ? reader.GetInt32(idxEstadoHorario) : 1;

                list.Add(new ClasesDto
                {
                    Id_Horario = reader.GetInt32(reader.GetOrdinal("Id_Horario")),
                    Id_Materia = reader.GetInt32(reader.GetOrdinal("Id_Materia")),
                    Nombre_Materia = reader.GetString(reader.GetOrdinal("Nombre_Materia")),
                    Codigo_Materia = reader.GetString(reader.GetOrdinal("Codigo_Materia")),
                    Id_Profesor = reader.GetInt32(reader.GetOrdinal("Id_Profesor")),
                    Nombre_Profesor = nombreProfesor,
                    Dia_Semana = reader.GetInt32(reader.GetOrdinal("Dia_Semana")),
                    Nombre_Dia = reader.GetString(reader.GetOrdinal("Nombre_Dia")),
                    Hora_Inicio = reader.GetString(reader.GetOrdinal("Hora_Inicio")),
                    Hora_Fin = reader.GetString(reader.GetOrdinal("Hora_Fin")),
                    Alumnos_Inscritos = reader.GetInt32(reader.GetOrdinal("Alumnos_Inscritos")),
                    Estado_Horario = estadoHorario
                });
            }

            return list;
        }

        public async Task<IEnumerable<AlumnoInscritoDto>> ObtenerAlumnosPorMateriaAsync(int idMateria)
        {
            var list = new List<AlumnoInscritoDto>();
            using var conn = _dbConnectionFactory.createconnection();

            using var cmd = new SqlCommand("SQM_GENERAL.sp_Obtener_Alumnos_Por_Materia", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Materia", idMateria);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new AlumnoInscritoDto
                {
                    Id_Alumno = reader.GetInt32(reader.GetOrdinal("Id_Alumno")),
                    Id_Usuario = reader.GetInt32(reader.GetOrdinal("Id_Usuario")),
                    Nombre_Completo = reader.GetString(reader.GetOrdinal("Nombre_Completo"))
                });
            }

            return list;
        }

        // Obtiene la lista general de todos los alumnos
        public async Task<IEnumerable<AlumnoInscritoDto>> ObtenerTodosAlumnosAsync()
        {
            var list = new List<AlumnoInscritoDto>();
            using var conn = _dbConnectionFactory.createconnection();

            using var cmd = new SqlCommand("SQM_GENERAL.sp_Obtener_Todos_Alumnos", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new AlumnoInscritoDto
                {
                    Id_Alumno = reader.GetInt32(reader.GetOrdinal("Id_Alumno")),
                    Id_Usuario = reader.GetInt32(reader.GetOrdinal("Id_Usuario")),
                    Nombre_Completo = reader.GetString(reader.GetOrdinal("Nombre_Completo"))
                });
            }

            return list;
        }

        // Inscribe un alumno a una materia
        public async Task GuardarAlumnoMateriaAsync(int idMateria, int idAlumno, int? idCreador = null)
        {
            using var conn = _dbConnectionFactory.createconnection();

            using var cmd = new SqlCommand("SQM_GENERAL.sp_Guardar_Alumnos_Materia", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Materia", idMateria);
            cmd.Parameters.AddWithValue("@Id_Alumno", idAlumno);
            cmd.Parameters.AddWithValue("@Id_Creador", (object?)idCreador ?? DBNull.Value);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        // Desinscribe un alumno de una materia
        public async Task EliminarAlumnoMateriaAsync(int idMateria, int idAlumno)
        {
            using var conn = _dbConnectionFactory.createconnection();

            using var cmd = new SqlCommand("SQM_GENERAL.sp_Eliminar_Alumno_Materia", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Materia", idMateria);
            cmd.Parameters.AddWithValue("@Id_Alumno", idAlumno);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }
    }
}