USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_Roles_Listar]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        UR.Id_Usuario_Rol,
        UR.Id_Usuario,
        UR.Id_Rol,
        UR.Id_Creador,
        UR.Fecha_Creacion
    FROM [SQM_SEGURIDAD].[Tbl_Usuarios_Roles] UR;
END;
GO