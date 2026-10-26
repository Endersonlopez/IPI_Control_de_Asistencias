using AS.APLICATION.DTOs.TBL_ROLES;
using AS.APLICATION.Interface;
using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace AS.APLICATION.Services
{
    public class RolesServices
    {
        private readonly IRolesRepository _Repository;

        public RolesServices(IRolesRepository repository)
        {
            _Repository = repository;
        }

        public async Task<IEnumerable<Tbl_RolesDTOs>> Listar()
        {
            var listar = await _Repository.Listar_Roles_Async();

            return listar.Select(r => new Tbl_RolesDTOs
            {
                Id_Rol = r.Id_Rol,
                Nombre_Rol = r.Nombre_Rol,
                Descripcion = r.Descripcion,
                Id_Estado = r.Id_Estado
            });
        }

        public async Task<IEnumerable<Tbl_RolesDTOs>> Filtrar(string buscar)
        {
            if (string.IsNullOrWhiteSpace(buscar))
                return await Listar();

            var listar = await _Repository.Listar_Roles_X_Busqueda_Async(buscar);
            return listar.Select(r => new Tbl_RolesDTOs
            {
                Id_Rol = r.Id_Rol,
                Nombre_Rol = r.Nombre_Rol,
                Descripcion = r.Descripcion,
                Id_Estado = r.Id_Estado
            });
        }

        public async Task<int> Insertar(Tbl_RolesCreateDTOs oRol)
        {
            var nuevo = new Tbl_Roles
            {
                Nombre_Rol = oRol.Nombre_Rol,
                Descripcion = oRol.Descripcion,
                Id_Estado = oRol.Id_Estado
            };

            return await _Repository.Nuevo_Rol_Async(nuevo);
        }

        public async Task Editar(Tbl_RolesUpdateDTOs oRol)
        {
            var editar = new Tbl_Roles
            {
                Id_Rol = oRol.Id_Rol,
                Nombre_Rol = oRol.Nombre_Rol,
                Descripcion = oRol.Descripcion,
                Id_Estado = oRol.Id_Estado
            };

            await _Repository.Editar_Rol_Async(editar);
        }
    }
}
