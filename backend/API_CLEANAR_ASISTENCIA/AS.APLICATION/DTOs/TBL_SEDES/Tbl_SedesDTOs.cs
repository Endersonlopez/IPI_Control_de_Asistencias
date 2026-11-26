using System;

namespace AS.APLICATION.DTOs.TBL_SEDES
{
    public class Tbl_SedesDTOs
    {
        public int Id_Sede { get; set; }
        public int Id_Institucion { get; set; }
        public string? Nombre_Sede { get; set; }
        public int Id_Estado { get; set; }
        public int Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public int? Id_Modificador { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
    }
}
