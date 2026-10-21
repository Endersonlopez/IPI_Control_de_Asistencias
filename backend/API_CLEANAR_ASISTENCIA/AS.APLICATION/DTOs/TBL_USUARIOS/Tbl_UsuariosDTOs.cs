using System;

namespace AS.APLICATION.DTOs.TBL_USUARIOS
{
    public class Tbl_UsuariosDTOs
    {
        public int Id_Usuario { get; set; }
        public string? Primer_Nombre { get; set; }
        public string? Segundo_Nombre { get; set; }
        public string? Primer_Apellido { get; set; }
        public string? Segundo_Apellido { get; set; }
        public string? Nombre_Usuario { get; set; }
        public string? Correo_Electronico { get; set; }
        public string? Telefono { get; set; }
        public int Id_Estado { get; set; }
        public int? Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public int? Id_Modificador { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
    }
}
