using System;

namespace AS.APLICATION.DTOs.DASHBOARD
{
    public class AsistenciaDashboardDTOs
    {
        public int Id_Asistencia { get; set; }
        public int Id_Alumno { get; set; }
        public string Nombre_Alumno { get; set; }
        public string Nombre_Materia { get; set; }
        public string Codigo_Materia { get; set; }
        public string Nombre_Profesor { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }
        public string Nombre_Estado_Asistencia { get; set; }
        public string Hora_Clase_Inicio { get; set; }
        public string Hora_Clase_Fin { get; set; }
    }
}