namespace AS.APLICATION.DTOs.TBL_PROFESORES
{
    public class Tbl_ProfesoresDTOs
    {
        public int Id_Profesor { get; set; }
        public int Id_Usuario { get; set; }
        public string Primer_Nombre { get; set; } = string.Empty;
        public string? Segundo_Nombre { get; set; }
        public string Primer_Apellido { get; set; } = string.Empty;
        public string? Segundo_Apellido { get; set; }
        public string Nombre_Completo { get; set; } = string.Empty;
        public string Nombre_Usuario { get; set; } = string.Empty;
        public string Correo_Electronico { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Facultad { get; set; } = string.Empty;
        public int Id_Estado { get; set; }
        public string Nombre_Estado { get; set; } = string.Empty;
        public DateTime Fecha_Creacion { get; set; }
    }
}