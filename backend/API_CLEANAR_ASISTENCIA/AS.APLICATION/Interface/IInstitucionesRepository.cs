using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Interface
{
    public interface IInstitucionesRepository
    {
        Task<int> InsertarInstitucionAsync(Tbl_Instituciones institucion, int idCreador);
        Task<IEnumerable<Tbl_Instituciones>> ListarInstitucionesAsync();
        Task<IEnumerable<Tbl_Instituciones>> FiltrarInstitucionesAsync(string buscar);
        Task<int> ActualizarInstitucionAsync(Tbl_Instituciones institucion, int idModificador);
        Task<int> EliminarInstitucionAsync(int idInstitucion, int idModificador);
    }
}
