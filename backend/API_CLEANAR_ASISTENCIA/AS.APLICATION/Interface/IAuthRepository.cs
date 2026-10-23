using AS.APLICATION.DTOs.AUTH;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Interface
{
    public interface IAuthRepository
    {
        Task<LoginResponseDTO> AutenticarAsync(LoginRequestDTO dto);
        Task SolicitarCambioContrasenaAsync(string nombreUsuario);
        Task<IEnumerable<SolicitudCambioResponseDTOs>> ListarSolicitudesPendientesAsync();
        Task AsignarNuevaContrasenaAsync(int idSolicitud, string nuevaContrasena, int idAdmin);
        Task CambiarContrasenaAsync(int idUsuario, string contrasenaActual, string contrasenaNueva);
        Task DescartarSolicitudAsync(int idSolicitud, int idAdmin);
    }
}
