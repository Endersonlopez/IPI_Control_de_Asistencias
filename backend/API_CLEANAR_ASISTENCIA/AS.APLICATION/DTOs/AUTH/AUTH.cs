using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.DTOs.AUTH
{
    public class LoginRequestDTO
    {
        public string Nombre_Usuario { get; set; }
        public string Contrasena { get; set; }
    }

    public class LoginResponseDTO
    {
        public int Id_Usuario { get; set; }
        public string Primer_Nombre { get; set; }
        public string Primer_Apellido { get; set; }
        public string Correo_Electronico { get; set; }
        public string Roles { get; set; }
    }
}
