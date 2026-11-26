using System;

namespace AS.APLICATION.DTOs.TBL_ASISTENCIAS
{
    public class Tbl_AsistenciasDTOs
    {
        public int Id_Asistencia { get; set; }
        public int Id_Alumno { get; set; }
        public string? Nombre_Alumno { get; set; }
        public int Id_Materia { get; set; }
        public string? Nombre_Materia { get; set; }
        public string? Codigo_Materia { get; set; }
        public int Id_Profesor { get; set; }
        public string? Nombre_Profesor { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }
        public int Id_Estado_Asistencia { get; set; }
        public string? Nombre_Estado_Asistencia { get; set; }
        public string? Descripcion { get; set; }
        public int Id_Estado { get; set; }
        public string? Nombre_Estado { get; set; }
        public int Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public int? Id_Modificador { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
        public string? Hora_Clase_Inicio { get; set; }
        public string? Hora_Clase_Fin { get; set; }
        public int Id_Estado_Alumno { get; set; }
        public string? Retraso { get; set; }
        public int Minutos_Retraso { get; set; }
    }
}