using AS.APLICATION.DTOs.TBL_ESTADOS;
using AS.APLICATION.Interface;
using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.APLICATION.Services
{
    public class EstadosServices
    {
        private readonly IEstadosRepository _Repository;

        public EstadosServices(IEstadosRepository repository)
        {
            _Repository = repository;
        }

        #region  ListarEStado
        public async Task<IEnumerable<Tbl_EstadosDTOs>> ListarEStado()
        {
            var listar = await _Repository.Listar_Estados_Async();

            return listar.Select(e => new Tbl_EstadosDTOs
            {
                Id_Estado = e.Id_Estado,
                Nombre_Estado = e.Nombre_Estado
            });
        }
        #endregion

        #region FiltrarNombre
        public async Task<IEnumerable<Tbl_EstadosDTOs>> FiltrarNombre(string buscar)
        {

            if (string.IsNullOrWhiteSpace(buscar))
            {
                return await ListarEStado();
            }

            var listar = await _Repository.Listar_Estados_X_Nombre_Async(buscar);
            return listar.Select(e => new Tbl_EstadosDTOs
            {
                Id_Estado = e.Id_Estado,
                Nombre_Estado = e.Nombre_Estado
            });
        }
        #endregion

        #region Insertar
        public async Task Insertar(Tbl_EstadosCreateDTOs oEstado)
        {
            var nuevoEstado = new Tbl_Estados
            {
                Nombre_Estado = oEstado.Nombre_Estado
            };
            await _Repository.Nuevo_Estado_Async(nuevoEstado);
        }
        #endregion

        #region Editar

        public async Task Editar(Tbl_EstadosUpdateDTOs oEstado)
        {
            var editarEstado = new Tbl_Estados
            {
                Id_Estado = oEstado.Id_Estado,
                Nombre_Estado = oEstado.Nombre_Estado
            };
            await _Repository.Editar_Estado_Async(editarEstado);
        }

        #endregion



    }
}
