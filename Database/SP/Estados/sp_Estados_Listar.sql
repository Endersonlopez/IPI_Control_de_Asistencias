USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Estados_Listar]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id_Estado,
        Nombre_Estado
    FROM [SQM_CATALOGOS].[Tbl_Estados]
    ORDER BY Id_Estado ASC;
END;
GO