using System;
using System.Data;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.TBL_HORARIOS;
using AS.APLICATION.Interface;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class HorarioRepository : IHorarioRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public HorarioRepository(DBConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<int> InsertAsync(Tbl_HorariosCreateDTO dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Horarios_Insertar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Materia", dto.Id_Materia);
            cmd.Parameters.AddWithValue("@Id_Profesor", dto.Id_Profesor);
            cmd.Parameters.AddWithValue("@Dia_Semana", dto.Dia_Semana);
            cmd.Parameters.AddWithValue("@Hora_Inicio", TimeSpan.Parse(dto.Hora_Inicio));
            cmd.Parameters.AddWithValue("@Hora_Fin", TimeSpan.Parse(dto.Hora_Fin));
            cmd.Parameters.AddWithValue("@Id_Creador", dto.Id_Creador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
            }
            return 0;
        }

        public async Task<int> UpdateAsync(Tbl_HorariosUpdateDTO dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Horarios_Actualizar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Horario", dto.Id_Horario);
            cmd.Parameters.AddWithValue("@Id_Materia", dto.Id_Materia);
            cmd.Parameters.AddWithValue("@Id_Profesor", dto.Id_Profesor);
            cmd.Parameters.AddWithValue("@Dia_Semana", dto.Dia_Semana);
            cmd.Parameters.AddWithValue("@Hora_Inicio", TimeSpan.Parse(dto.Hora_Inicio));
            cmd.Parameters.AddWithValue("@Hora_Fin", TimeSpan.Parse(dto.Hora_Fin));
            cmd.Parameters.AddWithValue("@Id_Estado", dto.Id_Estado);
            cmd.Parameters.AddWithValue("@Id_Modificador", dto.Id_Modificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
            }
            return 0;
        }

        public async Task<int> DeleteAsync(int idHorario, int idModificador)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_GENERAL.sp_Horarios_Eliminar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Id_Horario", idHorario);
            cmd.Parameters.AddWithValue("@Id_Modificador", idModificador);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.IsDBNull(0) ? 0 : Convert.ToInt32(reader.GetValue(0));
            }
            return 0;
        }
    }
}