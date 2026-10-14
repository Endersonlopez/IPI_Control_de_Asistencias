USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Instituciones_Filtrar]
    @Busqueda VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id_Institucion,
        Nombre_Institucion,
        Id_Estado,
        Id_Creador,
        Fecha_Creacion,
        Id_Modificador,
        Fecha_Modificacion
    FROM [SQM_GENERAL].[Tbl_Instituciones]
    WHERE @Busqueda IS NULL 
       OR @Busqueda = ''
       OR Nombre_Institucion LIKE '%' + @Busqueda + '%'
    ORDER BY Id_Institucion ASC;
END;
GO