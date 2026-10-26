using AS.APLICATION.DTOs.TBL_INSTITUCIONES;
using AS.APLICATION.Interface;
using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AS.APLICATION.Services
{
    public class InstitucionesServices
    {
        private readonly IInstitucionesRepository _repository;

        public InstitucionesServices(IInstitucionesRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Tbl_InstitucionesDTOs>> Listar()
        {
            var list = await _repository.ListarInstitucionesAsync();
            return list.Select(i => new Tbl_InstitucionesDTOs
            {
                Id_Institucion = i.Id_Institucion,
                Nombre_Institucion = i.Nombre_Institucion,
                Id_Estado = i.Id_Estado,
                Id_Creador = i.Id_Creador,
                Fecha_Creacion = i.Fecha_Creacion,
                Id_Modificador = i.Id_Modificador,
                Fecha_Modificacion = i.Fecha_Modificacion
            });
        }

        public async Task<IEnumerable<Tbl_InstitucionesDTOs>> Filtrar(string buscar)
        {
            var list = await _repository.FiltrarInstitucionesAsync(buscar);
            return list.Select(i => new Tbl_InstitucionesDTOs
            {
                Id_Institucion = i.Id_Institucion,
                Nombre_Institucion = i.Nombre_Institucion,
                Id_Estado = i.Id_Estado,
                Id_Creador = i.Id_Creador,
                Fecha_Creacion = i.Fecha_Creacion,
                Id_Modificador = i.Id_Modificador,
                Fecha_Modificacion = i.Fecha_Modificacion
            });
        }

        public async Task<int> Insertar(Tbl_InstitucionesCreateDTOs dto)
        {
            var entity = new Tbl_Instituciones
            {
                Nombre_Institucion = dto.Nombre_Institucion
            };

            return await _repository.InsertarInstitucionAsync(entity, dto.Id_Creador);
        }

        public async Task<int> Editar(Tbl_InstitucionesUpdateDTOs dto)
        {
            var entity = new Tbl_Instituciones
            {
                Id_Institucion = dto.Id_Institucion,
                Nombre_Institucion = dto.Nombre_Institucion,
                Id_Estado = dto.Id_Estado
            };

            return await _repository.ActualizarInstitucionAsync(entity, dto.Id_Modificador);
        }

        public async Task<int> Eliminar(int idInstitucion, int idModificador)
        {
            return await _repository.EliminarInstitucionAsync(idInstitucion, idModificador);
        }
    }
}
