using AS.APLICATION.DTOs.TBL_USUARIOS_ROLES;
using AS.APLICATION.Interface;
using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AS.APLICATION.Services
{
    public class UsuariosRolesServices
    {
        private readonly IUsuariosRolesRepository _repository;

        public UsuariosRolesServices(IUsuariosRolesRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Tbl_Usuarios_RolesDTOs>> Listar()
        {
            var list = await _repository.ListarUsuariosRolesAsync();
            return list.Select(r => new Tbl_Usuarios_RolesDTOs
            {
                Id_Usuario_Rol = r.Id_Usuario_Rol,
                Id_Usuario = r.Id_Usuario,
                Id_Rol = r.Id_Rol,
                Id_Creador = r.Id_Creador,
                Fecha_Creacion = r.Fecha_Creacion
            });
        }

        public async Task<int> Insertar(Tbl_Usuarios_RolesDTOs dto)
        {
            var entity = new Tbl_Usuarios_Roles
            {
                Id_Usuario = dto.Id_Usuario,
                Id_Rol = dto.Id_Rol,
                Id_Creador = dto.Id_Creador
            };

            return await _repository.InsertarUsuarioRolAsync(entity);
        }
    }
}
