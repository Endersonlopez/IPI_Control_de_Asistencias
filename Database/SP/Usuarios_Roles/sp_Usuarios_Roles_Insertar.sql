USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_Roles_Insertar]
    @Id_Usuario INT,
    @Id_Rol INT,
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [SQM_SEGURIDAD].[Tbl_Usuarios_Roles] (
        Id_Usuario,
        Id_Rol,
        Id_Creador,
        Fecha_Creacion
    )
    VALUES (
        @Id_Usuario,
        @Id_Rol,
        @Id_Creador,
        GETDATE()
    );

    SELECT SCOPE_IDENTITY() AS Id_Usuario_Rol;
END;
GO