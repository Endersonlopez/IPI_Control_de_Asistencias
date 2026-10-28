using System.Data;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.ESTADISTICAS;
using AS.APLICATION.Interface;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class EstadisticasRepository : IEstadisticasRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public EstadisticasRepository(DBConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<EstadisticasLoginDTOs> ObtenerEstadisticasLoginAsync()
        {
            var dto = new EstadisticasLoginDTOs { TotalAlumnos = 0, TotalRegistros = 0 };

            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Estadisticas_Login", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                dto.TotalAlumnos = reader.GetInt32(reader.GetOrdinal("TotalAlumnos"));
                dto.TotalRegistros = reader.GetInt32(reader.GetOrdinal("TotalRegistros"));
                dto.TotalProfesores = reader.GetInt32(reader.GetOrdinal("TotalProfesores"));
            }

            return dto;
        }
    }
}