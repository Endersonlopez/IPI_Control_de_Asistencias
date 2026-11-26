using System;
using System.Collections.Generic;
using System.Text;

namespace AS.DOMINE
{
    public class Tbl_Alumnos
    {
        public int IdAlumno { get; set; }
        public int IdUsuario { get; set; }
        public int IdGrado { get; set; }
        public string? DocumentoIdentidad { get; set; }
        public int IdEstado { get; set; }
        public int IdCreador { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int? IdModificador { get; set; }
        public DateTime? FechaModificacion { get; set; }
    }
}
