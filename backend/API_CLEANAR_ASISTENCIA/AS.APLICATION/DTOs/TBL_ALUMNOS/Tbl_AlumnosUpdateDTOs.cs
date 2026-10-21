using System;

namespace AS.APLICATION.DTOs.TBL_ALUMNOS
{
    public class Tbl_AlumnosUpdateDTOs
    {
        public int Id_Alumno { get; set; }
        public int Id_Usuario { get; set; }
        public string Primer_Nombre { get; set; }
        public string? Segundo_Nombre { get; set; }
        public string Primer_Apellido { get; set; }
        public string? Segundo_Apellido { get; set; }
        public string Nombre_Usuario { get; set; }
        public string? Telefono { get; set; }
        public int Id_Grado { get; set; }
        public string? Documento_Identidad { get; set; }
        public int Id_Modificador { get; set; }
    }
}