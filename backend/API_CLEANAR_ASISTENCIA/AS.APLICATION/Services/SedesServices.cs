using AS.APLICATION.DTOs.TBL_SEDES;
using AS.APLICATION.Interface;
using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AS.APLICATION.Services
{
    public class SedesServices
    {
        private readonly ISedesRepository _repository;

        public SedesServices(ISedesRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Tbl_SedesDTOs>> Listar()
        {
            var list = await _repository.Listar_Sedes_Async();
            return list.Select(s => new Tbl_SedesDTOs
            {
                Id_Sede = s.Id_Sede,
                Id_Institucion = s.Id_Institucion,
                Nombre_Sede = s.Nombre_Sede,
                Id_Estado = s.Id_Estado,
                Id_Creador = s.Id_Creador,
                Fecha_Creacion = s.Fecha_Creacion,
                Id_Modificador = s.Id_Modificador,
                Fecha_Modificacion = s.Fecha_Modificacion
            });
        }

        public async Task<IEnumerable<Tbl_SedesDTOs>> Filtrar(string buscar)
        {
            if (string.IsNullOrWhiteSpace(buscar)) return await Listar();
            var list = await _repository.Listar_Sedes_X_Busqueda_Async(buscar);
            return list.Select(s => new Tbl_SedesDTOs
            {
                Id_Sede = s.Id_Sede,
                Id_Institucion = s.Id_Institucion,
                Nombre_Sede = s.Nombre_Sede,
                Id_Estado = s.Id_Estado,
                Id_Creador = s.Id_Creador,
                Fecha_Creacion = s.Fecha_Creacion,
                Id_Modificador = s.Id_Modificador,
                Fecha_Modificacion = s.Fecha_Modificacion
            });
        }

        public async Task<int> Insertar(Tbl_SedesCreateDTOs dto)
        {
            var nuevo = new Tbl_Sedes
            {
                Id_Institucion = dto.Id_Institucion,
                Nombre_Sede = dto.Nombre_Sede,
                Id_Estado = dto.Id_Estado,
                Id_Creador = dto.Id_Creador
            };

            return await _repository.Nuevo_Sede_Async(nuevo);
        }

        public async Task Editar(Tbl_SedesUpdateDTOs dto)
        {
            var entity = new Tbl_Sedes
            {
                Id_Sede = dto.Id_Sede,
                Id_Institucion = dto.Id_Institucion,
                Nombre_Sede = dto.Nombre_Sede,
                Id_Modificador = dto.Id_Modificador
            };

            await _repository.Editar_Sede_Async(entity);
        }

        public async Task Eliminar(int idSede, int idModificador)
        {
            await _repository.Eliminar_Sede_Async(idSede, idModificador);
        }
    }
}
