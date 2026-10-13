USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Roles_Actualizar]
    @Id_Rol INT,
    @Nombre_Rol VARCHAR(50),
    @Descripcion VARCHAR(150),
    @Id_Estado INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [SQM_CATALOGOS].[Tbl_Roles]
    SET Nombre_Rol = @Nombre_Rol,
        Descripcion = @Descripcion,
        Id_Estado = @Id_Estado
    WHERE Id_Rol = @Id_Rol;
END;
GO