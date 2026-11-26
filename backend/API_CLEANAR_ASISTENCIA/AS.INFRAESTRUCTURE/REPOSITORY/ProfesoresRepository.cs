using AS.APLICATION.DTOs.TBL_PROFESORES;
using AS.APLICATION.Interface;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class ProfesoresRepository : IProfesoresRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public ProfesoresRepository(DBConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }
        
        public async Task<int> InsertAsync(Tbl_ProfesoresCreateDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Profesores_Insertar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Primer_Nombre", dto.Primer_Nombre ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Segundo_Nombre", string.IsNullOrWhiteSpace(dto.Segundo_Nombre) ? (object)DBNull.Value : dto.Segundo_Nombre);
            cmd.Parameters.AddWithValue("@Primer_Apellido", dto.Primer_Apellido ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Segundo_Apellido", string.IsNullOrWhiteSpace(dto.Segundo_Apellido) ? (object)DBNull.Value : dto.Segundo_Apellido);
            cmd.Parameters.AddWithValue("@Nombre_Usuario", dto.Nombre_Usuario ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Correo_Electronico", dto.Correo_Electronico ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Telefono", dto.Telefono ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Facultad", dto.Facultad ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Id_Estado", 1);
            cmd.Parameters.AddWithValue("@Id_Creador", dto.Id_Creador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
            }

            return 0;
        }

        public async Task<IEnumerable<Tbl_ProfesoresDTOs>> ListAsync()
        {
            var list = new List<Tbl_ProfesoresDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Profesores_Listar", conn)
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

        public async Task<IEnumerable<Tbl_ProfesoresDTOs>> FilterAsync(string busqueda)
        {
            var list = new List<Tbl_ProfesoresDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Profesores_Filtrar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Busqueda", string.IsNullOrWhiteSpace(busqueda) ? (object)DBNull.Value : busqueda);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(MapReaderToDto(reader));
            }

            return list;
        }

        public async Task<int> UpdateAsync(Tbl_ProfesoresUpdateDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Profesores_Actualizar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Profesor", dto.Id_Profesor);
            cmd.Parameters.AddWithValue("@Id_Usuario", dto.Id_Usuario);
            cmd.Parameters.AddWithValue("@Primer_Nombre", dto.Primer_Nombre);
            cmd.Parameters.AddWithValue("@Segundo_Nombre", (object)dto.Segundo_Nombre ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Primer_Apellido", dto.Primer_Apellido);
            cmd.Parameters.AddWithValue("@Segundo_Apellido", (object)dto.Segundo_Apellido ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Nombre_Usuario", dto.Nombre_Usuario);
            cmd.Parameters.AddWithValue("@Correo_Electronico", dto.Correo_Electronico);
            cmd.Parameters.AddWithValue("@Telefono", (object)dto.Telefono ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Facultad", dto.Facultad);
            cmd.Parameters.AddWithValue("@Id_Modificador", dto.Id_Modificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
            }
            return 0;
        }

        public async Task<int> DeleteAsync(int idProfesor, int idModificador)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Profesores_Eliminar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Profesor", idProfesor);
            cmd.Parameters.AddWithValue("@Id_Estado_Inactivo", 2);
            cmd.Parameters.AddWithValue("@Id_Modificador", idModificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
            }

            return 0;
        }

        public async Task<int> ActivarAsync(int idProfesor, int idModificador)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Profesores_Activar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Profesor", idProfesor);
            cmd.Parameters.AddWithValue("@Id_Modificador", idModificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
            }

            return 0;
        }

        public async Task<int> InsertarIntegralAsync(Tbl_ProfesoresRegistroIntegralDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Profesores_Registrar_Integral", conn)
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
            cmd.Parameters.AddWithValue("@Facultad", dto.Facultad);
            cmd.Parameters.AddWithValue("@Contrasena", dto.Contrasena);
            cmd.Parameters.AddWithValue("@Id_Creador", dto.Id_Creador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
            }
            return 0;
        }

        private Tbl_ProfesoresDTOs MapReaderToDto(SqlDataReader reader)
        {
            return new Tbl_ProfesoresDTOs
            {
                Id_Profesor = reader.GetInt32(reader.GetOrdinal("Id_Profesor")),
                Id_Usuario = reader.GetInt32(reader.GetOrdinal("Id_Usuario")),
                Primer_Nombre = reader.GetString(reader.GetOrdinal("Primer_Nombre")),
                Segundo_Nombre = reader.IsDBNull(reader.GetOrdinal("Segundo_Nombre")) ? null : reader.GetString(reader.GetOrdinal("Segundo_Nombre")),
                Primer_Apellido = reader.GetString(reader.GetOrdinal("Primer_Apellido")),
                Segundo_Apellido = reader.IsDBNull(reader.GetOrdinal("Segundo_Apellido")) ? null : reader.GetString(reader.GetOrdinal("Segundo_Apellido")),
                Nombre_Completo = reader.GetString(reader.GetOrdinal("Nombre_Completo")),
                Nombre_Usuario = reader.GetString(reader.GetOrdinal("Nombre_Usuario")),
                Correo_Electronico = reader.GetString(reader.GetOrdinal("Correo_Electronico")),
                Telefono = reader.GetString(reader.GetOrdinal("Telefono")),
                Facultad = reader.GetString(reader.GetOrdinal("Facultad")),
                Id_Estado = reader.GetInt32(reader.GetOrdinal("Id_Estado")),
                Nombre_Estado = reader.GetString(reader.GetOrdinal("Nombre_Estado")),
                Fecha_Creacion = reader.GetDateTime(reader.GetOrdinal("Fecha_Creacion"))
            };
        }
    }
}