USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Roles_Filtrar]
    @Busqueda VARCHAR(100),
    @Id_Estado_Activo INT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        R.Id_Rol, 
        R.Nombre_Rol, 
        R.Descripcion,
        R.Id_Estado,
        E.Nombre_Estado
    FROM [SQM_CATALOGOS].[Tbl_Roles] R
    INNER JOIN [SQM_CATALOGOS].[Tbl_Estados] E ON R.Id_Estado = E.Id_Estado
    WHERE R.Id_Estado = @Id_Estado_Activo
      AND (R.Nombre_Rol LIKE '%' + @Busqueda + '%'
           OR R.Descripcion LIKE '%' + @Busqueda + '%');
END;
GO