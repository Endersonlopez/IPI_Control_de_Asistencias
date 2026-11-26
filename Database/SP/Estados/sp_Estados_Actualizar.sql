USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Estados_Actualizar]
    @Id_Estado INT,
    @Nombre_Estado VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_CATALOGOS].[Tbl_Estados]
    SET Nombre_Estado = @Nombre_Estado
    WHERE Id_Estado = @Id_Estado;

    SELECT CAST(@Id_Estado AS INT) AS Id_Estado;
END;
GO