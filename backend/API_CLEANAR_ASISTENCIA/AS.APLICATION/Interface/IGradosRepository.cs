using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Interface
{
    public interface IGradosRepository
    {
        Task<int> Nuevo_Grado_Async(Tbl_Grados oGrado);
        Task<IEnumerable<Tbl_Grados>> Listar_Grados_Async();
        Task<IEnumerable<Tbl_Grados>> Listar_Grados_X_Busqueda_Async(string buscar);
        Task Editar_Grado_Async(Tbl_Grados oGrado);
        Task Eliminar_Grado_Async(int idGrado, int idModificador);
    }
}
