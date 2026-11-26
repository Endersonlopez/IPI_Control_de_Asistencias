using AS.APLICATION.Interface;
using AS.DOMINE;
using AS.INFRAESTRUCTURE.DATABASE;
using AS.INFRAESTRUCTURE.SECURITY;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class UsuariosRepository : IUsuariosRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public UsuariosRepository(DBConnectionFactory dBConnectionFactory)
        {
            _dbConnectionFactory = dBConnectionFactory;
        }

        public async Task<int> InsertarUsuarioAsync(Tbl_Usuarios usuario, string contrasenaPlain, int idRol)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_SEGURIDAD.sp_Usuarios_Registrar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Primer_Nombre", usuario.Primer_Nombre));
                cmd.Parameters.Add(new SqlParameter("@Segundo_Nombre", usuario.Segundo_Nombre ?? (object)DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Primer_Apellido", usuario.Primer_Apellido));
                cmd.Parameters.Add(new SqlParameter("@Segundo_Apellido", usuario.Segundo_Apellido ?? (object)DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Nombre_Usuario", usuario.Nombre_Usuario));
                cmd.Parameters.Add(new SqlParameter("@Correo_Electronico", usuario.Correo_Electronico));
                cmd.Parameters.Add(new SqlParameter("@Telefono", usuario.Telefono ?? (object)DBNull.Value));

                cmd.Parameters.Add(new SqlParameter("@Contrasena", contrasenaPlain));

                cmd.Parameters.Add(new SqlParameter("@Id_Rol", idRol));

                cmd.Parameters.Add(new SqlParameter("@Id_Creador", usuario.Id_Creador ?? (object)DBNull.Value));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    if (await dr.ReadAsync())
                    {
                        if (!dr.IsDBNull(0))
                        {
                            try
                            {
                                return Convert.ToInt32(dr.GetValue(0));
                            }
                            catch (Exception ex)
                            {
                                throw new Exception("Error al convertir Id generado: " + ex.Message);
                            }
                        }
                    }
                }
            }

            return 0;
        }

        public async Task<IEnumerable<Tbl_Usuarios>> ListarUsuariosAsync()
        {
            var list = new List<Tbl_Usuarios>();

            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_SEGURIDAD.sp_Usuarios_Listar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Usuarios
                        {
                            Id_Usuario = Convert.ToInt32(dr["Id_Usuario"]),

                            Primer_Nombre = dr["Primer_Nombre"].ToString(),
                            Segundo_Nombre = dr["Segundo_Nombre"] == DBNull.Value
                                ? null
                                : dr["Segundo_Nombre"].ToString(),

                            Primer_Apellido = dr["Primer_Apellido"].ToString(),
                            Segundo_Apellido = dr["Segundo_Apellido"] == DBNull.Value
                                ? null
                                : dr["Segundo_Apellido"].ToString(),

                            Nombre_Usuario = dr["Nombre_Usuario"].ToString(),

                            Correo_Electronico = dr["Correo_Electronico"].ToString(),

                            Telefono = dr["Telefono"].ToString(),

                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),

                            Id_Creador = dr["Id_Creador"] == DBNull.Value
                                ? (int?)null
                                : Convert.ToInt32(dr["Id_Creador"]),

                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),

                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value
                                ? (int?)null
                                : Convert.ToInt32(dr["Id_Modificador"]),

                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value
                                ? (DateTime?)null
                                : Convert.ToDateTime(dr["Fecha_Modificacion"])
                        });
                    }
                }
            }

            return list;
        }

        public async Task<IEnumerable<Tbl_Usuarios>> FiltrarUsuariosAsync(string buscar)
        {
            var list = new List<Tbl_Usuarios>();
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_SEGURIDAD.sp_Usuarios_Filtrar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Busqueda", buscar));
                
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Usuarios
                        {
                            Id_Usuario = Convert.ToInt32(dr["Id_Usuario"]),
                            
                            Primer_Nombre = dr["Primer_Nombre"].ToString(),
                            Segundo_Nombre = dr["Segundo_Nombre"] == DBNull.Value 
                                ? null 
                                : dr["Segundo_Nombre"].ToString(),
                                
                            Primer_Apellido = dr["Primer_Apellido"].ToString(),
                            Segundo_Apellido = dr["Segundo_Apellido"] == DBNull.Value 
                                ? null 
                                : dr["Segundo_Apellido"].ToString(),
                                
                            Nombre_Usuario = dr["Nombre_Usuario"].ToString(),
                            Correo_Electronico = dr["Correo_Electronico"].ToString(),
                            Telefono = dr["Telefono"].ToString(),
                            
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                            Id_Creador = dr["Id_Creador"] == DBNull.Value 
                                ? (int?)null 
                                : Convert.ToInt32(dr["Id_Creador"]),
                                
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value 
                                ? (int?)null 
                                : Convert.ToInt32(dr["Id_Modificador"]),
                                
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value 
                                ? (DateTime?)null 
                                : Convert.ToDateTime(dr["Fecha_Modificacion"]) 
                        });
                    }
                }
            }

            return list;
        }

        public async Task ActualizarUsuarioAsync(Tbl_Usuarios usuario)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_SEGURIDAD.sp_Usuarios_Actualizar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Usuario", usuario.Id_Usuario));
                cmd.Parameters.Add(new SqlParameter("@Primer_Nombre", usuario.Primer_Nombre));
                cmd.Parameters.Add(new SqlParameter("@Segundo_Nombre", usuario.Segundo_Nombre ?? (object)DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Primer_Apellido", usuario.Primer_Apellido));
                cmd.Parameters.Add(new SqlParameter("@Segundo_Apellido", usuario.Segundo_Apellido ?? (object)DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Nombre_Usuario", usuario.Nombre_Usuario));
                cmd.Parameters.Add(new SqlParameter("@Correo_Electronico", usuario.Correo_Electronico));
                cmd.Parameters.Add(new SqlParameter("@Telefono", usuario.Telefono));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", usuario.Id_Estado));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", usuario.Id_Modificador ?? (object)DBNull.Value));

                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task EliminarUsuarioAsync(int idUsuario, int idModificador)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_SEGURIDAD.sp_Usuarios_Eliminar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Usuario", idUsuario));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));

                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
