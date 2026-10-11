USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Profesores_Listar]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        P.Id_Profesor,
        P.Id_Usuario,
        U.Primer_Nombre,
        U.Segundo_Nombre,
        U.Primer_Apellido,
        U.Segundo_Apellido,
        U.Primer_Nombre + ' ' + ISNULL(U.Segundo_Nombre + ' ', '') + U.Primer_Apellido + ' ' + ISNULL(U.Segundo_Apellido, '') AS Nombre_Completo,
        U.Nombre_Usuario,
        U.Correo_Electronico,
        U.Telefono,
        P.Facultad,
        P.Id_Estado,
        E.Nombre_Estado,
        P.Fecha_Creacion
    FROM [SQM_GENERAL].[Tbl_Profesores] P
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] U ON P.Id_Usuario = U.Id_Usuario
    INNER JOIN [SQM_CATALOGOS].[Tbl_Estados] E ON P.Id_Estado = E.Id_Estado
    ORDER BY U.Primer_Nombre, U.Primer_Apellido;
END;
GO