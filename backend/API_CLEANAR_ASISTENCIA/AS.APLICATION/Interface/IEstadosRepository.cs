using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Interface
{
    public interface IEstadosRepository
    {
        Task<IEnumerable<Tbl_Estados>> Listar_Estados_Async();
        Task<IEnumerable<Tbl_Estados>> Listar_Estados_X_Nombre_Async(string buscar);
        Task Nuevo_Estado_Async(Tbl_Estados oEstado);
        Task Editar_Estado_Async(Tbl_Estados oEstado);
    }
}
