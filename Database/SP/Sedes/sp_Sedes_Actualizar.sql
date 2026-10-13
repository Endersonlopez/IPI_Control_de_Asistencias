USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Sedes_Actualizar]
    @Id_Sede INT,
    @Id_Institucion INT,
    @Nombre_Sede VARCHAR(150),
    @Id_Estado INT = NULL,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_GENERAL].[Tbl_Sedes]
    SET Id_Institucion = @Id_Institucion,
        Nombre_Sede = @Nombre_Sede,
        Id_Estado = ISNULL(@Id_Estado, Id_Estado), 
        Id_Modificador = @Id_Modificador,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Sede = @Id_Sede;

    SELECT @Id_Sede;
END;
GO