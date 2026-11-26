using AS.APLICATION.DTOs.AUTH;
using AS.APLICATION.Interface;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Services
{
    public class AuthServices
    {
        private readonly IAuthRepository _repo;

        public AuthServices(IAuthRepository repo)
        {
            _repo = repo;
        }

        public Task<LoginResponseDTO> Autenticar(LoginRequestDTO dto) => _repo.AutenticarAsync(dto);
        public Task SolicitarCambioContrasena(string nombreUsuario) => _repo.SolicitarCambioContrasenaAsync(nombreUsuario);
        public Task<IEnumerable<SolicitudCambioResponseDTOs>> ListarSolicitudesPendientes() => _repo.ListarSolicitudesPendientesAsync();
        public Task AsignarNuevaContrasena(int idSolicitud, string nuevaContrasena, int idAdmin) => _repo.AsignarNuevaContrasenaAsync(idSolicitud, nuevaContrasena, idAdmin);
        public Task CambiarContrasena(int idUsuario, string contrasenaActual, string contrasenaNueva) => _repo.CambiarContrasenaAsync(idUsuario, contrasenaActual, contrasenaNueva);
        public Task DescartarSolicitud(int idSolicitud, int idAdmin) => _repo.DescartarSolicitudAsync(idSolicitud, idAdmin);
    }
}
