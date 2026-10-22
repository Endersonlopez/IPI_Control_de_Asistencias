namespace AS.APLICATION.DTOs
{
    public class ClasesDto
    {
        public int Id_Horario { get; set; }
        public int Id_Materia { get; set; }
        public string Nombre_Materia { get; set; }
        public string Nombre_Profesor { get; set; }
        public string Codigo_Materia { get; set; }
        public int Id_Profesor { get; set; }
        public int Dia_Semana { get; set; }
        public string Nombre_Dia { get; set; }
        public string Hora_Inicio { get; set; }
        public string Hora_Fin { get; set; }
        public int Alumnos_Inscritos { get; set; }
        public int Estado_Horario { get; set; }
    }
}