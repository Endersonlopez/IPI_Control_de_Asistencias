USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Estados_Insertar]
    @Nombre_Estado VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [SQM_CATALOGOS].[Tbl_Estados] (Nombre_Estado)
    VALUES (@Nombre_Estado);

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id_Estado;
END;
GO