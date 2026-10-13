USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Roles_Insertar]
    @Nombre_Rol VARCHAR(50),
    @Descripcion VARCHAR(150),
    @Id_Estado INT = 1 
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [SQM_CATALOGOS].[Tbl_Roles] (Nombre_Rol, Descripcion, Id_Estado)
    VALUES (@Nombre_Rol, @Descripcion, @Id_Estado);
    
    SELECT SCOPE_IDENTITY() AS IdGenerado;
END;
GO