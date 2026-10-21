namespace AS.APLICATION.DTOs.TBL_USUARIOS
{
    public class Tbl_UsuariosCreateDTOs
    {
        public string? Primer_Nombre { get; set; }
        public string? Segundo_Nombre { get; set; }
        public string? Primer_Apellido { get; set; }
        public string? Segundo_Apellido { get; set; }
        public string? Nombre_Usuario { get; set; }
        public string? Correo_Electronico { get; set; }
        public string? Telefono { get; set; }
        public int Id_Creador { get; set; }
        public string? Contrasena { get; set; }
        public int Id_Rol {  get; set; }
    }
}
