using System;

namespace AS.APLICATION.DTOs.AUTH
{
    public class SolicitudCambioResponseDTOs
    {
        public int Id_Solicitud { get; set; }
        public int Id_Usuario { get; set; }
        public string Nombre_Usuario { get; set; }
        public string Nombre_Completo { get; set; }
        public DateTime Fecha_Solicitud { get; set; }
        public string Estado { get; set; }
    }
}