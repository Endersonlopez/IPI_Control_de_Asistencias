USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Obtener_Profesores]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.Id_Profesor,
        u.Id_Usuario,
        u.Primer_Nombre,
        u.Segundo_Nombre,
        u.Primer_Apellido,
        u.Segundo_Apellido,
        CONCAT(u.Primer_Nombre, ' ', ISNULL(u.Segundo_Nombre + ' ', ''), u.Primer_Apellido, ' ', ISNULL(u.Segundo_Apellido, '')) AS Nombre_Completo,
        u.Nombre_Usuario,
        u.Correo_Electronico,
        u.Telefono,
        p.Especialidad,
        p.Departamento,
        p.Facultad,
        p.Fecha_Creacion
    FROM [SQM_GENERAL].[Tbl_Profesores] p
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] u ON p.Id_Usuario = u.Id_Usuario
    WHERE p.Id_Estado = 1 
      AND u.Id_Estado = 1
    ORDER BY u.Primer_Nombre, u.Primer_Apellido;
END;
GO