USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Asistencias_Eliminar]
    @Id_Asistencia INT,
    @Id_Modificador INT,
    @Id_Estado_Inactivo INT = 2
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_GENERAL].[Tbl_Asistencias]
    SET Id_Estado = @Id_Estado_Inactivo,
        Id_Modificador = @Id_Modificador,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Asistencia = @Id_Asistencia;

    SELECT @Id_Asistencia AS Id_Asistencia;
END;
GO