using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Interface
{
    public interface IUsuariosRepository
    {
        // no-op patch: trigger file update
        Task<int> InsertarUsuarioAsync(Tbl_Usuarios usuario, string contrasenaPlain, int idRol);
        Task<IEnumerable<Tbl_Usuarios>> ListarUsuariosAsync();
        Task<IEnumerable<Tbl_Usuarios>> FiltrarUsuariosAsync(string buscar);
        Task ActualizarUsuarioAsync(Tbl_Usuarios usuario);
        Task EliminarUsuarioAsync(int idUsuario, int idModificador);
    }
}
