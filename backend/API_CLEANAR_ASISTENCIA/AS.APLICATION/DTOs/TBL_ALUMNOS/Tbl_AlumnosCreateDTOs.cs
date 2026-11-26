namespace AS.APLICATION.DTOs.TBL_ALUMNOS
{
    public class Tbl_AlumnosCreateDTOs
    {
        public int Id_Usuario { get; set; }
        public int Id_Grado { get; set; }
        public string? Documento_Identidad { get; set; }
        public int Id_Creador { get; set; }
    }
}
