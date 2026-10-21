using System;

namespace AS.APLICATION.DTOs.TBL_MATERIAS
{
    public class Tbl_MateriasUpdateDTOs
    {
        public int Id_Materia { get; set; }
        public string? Nombre_Materia { get; set; }
        public int Id_Estado { get; set; }
        public int Id_Modificador { get; set; }
    }
}
