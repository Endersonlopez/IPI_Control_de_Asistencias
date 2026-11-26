using AS.APLICATION.DTOs.CONFIGURACION;
using AS.APLICATION.Interface;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class ConfiguracionRepository : IConfiguracionRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public ConfiguracionRepository(DBConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<ConfiguracionUsuarioDTOs> ObtenerAsync(int idUsuario)
        {
            using var conn = _dbConnectionFactory.createconnection();
            await conn.OpenAsync();

            // Intentar insertar el registro
            try
            {
                using var cmdInsert = new SqlCommand(
                    "INSERT INTO SQM_SEGURIDAD.Tbl_Configuracion_Usuario (Id_Usuario) VALUES (@Id_Usuario)", conn);
                cmdInsert.Parameters.Add("@Id_Usuario", System.Data.SqlDbType.Int).Value = idUsuario;
                await cmdInsert.ExecuteNonQueryAsync();
            }
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
            {
                // Ya existe, ignoramos
            }

            // Leer configuración
            using var cmdSelect = new SqlCommand(
                "SELECT Tiempo_QR, Notificaciones_Activas FROM SQM_SEGURIDAD.Tbl_Configuracion_Usuario WHERE Id_Usuario = @Id_Usuario", conn);
            cmdSelect.Parameters.Add("@Id_Usuario", System.Data.SqlDbType.Int).Value = idUsuario;

            using var reader = await cmdSelect.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new ConfiguracionUsuarioDTOs
                {
                    Tiempo_QR = reader.IsDBNull(0) ? 30 : reader.GetInt32(0),
                    Notificaciones_Activas = reader.IsDBNull(1) ? true : reader.GetBoolean(1)
                };
            }

            // fallback
            return new ConfiguracionUsuarioDTOs { Tiempo_QR = 30, Notificaciones_Activas = true };
        }

        public async Task ActualizarAsync(int idUsuario, ConfiguracionUsuarioDTOs dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            await conn.OpenAsync();

            // Asegurar existencia
            await ObtenerAsync(idUsuario);

            using var cmdUpdate = new SqlCommand(
                @"UPDATE SQM_SEGURIDAD.Tbl_Configuracion_Usuario
                  SET Tiempo_QR = @Tiempo_QR,
                      Notificaciones_Activas = @Notificaciones_Activas
                  WHERE Id_Usuario = @Id_Usuario", conn);

            cmdUpdate.Parameters.Add("@Id_Usuario", System.Data.SqlDbType.Int).Value = idUsuario;
            cmdUpdate.Parameters.Add("@Tiempo_QR", System.Data.SqlDbType.Int).Value = dto.Tiempo_QR;
            cmdUpdate.Parameters.Add("@Notificaciones_Activas", System.Data.SqlDbType.Bit).Value = dto.Notificaciones_Activas;

            await cmdUpdate.ExecuteNonQueryAsync();
        }
    }
}
