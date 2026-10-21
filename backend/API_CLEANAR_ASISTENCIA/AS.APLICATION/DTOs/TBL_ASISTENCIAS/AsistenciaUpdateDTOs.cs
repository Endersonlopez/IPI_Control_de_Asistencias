using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.DTOs.TBL_ASISTENCIAS
{
    public class AsistenciaUpdateDTOs
    {
        public int Id_Asistencia { get; set; }
        public int Id_Alumno { get; set; }
        public int Id_Materia { get; set; }
        public int Id_Profesor { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }
        public int Id_Estado_Asistencia { get; set; }
        public int Id_Estado { get; set; }
        public int Id_Modificador { get; set; }
    }

    public class AsistenciaEliminarDTO
    {
        public int Id_Asistencia { get; set; }
        public int Id_Modificador { get; set; }
    }
}
