USE DB_IPI_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Materias_Eliminar]
    @Id_Materia INT,
    @Id_Estado_Inactivo INT = 2,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_CATALOGOS].[Tbl_Materias]
    SET Id_Estado = @Id_Estado_Inactivo,
        Id_Modificador = @Id_Modificador,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Materia = @Id_Materia;

    SELECT @Id_Materia AS Id_Materia;
END;
GO