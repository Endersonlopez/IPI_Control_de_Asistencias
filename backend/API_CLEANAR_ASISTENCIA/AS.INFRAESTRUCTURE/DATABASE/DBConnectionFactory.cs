using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Data.SqlClient;

namespace AS.INFRAESTRUCTURE.DATABASE
{
    public class DBConnectionFactory
    {
        private readonly string _connectionString;

        public DBConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public SqlConnection createconnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}