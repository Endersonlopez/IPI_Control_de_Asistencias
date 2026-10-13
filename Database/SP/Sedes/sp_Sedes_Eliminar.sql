USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Sedes_Eliminar]
    @Id_Sede INT,
    @Id_Estado_Inactivo INT = 2,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_GENERAL].[Tbl_Sedes]
    SET Id_Estado = @Id_Estado_Inactivo,
        Id_Modificador = @Id_Modificador,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Sede = @Id_Sede;
END;
GO