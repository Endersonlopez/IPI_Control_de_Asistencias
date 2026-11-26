using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.TBL_MATERIAS;
using AS.APLICATION.Interface;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class MateriasRepository : IMateriasRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public MateriasRepository(DBConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<(int IdGenerado, string CodigoGenerado)> InsertAsync(Tbl_MateriasCreateDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_CATALOGOS.sp_Materias_Insertar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Nombre_Materia", dto.Nombre_Materia);
            cmd.Parameters.AddWithValue("@Id_Creador", dto.Id_Creador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var id = reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
                var codigo = reader.IsDBNull(1) ? string.Empty : reader.GetString(1);
                return (id, codigo);
            }

            return (0, string.Empty);
        }

        public async Task<IEnumerable<Tbl_MateriasDTOs>> ListAsync()
        {
            var list = new List<Tbl_MateriasDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_CATALOGOS.sp_Materias_Listar", conn)
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

        public async Task<IEnumerable<Tbl_MateriasDTOs>> FilterAsync(string busqueda)
        {
            var list = new List<Tbl_MateriasDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_CATALOGOS.sp_Materias_Filtrar", conn)
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

        public async Task<int> UpdateAsync(Tbl_MateriasUpdateDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_CATALOGOS.sp_Materias_Actualizar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Materia", dto.Id_Materia);
            cmd.Parameters.AddWithValue("@Nombre_Materia", dto.Nombre_Materia);
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

        public async Task<int> DeleteAsync(int idMateria, int idModificador)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_CATALOGOS.sp_Materias_Eliminar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Materia", idMateria);
            cmd.Parameters.AddWithValue("@Id_Modificador", idModificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
            }

            return 0;
        }

        private Tbl_MateriasDTOs MapReaderToDto(SqlDataReader reader)
        {
            return new Tbl_MateriasDTOs
            {
                Id_Materia = reader.GetInt32(reader.GetOrdinal("Id_Materia")),
                Nombre_Materia = reader.GetString(reader.GetOrdinal("Nombre_Materia")),
                Codigo_Materia = reader.GetString(reader.GetOrdinal("Codigo_Materia")),
                Id_Estado = reader.GetInt32(reader.GetOrdinal("Id_Estado")),
                Nombre_Estado = reader.GetString(reader.GetOrdinal("Nombre_Estado")),
                Nombre_Creador = reader.IsDBNull(reader.GetOrdinal("Nombre_Creador")) ? null : reader.GetString(reader.GetOrdinal("Nombre_Creador")),
                Nombre_Modificador = reader.IsDBNull(reader.GetOrdinal("Nombre_Modificador")) ? null : reader.GetString(reader.GetOrdinal("Nombre_Modificador")),
                Id_Creador = reader.GetInt32(reader.GetOrdinal("Id_Creador")),
                Fecha_Creacion = reader.GetDateTime(reader.GetOrdinal("Fecha_Creacion")),
                Id_Modificador = reader.IsDBNull(reader.GetOrdinal("Id_Modificador")) ? null : reader.GetInt32(reader.GetOrdinal("Id_Modificador")),
                Fecha_Modificacion = reader.IsDBNull(reader.GetOrdinal("Fecha_Modificacion")) ? null : reader.GetDateTime(reader.GetOrdinal("Fecha_Modificacion"))
            };
        }
    }
}
