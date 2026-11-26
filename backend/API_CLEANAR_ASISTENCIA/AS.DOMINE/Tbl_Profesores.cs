using System;
using System.Collections.Generic;
using System.Text;

namespace AS.DOMINE
{
    public class Tbl_Profesores
    {
        public int Id_Profesor { get; set; }
        public int Id_Usuario { get; set; }
        public string? Facultad { get; set; }
        public int Id_Estado { get; set; }
        public int Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public int? Id_Modificador { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }

    }
}
