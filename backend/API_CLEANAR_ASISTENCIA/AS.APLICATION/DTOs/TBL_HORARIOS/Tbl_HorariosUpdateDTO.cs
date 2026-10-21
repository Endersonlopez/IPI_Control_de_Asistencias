namespace AS.APLICATION.DTOs.TBL_HORARIOS
{
    public class Tbl_HorariosUpdateDTO
    {
        public int Id_Horario { get; set; }
        public int Id_Materia { get; set; }
        public int Id_Profesor { get; set; }
        public int Dia_Semana { get; set; }
        public string Hora_Inicio { get; set; }
        public string Hora_Fin { get; set; }
        public int Id_Estado { get; set; }
        public int Id_Modificador { get; set; }
    }
}