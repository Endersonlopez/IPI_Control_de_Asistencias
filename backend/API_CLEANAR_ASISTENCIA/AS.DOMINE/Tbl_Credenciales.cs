using System;
using System.Collections.Generic;
using System.Text;

namespace AS.DOMINE
{
    public class Tbl_Credenciales
    {
        public int Id_Credencial { get; set; }
        public int Id_Usuario { get; set; }
        public byte[] PasswordHash { get; set; } = null!;
        public string Salt { get; set; } = null!;
        public int? Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public int? Id_Modificador { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
    }
}
