USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Sedes_Insertar]
    @Id_Institucion INT,
    @Nombre_Sede VARCHAR(150),
    @Id_Estado INT = 1,
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [SQM_GENERAL].[Tbl_Sedes] (
        Id_Institucion,
        Nombre_Sede, 
        Id_Estado, 
        Id_Creador, 
        Fecha_Creacion
    )
    VALUES (
        @Id_Institucion,
        @Nombre_Sede, 
        @Id_Estado, 
        @Id_Creador, 
        GETDATE()
    );

    SELECT SCOPE_IDENTITY() AS Id_Sede;
END;
GO