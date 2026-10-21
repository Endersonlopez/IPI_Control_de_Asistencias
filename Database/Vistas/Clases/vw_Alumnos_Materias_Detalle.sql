USE [DB_Control_Asistencias];
GO

CREATE OR ALTER VIEW [SQM_GENERAL].[vw_Alumnos_Materias_Detalle]
AS
SELECT 
    am.Id_Materia,
    a.Id_Alumno,
    u.Id_Usuario,
    CONCAT(u.Primer_Nombre, ' ', u.Primer_Apellido) AS Nombre_Completo,
    am.Id_Estado AS Estado_Inscripcion
FROM [SQM_GENERAL].[Tbl_Alumnos_Materias] am
INNER JOIN [SQM_GENERAL].[Tbl_Alumnos] a ON am.Id_Alumno = a.Id_Alumno
INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] u ON a.Id_Usuario = u.Id_Usuario;
GO