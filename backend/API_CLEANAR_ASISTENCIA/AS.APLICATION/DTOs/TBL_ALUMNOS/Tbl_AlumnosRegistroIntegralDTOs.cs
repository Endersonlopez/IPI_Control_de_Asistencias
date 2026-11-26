namespace AS.APLICATION.DTOs.TBL_ALUMNOS
{
    public class Tbl_AlumnosRegistroIntegralDTOs
    {
        public string Primer_Nombre { get; set; }
        public string? Segundo_Nombre { get; set; }
        public string Primer_Apellido { get; set; }
        public string? Segundo_Apellido { get; set; }
        public string Nombre_Usuario { get; set; }
        public string Correo_Electronico { get; set; }
        public string Telefono { get; set; }
        public string Contrasena { get; set; }
        public int Id_Rol { get; set; }
        public int Id_Grado { get; set; }
        public string Documento_Identidad { get; set; }
        public int Id_Creador { get; set; }
    }
}