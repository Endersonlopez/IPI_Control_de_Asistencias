using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using AS.APLICATION.Interface;
using AS.APLICATION.DTOs.TBL_ALUMNOS;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class AlumnoRepository : IAlumnoRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public AlumnoRepository(DBConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        // Insertar alumno
        public async Task<int> InsertAsync(Tbl_AlumnosCreateDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Alumnos_Insertar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Usuario", dto.Id_Usuario);
            cmd.Parameters.AddWithValue("@Id_Grado", dto.Id_Grado);
            cmd.Parameters.AddWithValue("@Documento_Identidad", dto.Documento_Identidad);
            cmd.Parameters.AddWithValue("@Id_Creador", dto.Id_Creador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
            }

            return 0;
        }

        // Listar alumnos
        public async Task<IEnumerable<Tbl_AlumnosDTOs>> ListAsync()
        {
            var list = new List<Tbl_AlumnosDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Alumnos_Listar", conn)
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

        // Filtrar alumnos
        public async Task<IEnumerable<Tbl_AlumnosDTOs>> FilterAsync(string busqueda)
        {
            var list = new List<Tbl_AlumnosDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Alumnos_Filtrar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Busqueda", busqueda ?? string.Empty);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(MapReaderToDto(reader));
            }

            return list;
        }

        // Actualizar alumno
        public async Task<int> UpdateAsync(Tbl_AlumnosUpdateDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Alumnos_Actualizar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Alumno", dto.Id_Alumno);
            cmd.Parameters.AddWithValue("@Id_Usuario", dto.Id_Usuario);
            cmd.Parameters.AddWithValue("@Primer_Nombre", dto.Primer_Nombre);
            cmd.Parameters.AddWithValue("@Segundo_Nombre", (object)dto.Segundo_Nombre ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Primer_Apellido", dto.Primer_Apellido);
            cmd.Parameters.AddWithValue("@Segundo_Apellido", (object)dto.Segundo_Apellido ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Nombre_Usuario", dto.Nombre_Usuario);
            cmd.Parameters.AddWithValue("@Telefono", (object)dto.Telefono ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Id_Grado", dto.Id_Grado);
            cmd.Parameters.AddWithValue("@Documento_Identidad", dto.Documento_Identidad);
            cmd.Parameters.AddWithValue("@Id_Modificador", dto.Id_Modificador);

            await conn.OpenAsync();

            try
            {
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
                }
                return 0;
            }
            catch (SqlException ex)
            {
                throw new Exception(ex.Message);
            }
        }

        // Eliminar alumno
        public async Task<int> DeleteAsync(int idAlumno, int idModificador)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Alumnos_Eliminar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Alumno", idAlumno);
            cmd.Parameters.AddWithValue("@Id_Modificador", idModificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
            }

            return 0;
        }

        // Mapeo de datos del SqlDataReader a Tbl_AlumnosDTOs
        private Tbl_AlumnosDTOs MapReaderToDto(SqlDataReader reader)
        {
            return new Tbl_AlumnosDTOs
            {
                Id_Alumno = reader.GetInt32(reader.GetOrdinal("Id_Alumno")),
                Id_Usuario = reader.GetInt32(reader.GetOrdinal("Id_Usuario")),
                Nombre_Completo = reader.GetString(reader.GetOrdinal("Nombre_Completo")),
                Correo_Electronico = reader.IsDBNull(reader.GetOrdinal("Correo_Electronico")) ? null : reader.GetString(reader.GetOrdinal("Correo_Electronico")),
                Telefono = reader.IsDBNull(reader.GetOrdinal("Telefono")) ? null : reader.GetString(reader.GetOrdinal("Telefono")),
                Id_Grado = reader.GetInt32(reader.GetOrdinal("Id_Grado")),
                Nombre_Grado = reader.GetString(reader.GetOrdinal("Nombre_Grado")),
                Documento_Identidad = reader.GetString(reader.GetOrdinal("Documento_Identidad")),
                Id_Estado = reader.GetInt32(reader.GetOrdinal("Id_Estado")),
                Nombre_Estado = reader.GetString(reader.GetOrdinal("Nombre_Estado")),
                Id_Creador = reader.GetInt32(reader.GetOrdinal("Id_Creador")),
                Fecha_Creacion = reader.GetDateTime(reader.GetOrdinal("Fecha_Creacion")),
                Id_Modificador = reader.IsDBNull(reader.GetOrdinal("Id_Modificador")) ? null : reader.GetInt32(reader.GetOrdinal("Id_Modificador")),
                Fecha_Modificacion = reader.IsDBNull(reader.GetOrdinal("Fecha_Modificacion")) ? null : reader.GetDateTime(reader.GetOrdinal("Fecha_Modificacion"))
            };
        }

        // Insertar alumno integral
        public async Task<int> InsertarIntegralAsync(Tbl_AlumnosRegistroIntegralDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Alumnos_Registrar_Integral", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Primer_Nombre", dto.Primer_Nombre);
            cmd.Parameters.AddWithValue("@Segundo_Nombre", (object)dto.Segundo_Nombre ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Primer_Apellido", dto.Primer_Apellido);
            cmd.Parameters.AddWithValue("@Segundo_Apellido", (object)dto.Segundo_Apellido ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Nombre_Usuario", dto.Nombre_Usuario);
            cmd.Parameters.AddWithValue("@Correo_Electronico", dto.Correo_Electronico);
            cmd.Parameters.AddWithValue("@Telefono", (object)dto.Telefono ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Contrasena", dto.Contrasena);
            cmd.Parameters.AddWithValue("@Id_Rol", dto.Id_Rol);
            cmd.Parameters.AddWithValue("@Id_Grado", dto.Id_Grado);
            cmd.Parameters.AddWithValue("@Documento_Identidad", dto.Documento_Identidad);
            cmd.Parameters.AddWithValue("@Id_Creador", dto.Id_Creador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
            }

            return 0;
        }

        // Activar alumno
        public async Task<int> ActivarAsync(int idAlumno, int idModificador)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Alumnos_Activar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Alumno", idAlumno);
            cmd.Parameters.AddWithValue("@Id_Modificador", idModificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
            }

            return 0;
        }

        // Obtener Id_Alumno por Id_Usuario
        public async Task<int> ObtenerIdAlumnoPorUsuario(int idUsuario)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SELECT Id_Alumno FROM SQM_GENERAL.Tbl_Alumnos WHERE Id_Usuario = @Id_Usuario AND Id_Estado = 1", conn);
            cmd.Parameters.AddWithValue("@Id_Usuario", idUsuario);
            await conn.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return result != null ? Convert.ToInt32(result) : 0;
        }

        // Obtener perfil del alumno por Id_Usuario
        public async Task<Tbl_AlumnosPerfilDTOs> ObtenerPorUsuarioAsync(int idUsuario)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand(@"
        SELECT U.Primer_Nombre, U.Primer_Apellido, U.Correo_Electronico, U.Telefono
        FROM SQM_SEGURIDAD.Tbl_Usuarios U
        INNER JOIN SQM_GENERAL.Tbl_Alumnos A ON U.Id_Usuario = A.Id_Usuario
        WHERE U.Id_Usuario = @Id_Usuario AND A.Id_Estado = 1", conn);
            cmd.Parameters.AddWithValue("@Id_Usuario", idUsuario);
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Tbl_AlumnosPerfilDTOs
                {
                    Primer_Nombre = reader.GetString(0),
                    Primer_Apellido = reader.GetString(1),
                    Correo_Electronico = reader.GetString(2),
                    Telefono = reader.IsDBNull(3) ? null : reader.GetString(3)
                };
            }
            return null;
        }
    }
}