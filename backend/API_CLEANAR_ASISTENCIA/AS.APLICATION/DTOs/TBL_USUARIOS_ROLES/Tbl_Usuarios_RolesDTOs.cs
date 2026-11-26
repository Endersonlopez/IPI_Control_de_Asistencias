using System;

namespace AS.APLICATION.DTOs.TBL_USUARIOS_ROLES
{
    public class Tbl_Usuarios_RolesDTOs
    {
        public int Id_Usuario_Rol { get; set; }
        public int Id_Usuario { get; set; }
        public int Id_Rol { get; set; }
        public int Id_Creador { get; set; }
        public DateTime Fecha_Creacion { get; set; }
    }
}
