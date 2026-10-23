using System;
using System.Collections.Generic;
using System.Text;

namespace AS.DOMINE
{
    public  class Tbl_Instituciones
    {
        public int Id_Institucion { get; set; }
        public string? Nombre_Institucion { get; set; }
        public int Id_Estado { get; set; }
        public int? Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public int? Id_Modificador { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }

    }
}
