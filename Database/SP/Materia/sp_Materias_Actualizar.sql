USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Materias_Actualizar]
    @Id_Materia INT,
    @Nombre_Materia VARCHAR(100),
    @Id_Estado INT,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_CATALOGOS].[Tbl_Materias]
    SET Nombre_Materia = @Nombre_Materia,
        Id_Estado = @Id_Estado,
        Id_Modificador = @Id_Modificador,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Materia = @Id_Materia;

    SELECT @Id_Materia AS Id_Materia;
END;
GO