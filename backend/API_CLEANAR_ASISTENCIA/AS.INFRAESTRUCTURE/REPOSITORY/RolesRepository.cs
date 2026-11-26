using AS.APLICATION.Interface;
using AS.DOMINE;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class RolesRepository : IRolesRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public RolesRepository(DBConnectionFactory dBConnectionFactory)
        {
            _dbConnectionFactory = dBConnectionFactory;
        }

        public async Task<int> Nuevo_Rol_Async(Tbl_Roles oRol)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Roles_Insertar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Nombre_Rol", (object?)oRol.Nombre_Rol ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Descripcion", (object?)oRol.Descripcion ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oRol.Id_Estado));

                var idObj = await cmd.ExecuteScalarAsync();
                if (idObj != null && int.TryParse(idObj.ToString(), out int id))
                    return id;

                return 0;
            }
        }

        public async Task Editar_Rol_Async(Tbl_Roles oRol)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Roles_Actualizar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Rol", oRol.Id_Rol));
                cmd.Parameters.Add(new SqlParameter("@Nombre_Rol", (object?)oRol.Nombre_Rol ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Descripcion", (object?)oRol.Descripcion ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oRol.Id_Estado));

                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task<IEnumerable<Tbl_Roles>> Listar_Roles_Async()
        {
            var list = new List<Tbl_Roles>();
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Roles_Listar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Roles
                        {
                            Id_Rol = Convert.ToInt32(dr["Id_Rol"]),
                            Nombre_Rol = dr["Nombre_Rol"].ToString(),
                            Descripcion = dr["Descripcion"].ToString(),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"])
                        });
                    }
                }
            }

            return list;
        }

        public async Task<IEnumerable<Tbl_Roles>> Listar_Roles_X_Busqueda_Async(string buscar)
        {
            var list = new List<Tbl_Roles>();
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Roles_Filtrar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Busqueda", buscar));

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Roles
                        {
                            Id_Rol = Convert.ToInt32(dr["Id_Rol"]),
                            Nombre_Rol = dr["Nombre_Rol"].ToString(),
                            Descripcion = dr["Descripcion"].ToString(),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"])
                        });
                    }
                }
            }

            return list;
 
        }
    }
}
