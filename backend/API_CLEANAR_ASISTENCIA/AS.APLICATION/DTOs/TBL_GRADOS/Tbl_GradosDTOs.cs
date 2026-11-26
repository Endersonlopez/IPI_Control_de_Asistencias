using System;

namespace AS.APLICATION.DTOs.TBL_GRADOS
{
    public class Tbl_GradosDTOs
    {
        public int Id_Grado { get; set; }
        public int Id_Sede { get; set; }
        public string? Nombre_Grado { get; set; }
        public int Id_Estado { get; set; }
        public int Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public int? Id_Modificador { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
    }
}
