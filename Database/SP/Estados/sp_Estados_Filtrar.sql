USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Estados_Filtrar]
    @Busqueda VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id_Estado,
        Nombre_Estado
    FROM [SQM_CATALOGOS].[Tbl_Estados]
    WHERE @Busqueda IS NULL 
       OR @Busqueda = ''
       OR Nombre_Estado LIKE '%' + @Busqueda + '%'
    ORDER BY Id_Estado ASC;
END;
GO