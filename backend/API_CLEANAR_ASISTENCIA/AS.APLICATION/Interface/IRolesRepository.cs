using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Interface
{
    public interface IRolesRepository
    {
        Task<IEnumerable<Tbl_Roles>> Listar_Roles_Async();
        Task<IEnumerable<Tbl_Roles>> Listar_Roles_X_Busqueda_Async(string buscar);
        Task<int> Nuevo_Rol_Async(Tbl_Roles oRol);
        Task Editar_Rol_Async(Tbl_Roles oRol);
    }
}
