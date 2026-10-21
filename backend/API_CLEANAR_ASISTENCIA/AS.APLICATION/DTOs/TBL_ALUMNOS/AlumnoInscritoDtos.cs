namespace AS.APLICATION.DTOs
{
    public class AlumnoInscritoDto
    {
        public int Id_Alumno { get; set; }
        public int Id_Usuario { get; set; }
        public string Nombre_Completo { get; set; } = string.Empty;
    }
}