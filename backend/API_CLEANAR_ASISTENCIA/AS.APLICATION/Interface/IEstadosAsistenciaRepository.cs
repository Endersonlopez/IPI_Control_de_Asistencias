using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Interface
{
    public interface IEstadosAsistenciaRepository
    {
        Task<IEnumerable<Tbl_Estados_Asistencia>> Listar_Estados_Asistencia_Async();
        Task<IEnumerable<Tbl_Estados_Asistencia>> Listar_Estados_Asistencia_X_Nombre_Async(string buscar);
        Task Nuevo_Estado_Asistencia_Async(Tbl_Estados_Asistencia oEstado);
        Task Editar_Estado_Asistencia_Async(Tbl_Estados_Asistencia oEstado);
    }
}
