using AS.APLICATION.Interface;
using AS.DOMINE;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class EstadoAsistenciaRepository : IEstadosAsistenciaRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        public EstadoAsistenciaRepository(DBConnectionFactory dBConnectionFactory)
        {
            _dbConnectionFactory = dBConnectionFactory;
        }

        public async Task<IEnumerable<Tbl_Estados_Asistencia>> Listar_Estados_Asistencia_Async()
        {
            var elist = new List<Tbl_Estados_Asistencia>();

            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Estados_Asistencia_Listar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        elist.Add(new Tbl_Estados_Asistencia
                        {
                            Id_Estado_Asistencia = Convert.ToInt32(dr["Id_Estado_Asistencia"]),
                            Nombre_Estado = dr["Nombre_Estado"].ToString(),
                            Descripcion = dr["Descripcion"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["Fecha_Modificacion"]) 
                        });
                    }
                }
            }

            return elist;
        }

        public async Task<IEnumerable<Tbl_Estados_Asistencia>> Listar_Estados_Asistencia_X_Nombre_Async(string buscar)
        {
            var elist = new List<Tbl_Estados_Asistencia>();

            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Estados_Asistencia_Filtrar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Busqueda", buscar));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        elist.Add(new Tbl_Estados_Asistencia
                        {
                            Id_Estado_Asistencia = Convert.ToInt32(dr["Id_Estado_Asistencia"]),
                            Nombre_Estado = dr["Nombre_Estado"].ToString(),
                            Descripcion = dr["Descripcion"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["Fecha_Modificacion"]) 
                        });
                    }
                }
            }

            return elist;
        }

        public async Task Nuevo_Estado_Asistencia_Async(Tbl_Estados_Asistencia oEstado)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.[sp_Estados_Asistencia_Insertar]", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Nombre_Estado", oEstado.Nombre_Estado));
                cmd.Parameters.Add(new SqlParameter("@Descripcion", oEstado.Descripcion));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Creacion", oEstado.Fecha_Creacion));

                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task Editar_Estado_Asistencia_Async(Tbl_Estados_Asistencia oEstado)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Estados_Asistencia_Actualizar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Estado_Asistencia", oEstado.Id_Estado_Asistencia));
                cmd.Parameters.Add(new SqlParameter("@Nombre_Estado", oEstado.Nombre_Estado));
                cmd.Parameters.Add(new SqlParameter("@Descripcion", oEstado.Descripcion));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Modificacion", oEstado.Fecha_Modificacion ?? (object)DBNull.Value));

                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
