using AS.APLICATION.Interface;
using AS.DOMINE;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class UsuariosRolesRepository : IUsuariosRolesRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public UsuariosRolesRepository(DBConnectionFactory dBConnectionFactory)
        {
            _dbConnectionFactory = dBConnectionFactory;
        }

        public async Task<int> InsertarUsuarioRolAsync(Tbl_Usuarios_Roles usuarioRol)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_SEGURIDAD.sp_Usuarios_Roles_Insertar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Usuario", usuarioRol.Id_Usuario));
                cmd.Parameters.Add(new SqlParameter("@Id_Rol", usuarioRol.Id_Rol));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", usuarioRol.Id_Creador));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    if (await dr.ReadAsync())
                    {
                        if (!dr.IsDBNull(0))
                        {
                            return Convert.ToInt32(dr.GetValue(0));
                        }
                    }
                }
            }

            return 0;
        }

        public async Task<IEnumerable<Tbl_Usuarios_Roles>> ListarUsuariosRolesAsync()
        {
            var list = new List<Tbl_Usuarios_Roles>();
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_SEGURIDAD.sp_Usuarios_Roles_Listar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Usuarios_Roles
                        {
                            Id_Usuario_Rol = Convert.ToInt32(dr["Id_Usuario_Rol"]),
                            Id_Usuario = Convert.ToInt32(dr["Id_Usuario"]),
                            Id_Rol = Convert.ToInt32(dr["Id_Rol"]),
                            Id_Creador = Convert.ToInt32(dr["Id_Creador"]),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]) 
                        });
                    }
                }
            }

            return list;
        }
    }
}
