namespace AS.APLICATION.DTOs.TBL_PROFESORES
{
    public class Tbl_ProfesoresCreateDTOs
    {
        public string Primer_Nombre { get; set; } = string.Empty;
        public string? Segundo_Nombre { get; set; }
        public string Primer_Apellido { get; set; } = string.Empty;
        public string? Segundo_Apellido { get; set; }
        public string Nombre_Usuario { get; set; } = string.Empty;
        public string Correo_Electronico { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Facultad { get; set; } = string.Empty;
        public int Id_Creador { get; set; }
    }
}