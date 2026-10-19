USE [DB_Control_Asistencias];
GO

-- PRUEBA ACTUALIZAR
CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_Roles_Actualizar]
    @Id_Usuario_Rol INT,
    @Id_Rol INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [SQM_SEGURIDAD].[Tbl_Usuarios_Roles]
    SET Id_Rol = @Id_Rol
    WHERE Id_Usuario_Rol = @Id_Usuario_Rol;
END;
GO