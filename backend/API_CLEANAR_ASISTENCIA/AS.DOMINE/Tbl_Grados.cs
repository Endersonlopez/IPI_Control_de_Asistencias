using System;
using System.Collections.Generic;
using System.Text;

namespace AS.DOMINE
{
    public class Tbl_Grados
    {
        public int Id_Grado { get; set; }
        public int Id_Sede { get; set; }
        // Campo devuelto por joins
        public string? Nombre_Grado { get; set; }
        public int Id_Estado { get; set; }
        // Campo devuelto por joins
        public int Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public int? Id_Modificador { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }

    }
}
