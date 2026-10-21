using System;

namespace AS.APLICATION.DTOs.TBL_ESTADOS_ASISTENCIA
{
    public class Tbl_Estados_AsistenciaDTOs
    {
        public int Id_Estado_Asistencia { get; set; }
        public string? Nombre_Estado { get; set; }
        public string? Descripcion { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
    }
}
