using System;

namespace AS.APLICATION.DTOs.TBL_ASISTENCIAS
{
    public class Tbl_AsistenciasCreateDTOs
    {
        public int Id_Alumno { get; set; }
        public int Id_Materia { get; set; }
        public int Id_Profesor { get; set; }
        public int Id_Estado_Asistencia { get; set; }
        public int Id_Creador { get; set; }
    }
}
