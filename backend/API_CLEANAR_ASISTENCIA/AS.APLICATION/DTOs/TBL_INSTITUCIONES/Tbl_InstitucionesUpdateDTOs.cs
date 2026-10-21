using System;

namespace AS.APLICATION.DTOs.TBL_INSTITUCIONES
{
    public class Tbl_InstitucionesUpdateDTOs
    {
        public int Id_Institucion { get; set; }
        public string? Nombre_Institucion { get; set; }
        public int Id_Estado { get; set; }
        public int Id_Modificador { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
    }
}
