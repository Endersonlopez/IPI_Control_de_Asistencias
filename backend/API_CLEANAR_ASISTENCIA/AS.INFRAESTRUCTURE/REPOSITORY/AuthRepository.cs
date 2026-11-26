using System.Data;
using System.Threading.Tasks;
using AS.APLICATION.DTOs.AUTH;
using AS.APLICATION.Interface;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public AuthRepository(DBConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        // Implementación de los métodos de la interfaz IAuthRepository
        public async Task<LoginResponseDTO> AutenticarAsync(LoginRequestDTO dto)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_SEGURIDAD.sp_Usuarios_Autenticar", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            cmd.Parameters.AddWithValue("@Nombre_Usuario", dto.Nombre_Usuario);
            cmd.Parameters.AddWithValue("@Contrasena_Intento", dto.Contrasena);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new LoginResponseDTO
                {
                    Id_Usuario = reader.GetInt32(reader.GetOrdinal("Id_Usuario")),
                    Primer_Nombre = reader.GetString(reader.GetOrdinal("Primer_Nombre")),
                    Primer_Apellido = reader.GetString(reader.GetOrdinal("Primer_Apellido")),
                    Correo_Electronico = reader.GetString(reader.GetOrdinal("Correo_Electronico")),
                    Roles = reader.GetString(reader.GetOrdinal("Roles"))
                };
            }

            return null;
        }

        // Implementación del método para solicitar cambio de contraseña
        public async Task SolicitarCambioContrasenaAsync(string nombreUsuario)
        {
            using var conn = _dbConnectionFactory.createconnection();

            using var cmd = new SqlCommand("SQM_SEGURIDAD.sp_Solicitar_Cambio_Contrasena", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@Nombre_Usuario", nombreUsuario);

            await conn.OpenAsync();

            try
            {
                await cmd.ExecuteNonQueryAsync();
            }
            catch (SqlException ex)
            {
                throw new Exception(ex.Message);
            }
        }

        // Implementación del método para listar solicitudes pendientes
        public async Task<IEnumerable<SolicitudCambioResponseDTOs>> ListarSolicitudesPendientesAsync()
        {
            var list = new List<SolicitudCambioResponseDTOs>();
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_SEGURIDAD.sp_Listar_Solicitudes_Pendientes", conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new SolicitudCambioResponseDTOs
                {
                    Id_Solicitud = reader.GetInt32(reader.GetOrdinal("Id_Solicitud")),
                    Id_Usuario = reader.GetInt32(reader.GetOrdinal("Id_Usuario")),
                    Nombre_Usuario = reader.GetString(reader.GetOrdinal("Nombre_Usuario")),
                    Nombre_Completo = reader.GetString(reader.GetOrdinal("Nombre_Completo")),
                    Fecha_Solicitud = reader.GetDateTime(reader.GetOrdinal("Fecha_Solicitud")),
                    Estado = reader.GetString(reader.GetOrdinal("Estado"))
                });
            }
            return list;
        }

        // Implementación del método para asignar nueva contraseña
        public async Task AsignarNuevaContrasenaAsync(int idSolicitud, string nuevaContrasena, int idAdmin)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_SEGURIDAD.sp_Asignar_Nueva_Contrasena", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@Id_Solicitud", idSolicitud);
            cmd.Parameters.AddWithValue("@Nueva_Contrasena", nuevaContrasena);
            cmd.Parameters.AddWithValue("@Id_Admin", idAdmin);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        // Implementación del método para cambiar contraseña
        public async Task CambiarContrasenaAsync(int idUsuario, string contrasenaActual, string contrasenaNueva)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_SEGURIDAD.sp_Usuarios_CambiarContrasena", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@Id_Usuario", idUsuario);
            cmd.Parameters.AddWithValue("@ContrasenaActual", contrasenaActual);
            cmd.Parameters.AddWithValue("@ContrasenaNueva", contrasenaNueva);

            await conn.OpenAsync();
            try
            {
                await cmd.ExecuteNonQueryAsync();
            }
            catch (SqlException ex)
            {
                throw new Exception(ex.Message);
            }
        }

        // Implementación del método para descartar solicitud
        public async Task DescartarSolicitudAsync(int idSolicitud, int idAdmin)
        {
            using var conn = _dbConnectionFactory.createconnection();
            using var cmd = new SqlCommand("SQM_SEGURIDAD.sp_Descartar_Solicitud_Cambio", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@Id_Solicitud", idSolicitud);
            cmd.Parameters.AddWithValue("@Id_Admin", idAdmin);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }
    }
}