using AS.APLICATION.Interface;
using AS.DOMINE;
using AS.INFRAESTRUCTURE.DATABASE;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace AS.INFRAESTRUCTURE.REPOSITORY
{
    public class EstadoRepository : IEstadosRepository
    {
        private readonly DBConnectionFactory _dbConnectionFactory;

        #region constructorEstados
        public EstadoRepository(DBConnectionFactory dBConnectionFactory)
        {
            _dbConnectionFactory = dBConnectionFactory;
        }
        #endregion

        #region Listar_Estados_Async

        public async Task<IEnumerable<Tbl_Estados>> Listar_Estados_Async()
        {

            var elist = new List<Tbl_Estados>();

            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Estados_Listar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        elist.Add (new Tbl_Estados
                        {
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                            Nombre_Estado = dr["Nombre_Estado"].ToString()
                        });
                    }
                }
            }

            return elist;
        }

        #endregion

        #region Buscar por nombre

        public async Task<IEnumerable<Tbl_Estados>> Listar_Estados_X_Nombre_Async(string buscar)
        {
            var elist = new List<Tbl_Estados>();

            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Estados_Filtrar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter ("@Busqueda", buscar));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        elist.Add(new Tbl_Estados
                        {
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                            Nombre_Estado = dr["Nombre_Estado"].ToString()
                        });
                    }
                }
            }

            return elist;
        }

        #endregion

        #region Agregar

        public async Task Nuevo_Estado_Async(Tbl_Estados oEstado)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Estados_Insertar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Nombre_Estado", oEstado.Nombre_Estado));

                await cmd.ExecuteNonQueryAsync();
            }
        }

        #endregion

        #region Editar_Estado

        public async Task Editar_Estado_Async(Tbl_Estados oEstado)
        {
            using var con = _dbConnectionFactory.createconnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SQM_CATALOGOS.sp_Estados_Actualizar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oEstado.Id_Estado));
                cmd.Parameters.Add(new SqlParameter("@Nombre_Estado", oEstado.Nombre_Estado));

                await cmd.ExecuteNonQueryAsync();
            }
        }

        #endregion



    }
}
