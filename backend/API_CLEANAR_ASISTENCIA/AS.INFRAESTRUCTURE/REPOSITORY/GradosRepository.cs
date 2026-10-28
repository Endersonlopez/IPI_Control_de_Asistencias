using AS.APLICATION.Interface;
using AS.DOMINE;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class GradosRepository : IGradosRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public GradosRepository(DBConnectionFactory dBConnectionFactory)
        {
            _dbConnectionFactory = dBConnectionFactory;
        }

        public async Task<int> Nuevo_Grado_Async(Tbl_Grados oGrado)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Grados_Insertar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Sede", oGrado.Id_Sede));
                cmd.Parameters.Add(new SqlParameter("@Nombre_Grado", oGrado.Nombre_Grado));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oGrado.Id_Estado));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oGrado.Id_Creador));

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

        public async Task<IEnumerable<Tbl_Grados>> Listar_Grados_Async()
        {
            var list = new List<Tbl_Grados>();
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Grados_Listar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Grados
                        {
                            Id_Grado = Convert.ToInt32(dr["Id_Grado"]),
                            Id_Sede = Convert.ToInt32(dr["Id_Sede"]),
                            Nombre_Grado = dr["Nombre_Grado"].ToString(),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                            Id_Creador = Convert.ToInt32(dr["Id_Creador"]),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? (int?)null : Convert.ToInt32(dr["Id_Modificador"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["Fecha_Modificacion"]) 
                        });
                    }
                }
            }

            return list;
        }

        public async Task<IEnumerable<Tbl_Grados>> Listar_Grados_X_Busqueda_Async(string buscar)
        {
            var list = new List<Tbl_Grados>();
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Grados_Filtrar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Busqueda", buscar));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Grados
                        {
                            Id_Grado = Convert.ToInt32(dr["Id_Grado"]),
                            Id_Sede = Convert.ToInt32(dr["Id_Sede"]),
                            Nombre_Grado = dr["Nombre_Grado"].ToString(),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                            Id_Creador = Convert.ToInt32(dr["Id_Creador"]),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? (int?)null : Convert.ToInt32(dr["Id_Modificador"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["Fecha_Modificacion"]) 
                        });
                    }
                }
            }

            return list;
        }

        public async Task Editar_Grado_Async(Tbl_Grados oGrado)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Grados_Actualizar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Grado", oGrado.Id_Grado));
                cmd.Parameters.Add(new SqlParameter("@Id_Sede", oGrado.Id_Sede));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oGrado.Id_Estado));
                cmd.Parameters.Add(new SqlParameter("@Nombre_Grado", oGrado.Nombre_Grado));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oGrado.Id_Modificador ?? (object)DBNull.Value));

                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task Eliminar_Grado_Async(int idGrado, int idModificador)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Grados_Eliminar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Grado", idGrado));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));

                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
