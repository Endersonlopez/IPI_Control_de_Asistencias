using System;

namespace AS.APLICATION.DTOs.TBL_ALUMNOS
{
    public class Tbl_AlumnosDTOs
    {
        public int Id_Alumno { get; set; }
        public int Id_Usuario { get; set; }
        public string? Nombre_Completo { get; set; }
        public int Id_Grado { get; set; }
        public string? Nombre_Grado { get; set; }
        public string? Correo_Electronico { get; set; }
        public string? Telefono { get; set; }
        public string? Documento_Identidad { get; set; }
        public int Id_Estado { get; set; }
        public string? Nombre_Estado { get; set; }
        public int Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public int? Id_Modificador { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
    }
}
