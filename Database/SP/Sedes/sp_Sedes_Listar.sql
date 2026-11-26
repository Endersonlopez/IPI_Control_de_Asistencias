USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Sedes_Listar]
    @Id_Estado_Activo INT = 1
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        S.Id_Sede,
        S.Id_Institucion,    
        I.Nombre_Institucion,
        S.Nombre_Sede,
        S.Id_Estado,         
        E.Nombre_Estado,
        S.Id_Creador,
        S.Id_Modificador,
        S.Fecha_Creacion,
        S.Fecha_Modificacion
    FROM [SQM_GENERAL].[Tbl_Sedes] S
    INNER JOIN [SQM_GENERAL].[Tbl_Instituciones] I ON S.Id_Institucion = I.Id_Institucion
    INNER JOIN [SQM_CATALOGOS].[Tbl_Estados] E ON S.Id_Estado = E.Id_Estado
    WHERE S.Id_Estado = @Id_Estado_Activo;
END;
GO