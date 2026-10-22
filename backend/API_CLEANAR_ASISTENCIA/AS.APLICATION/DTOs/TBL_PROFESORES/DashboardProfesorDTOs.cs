using System.Collections.Generic;

namespace AS.APLICATION.DTOs.DASHBOARD
{
    public class DashboardProfesorDTOs
    {
        public List<AlumnoDashboardDTOs> Alumnos { get; set; }
        public List<AsistenciaDashboardDTOs> Asistencias { get; set; }
    }
}