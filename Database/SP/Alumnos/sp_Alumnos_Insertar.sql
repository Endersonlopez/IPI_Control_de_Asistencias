USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Alumnos_Insertar]
    @Id_Usuario INT,
    @Id_Grado INT,
    @Documento_Identidad VARCHAR(50),
    @Id_Estado INT = 1, 
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [SQM_GENERAL].[Tbl_Alumnos] (
        Id_Usuario, 
        Id_Grado, 
        Documento_Identidad, 
        Id_Estado, 
        Id_Creador, 
        Fecha_Creacion
    )
    VALUES (
        @Id_Usuario, 
        @Id_Grado, 
        @Documento_Identidad, 
        @Id_Estado, 
        @Id_Creador, 
        GETDATE()
    );

    SELECT SCOPE_IDENTITY() AS Id_Alumno;
END;
GO