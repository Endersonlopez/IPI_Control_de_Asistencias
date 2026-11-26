USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Eliminar_Horario_Clase]
    @Id_Horario INT,
    @Id_Modificador INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_GENERAL].[Tbl_Horarios]
    SET Id_Estado = 2,
        Id_Modificador = @Id_Modificador,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Horario = @Id_Horario;
END;
GO