using AS.APLICATION.Interface;
using AS.DOMINE;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class SedesRepository : ISedesRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public SedesRepository(DBConnectionFactory dBConnectionFactory)
        {
            _dbConnectionFactory = dBConnectionFactory;
        }

        public async Task<int> Nuevo_Sede_Async(Tbl_Sedes oSede)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_GENERAL.sp_Sedes_Insertar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Institucion", oSede.Id_Institucion));
                cmd.Parameters.Add(new SqlParameter("@Nombre_Sede", oSede.Nombre_Sede));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oSede.Id_Creador));

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

        public async Task<IEnumerable<Tbl_Sedes>> Listar_Sedes_Async()
        {
            var list = new List<Tbl_Sedes>();
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_GENERAL.sp_Sedes_Listar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Sedes
                        {
                            Id_Sede = Convert.ToInt32(dr["Id_Sede"]),
                            Id_Institucion = Convert.ToInt32(dr["Id_Institucion"]),
                            Nombre_Sede = dr["Nombre_Sede"].ToString(),
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

        public async Task<IEnumerable<Tbl_Sedes>> Listar_Sedes_X_Busqueda_Async(string buscar)
        {
            var list = new List<Tbl_Sedes>();
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_GENERAL.sp_Sedes_Filtrar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Busqueda", buscar));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        list.Add(new Tbl_Sedes
                        {
                            Id_Sede = Convert.ToInt32(dr["Id_Sede"]),
                            Id_Institucion = Convert.ToInt32(dr["Id_Institucion"]),
                            Nombre_Sede = dr["Nombre_Sede"].ToString(),
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

        public async Task Editar_Sede_Async(Tbl_Sedes oSede)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_GENERAL.sp_Sedes_Actualizar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Sede", oSede.Id_Sede));
                cmd.Parameters.Add(new SqlParameter("@Id_Institucion", oSede.Id_Institucion));
                cmd.Parameters.Add(new SqlParameter("@Nombre_Sede", oSede.Nombre_Sede));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oSede.Id_Modificador ?? (object)DBNull.Value));

                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task Eliminar_Sede_Async(int idSede, int idModificador)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_GENERAL.sp_Sedes_Eliminar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Sede", idSede));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));

                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
