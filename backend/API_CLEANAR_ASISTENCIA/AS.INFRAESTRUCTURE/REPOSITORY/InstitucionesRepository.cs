using AS.APLICATION.Interface;
using AS.DOMINE;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class InstitucionesRepository : IInstitucionesRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public InstitucionesRepository(DBConnectionFactory dBConnectionFactory)
        {
            _dbConnectionFactory = dBConnectionFactory;
        }

        public async Task<int> InsertarInstitucionAsync(Tbl_Instituciones institucion, int idCreador)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_GENERAL.sp_Instituciones_Insertar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Nombre_Institucion", institucion.Nombre_Institucion));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", idCreador));

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

        public async Task<IEnumerable<Tbl_Instituciones>> ListarInstitucionesAsync()
        {
            var list = new List<Tbl_Instituciones>();
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_GENERAL.sp_Instituciones_Listar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Instituciones
                        {
                            Id_Institucion = Convert.ToInt32(dr["Id_Institucion"]),
                            Nombre_Institucion = dr["Nombre_Institucion"].ToString(),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                            Id_Creador = dr["Id_Creador"] == DBNull.Value ? (int?)null : Convert.ToInt32(dr["Id_Creador"]),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? (int?)null : Convert.ToInt32(dr["Id_Modificador"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["Fecha_Modificacion"]) 
                        });
                    }
                }
            }

            return list;
        }

        public async Task<IEnumerable<Tbl_Instituciones>> FiltrarInstitucionesAsync(string buscar)
        {
            var list = new List<Tbl_Instituciones>();
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_GENERAL.sp_Instituciones_Filtrar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Busqueda", buscar));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Instituciones
                        {
                            Id_Institucion = Convert.ToInt32(dr["Id_Institucion"]),
                            Nombre_Institucion = dr["Nombre_Institucion"].ToString(),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                            Id_Creador = dr["Id_Creador"] == DBNull.Value ? (int?)null : Convert.ToInt32(dr["Id_Creador"]),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? (int?)null : Convert.ToInt32(dr["Id_Modificador"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["Fecha_Modificacion"]) 
                        });
                    }
                }
            }

            return list;
        }

        public async Task<int> ActualizarInstitucionAsync(Tbl_Instituciones institucion, int idModificador)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_GENERAL.sp_Instituciones_Actualizar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Institucion", institucion.Id_Institucion));
                cmd.Parameters.Add(new SqlParameter("@Nombre_Institucion", institucion.Nombre_Institucion));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", institucion.Id_Estado));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));

                int filasAfectadas = await cmd.ExecuteNonQueryAsync();

                return filasAfectadas;
            }
        }

        public async Task<int> EliminarInstitucionAsync(int idInstitucion, int idModificador)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_GENERAL.sp_Instituciones_Eliminar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Institucion", idInstitucion));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));

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
    }
}
