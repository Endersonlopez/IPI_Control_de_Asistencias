using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Interface
{
    public interface ISedesRepository
    {
        Task<int> Nuevo_Sede_Async(Tbl_Sedes oSede);
        Task<IEnumerable<Tbl_Sedes>> Listar_Sedes_Async();
        Task<IEnumerable<Tbl_Sedes>> Listar_Sedes_X_Busqueda_Async(string buscar);
        Task Editar_Sede_Async(Tbl_Sedes oSede);
        Task Eliminar_Sede_Async(int idSede, int idModificador);
    }
}
