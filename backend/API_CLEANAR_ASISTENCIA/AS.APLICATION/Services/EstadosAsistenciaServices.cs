using AS.APLICATION.DTOs.TBL_ESTADOS_ASISTENCIA;
using AS.APLICATION.Interface;
using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Services
{
    public class EstadosAsistenciaServices
    {
        private readonly IEstadosAsistenciaRepository _Repository;

        public EstadosAsistenciaServices(IEstadosAsistenciaRepository repository)
        {
            _Repository = repository;
        }

        #region  Listar
        public async Task<IEnumerable<Tbl_Estados_AsistenciaDTOs>> Listar()
        {
            var listar = await _Repository.Listar_Estados_Asistencia_Async();

            return listar.Select(e => new Tbl_Estados_AsistenciaDTOs
            {
                Id_Estado_Asistencia = e.Id_Estado_Asistencia,
                Nombre_Estado = e.Nombre_Estado,
                Descripcion = e.Descripcion,
                Fecha_Creacion = e.Fecha_Creacion,
                Fecha_Modificacion = e.Fecha_Modificacion
            });
        }
        #endregion

        #region FiltrarNombre
        public async Task<IEnumerable<Tbl_Estados_AsistenciaDTOs>> FiltrarNombre(string buscar)
        {
            if (string.IsNullOrWhiteSpace(buscar))
            {
                return await Listar();
            }

            var listar = await _Repository.Listar_Estados_Asistencia_X_Nombre_Async(buscar);
            return listar.Select(e => new Tbl_Estados_AsistenciaDTOs
            {
                Id_Estado_Asistencia = e.Id_Estado_Asistencia,
                Nombre_Estado = e.Nombre_Estado,
                Descripcion = e.Descripcion,
                Fecha_Creacion = e.Fecha_Creacion,
                Fecha_Modificacion = e.Fecha_Modificacion
            });
        }
        #endregion

        #region Insertar
        public async Task Insertar(Tbl_Estados_AsistenciaCreateDTOs oEstado)
        {
            var nuevoEstado = new Tbl_Estados_Asistencia
            {
                Nombre_Estado = oEstado.Nombre_Estado,
                Descripcion = oEstado.Descripcion,
                Fecha_Creacion = DateTime.UtcNow
            };
            await _Repository.Nuevo_Estado_Asistencia_Async(nuevoEstado);
        }
        #endregion

        #region Editar
        public async Task Editar(Tbl_Estados_AsistenciaUpdateDTOs oEstado)
        {
            var editarEstado = new Tbl_Estados_Asistencia
            {
                Id_Estado_Asistencia = oEstado.Id_Estado_Asistencia,
                Nombre_Estado = oEstado.Nombre_Estado,
                Descripcion = oEstado.Descripcion,
                Fecha_Modificacion = oEstado.Fecha_Modificacion ?? DateTime.UtcNow
            };
            await _Repository.Editar_Estado_Asistencia_Async(editarEstado);
        }
        #endregion

    }
}
