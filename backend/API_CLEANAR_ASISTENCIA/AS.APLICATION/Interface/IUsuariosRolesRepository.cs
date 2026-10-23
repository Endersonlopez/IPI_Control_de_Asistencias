using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Interface
{
    public interface IUsuariosRolesRepository
    {
        Task<int> InsertarUsuarioRolAsync(Tbl_Usuarios_Roles usuarioRol);
        Task<IEnumerable<Tbl_Usuarios_Roles>> ListarUsuariosRolesAsync();
    }
}
