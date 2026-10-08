USE [DB_IPI_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Obtener_Todos_Alumnos]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        a.Id_Alumno,
        u.Id_Usuario,
        CONCAT(u.Primer_Nombre, ' ', u.Primer_Apellido) AS Nombre_Completo,
        a.Id_Estado AS Estado_Alumno
    FROM [SQM_GENERAL].[Tbl_Alumnos] a
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] u ON a.Id_Usuario = u.Id_Usuario
    WHERE a.Id_Estado = 1
    ORDER BY u.Primer_Apellido, u.Primer_Nombre;
END;
GO