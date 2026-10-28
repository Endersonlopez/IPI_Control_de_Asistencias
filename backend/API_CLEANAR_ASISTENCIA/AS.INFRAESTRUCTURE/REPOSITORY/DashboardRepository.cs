using AS.APLICATION.DTOs.DASHBOARD;
using AS.APLICATION.Interface;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public DashboardRepository(DBConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<DashboardProfesorDTOs> ObtenerDashboardProfesorAsync(int idUsuario)
        {
            var resultado = new DashboardProfesorDTOs();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Dashboard_Profesor", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@Id_Usuario", idUsuario);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            // Mapear alumnos
            var alumnos = new List<AlumnoDashboardDTOs>();
            while (await reader.ReadAsync())
            {
                alumnos.Add(new AlumnoDashboardDTOs
                {
                    Id_Alumno = reader.GetInt32(reader.GetOrdinal("Id_Alumno")),
                    Nombre_Completo = reader.GetString(reader.GetOrdinal("Nombre_Completo")),
                    Fecha_Creacion = reader.GetDateTime(reader.GetOrdinal("Fecha_Creacion"))
                });
            }
            resultado.Alumnos = alumnos;

            // Mapear asistencias
            if (await reader.NextResultAsync())
            {
                var asistencias = new List<AsistenciaDashboardDTOs>();
                while (await reader.ReadAsync())
                {
                    asistencias.Add(new AsistenciaDashboardDTOs
                    {
                        Id_Asistencia = reader.GetInt32(reader.GetOrdinal("Id_Asistencia")),
                        Id_Alumno = reader.GetInt32(reader.GetOrdinal("Id_Alumno")),
                        Nombre_Alumno = reader.GetString(reader.GetOrdinal("nombre_Alumno")),
                        Nombre_Materia = reader.GetString(reader.GetOrdinal("Nombre_Materia")),
                        Codigo_Materia = reader.GetString(reader.GetOrdinal("Codigo_Materia")),
                        Nombre_Profesor = reader.GetString(reader.GetOrdinal("nombre_Profesor")),
                        Fecha = reader.GetDateTime(reader.GetOrdinal("Fecha")),
                        Hora = reader.GetTimeSpan(reader.GetOrdinal("Hora")),
                        Nombre_Estado_Asistencia = reader.GetString(reader.GetOrdinal("nombre_Estado_Asistencia")),
                        Hora_Clase_Inicio = reader.GetString(reader.GetOrdinal("hora_Clase_Inicio")),
                        Hora_Clase_Fin = reader.GetString(reader.GetOrdinal("hora_Clase_Fin"))
                    });
                }
                resultado.Asistencias = asistencias;
            }

            return resultado;
        }
    }
}