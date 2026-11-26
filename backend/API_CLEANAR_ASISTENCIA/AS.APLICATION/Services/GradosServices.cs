using AS.APLICATION.DTOs.TBL_GRADOS;
using AS.APLICATION.Interface;
using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AS.APLICATION.Services
{
    public class GradosServices
    {
        private readonly IGradosRepository _repository;

        public GradosServices(IGradosRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Tbl_GradosDTOs>> Listar()
        {
            var list = await _repository.Listar_Grados_Async();
            return list.Select(g => new Tbl_GradosDTOs
            {
                Id_Grado = g.Id_Grado,
                Id_Sede = g.Id_Sede,
                Nombre_Grado = g.Nombre_Grado,
                Id_Estado = g.Id_Estado,
                Id_Creador = g.Id_Creador,
                Fecha_Creacion = g.Fecha_Creacion,
                Id_Modificador = g.Id_Modificador,
                Fecha_Modificacion = g.Fecha_Modificacion
            });
        }

        public async Task<IEnumerable<Tbl_GradosDTOs>> Filtrar(string buscar)
        {
            if (string.IsNullOrWhiteSpace(buscar)) return await Listar();
            var list = await _repository.Listar_Grados_X_Busqueda_Async(buscar);
            return list.Select(g => new Tbl_GradosDTOs
            {
                Id_Grado = g.Id_Grado,
                Id_Sede = g.Id_Sede,
                Nombre_Grado = g.Nombre_Grado,
                Id_Estado = g.Id_Estado,
                Id_Creador = g.Id_Creador,
                Fecha_Creacion = g.Fecha_Creacion,
                Id_Modificador = g.Id_Modificador,
                Fecha_Modificacion = g.Fecha_Modificacion
            });
        }

        public async Task<int> Insertar(Tbl_GradosCreateDTOs dto)
        {
            var entity = new Tbl_Grados
            {
                Id_Sede = dto.Id_Sede,
                Nombre_Grado = dto.Nombre_Grado,
                Id_Estado = dto.Id_Estado,
                Id_Creador = dto.Id_Creador
            };

            return await _repository.Nuevo_Grado_Async(entity);
        }

        public async Task Editar(Tbl_GradosUpdateDTOs dto)
        {
            var entity = new Tbl_Grados
            {
                Id_Grado = dto.Id_Grado,
                Id_Sede = dto.Id_Sede,
                Id_Estado = dto.Id_Estado,
                Nombre_Grado = dto.Nombre_Grado,
                Id_Modificador = dto.Id_Modificador
            };

            await _repository.Editar_Grado_Async(entity);
        }

        public async Task Eliminar(int idGrado, int idModificador)
        {
            await _repository.Eliminar_Grado_Async(idGrado, idModificador);
        }
    }
}
