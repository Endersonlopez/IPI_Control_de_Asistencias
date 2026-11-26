using AS.APLICATION.DTOs.TBL_USUARIOS;
using AS.APLICATION.Interface;
using AS.DOMINE;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AS.APLICATION.Services
{
    public class UsuariosServices
    {
        private readonly IUsuariosRepository _repository;

        public UsuariosServices(IUsuariosRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Tbl_UsuariosDTOs>> Listar()
        {
            var list = await _repository.ListarUsuariosAsync();

            return list.Select(u => new Tbl_UsuariosDTOs
            {
                Id_Usuario = u.Id_Usuario,
                Primer_Nombre = u.Primer_Nombre,
                Segundo_Nombre = u.Segundo_Nombre,
                Primer_Apellido = u.Primer_Apellido,
                Segundo_Apellido = u.Segundo_Apellido,
                Nombre_Usuario = u.Nombre_Usuario,
                Correo_Electronico = u.Correo_Electronico,
                Telefono = u.Telefono,
                Id_Estado = u.Id_Estado,
                Id_Creador = u.Id_Creador,
                Fecha_Creacion = u.Fecha_Creacion,
                Id_Modificador = u.Id_Modificador,
                Fecha_Modificacion = u.Fecha_Modificacion
            });
        }

        public async Task<IEnumerable<Tbl_UsuariosDTOs>> Filtrar(string buscar)
        {
            if (string.IsNullOrWhiteSpace(buscar)) return await Listar();
            var list = await _repository.FiltrarUsuariosAsync(buscar);
            return list.Select(u => new Tbl_UsuariosDTOs
            {
                Id_Usuario = u.Id_Usuario,
                Primer_Nombre = u.Primer_Nombre,
                Segundo_Nombre = u.Segundo_Nombre,
                Primer_Apellido = u.Primer_Apellido,
                Segundo_Apellido = u.Segundo_Apellido,
                Nombre_Usuario = u.Nombre_Usuario,
                Correo_Electronico = u.Correo_Electronico,
                Telefono = u.Telefono,
                Id_Estado = u.Id_Estado,
                Id_Creador = u.Id_Creador,
                Fecha_Creacion = u.Fecha_Creacion,
                Id_Modificador = u.Id_Modificador,
                Fecha_Modificacion = u.Fecha_Modificacion
            });
        }

        public async Task<int> Insertar(Tbl_UsuariosCreateDTOs dto)
        {
            var usuario = new Tbl_Usuarios
            {
                Primer_Nombre = dto.Primer_Nombre,
                Segundo_Nombre = dto.Segundo_Nombre,
                Primer_Apellido = dto.Primer_Apellido,
                Segundo_Apellido = dto.Segundo_Apellido,
                Nombre_Usuario = dto.Nombre_Usuario,
                Correo_Electronico = dto.Correo_Electronico,
                Telefono = dto.Telefono,
                Id_Creador = dto.Id_Creador
            };
            var id = await _repository.InsertarUsuarioAsync(usuario, dto.Contrasena ?? string.Empty, dto.Id_Rol);
            return id;
        }

        public async Task Editar(Tbl_UsuariosUpdateDTOs dto)
        {
            var usuario = new Tbl_Usuarios
            {
                Id_Usuario = dto.Id_Usuario,
                Primer_Nombre = dto.Primer_Nombre,
                Segundo_Nombre = dto.Segundo_Nombre,
                Primer_Apellido = dto.Primer_Apellido,
                Segundo_Apellido = dto.Segundo_Apellido,
                Nombre_Usuario = dto.Nombre_Usuario,
                Correo_Electronico = dto.Correo_Electronico,
                Telefono = dto.Telefono,
                Id_Estado = dto.Id_Estado,
                Id_Modificador = dto.Id_Modificador,
                Fecha_Modificacion = dto.Fecha_Modificacion
            };

            await _repository.ActualizarUsuarioAsync(usuario);
        }

        public async Task Eliminar(int idUsuario, int idModificador)
        {
            await _repository.EliminarUsuarioAsync(idUsuario, idModificador);
        }
    }
}
