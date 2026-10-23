using System;
using System.Collections.Generic;
using System.Text;

namespace AS.DOMINE
{
    public class Tbl_Usuarios_Roles
    {
        public int Id_Usuario_Rol { get; set; }
        public int Id_Usuario { get; set; }
        public int Id_Rol { get; set; }
        public int Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }

    }
}
