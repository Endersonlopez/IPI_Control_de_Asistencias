using System;
using System.Collections.Generic;
using System.Text;

namespace AS.DOMINE
{
    public  class Tbl_Estados_Asistencia
    {
        public int Id_Estado_Asistencia { get; set; }
        public string? Nombre_Estado { get; set; }
        public string? Descripcion { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
    }
}
