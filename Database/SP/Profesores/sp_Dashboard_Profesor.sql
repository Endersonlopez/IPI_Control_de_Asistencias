USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Dashboard_Profesor]
    @Id_Usuario INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        a.Id_Alumno,
        u_alumno.Primer_Nombre + ' ' + u_alumno.Primer_Apellido AS Nombre_Completo,
        a.Fecha_Creacion
    FROM [SQM_GENERAL].[Tbl_Alumnos_Materias] am
    INNER JOIN [SQM_GENERAL].[Tbl_Horarios] h ON am.Id_Materia = h.Id_Materia
    INNER JOIN [SQM_GENERAL].[Tbl_Profesores] p ON h.Id_Profesor = p.Id_Profesor
    INNER JOIN [SQM_GENERAL].[Tbl_Alumnos] a ON am.Id_Alumno = a.Id_Alumno
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] u_alumno ON a.Id_Usuario = u_alumno.Id_Usuario
    WHERE p.Id_Usuario = @Id_Usuario AND am.Id_Estado = 1 AND a.Id_Estado = 1
    GROUP BY a.Id_Alumno, u_alumno.Primer_Nombre, u_alumno.Primer_Apellido, a.Fecha_Creacion;

    SELECT 
        asis.Id_Asistencia,
        asis.Id_Alumno,
        ua.Primer_Nombre + ' ' + ua.Primer_Apellido AS nombre_Alumno,
        m.Nombre_Materia,
        m.Codigo_Materia,
        up.Primer_Nombre + ' ' + up.Primer_Apellido AS nombre_Profesor,
        asis.Fecha,
        asis.Hora,
        ea.Nombre_Estado AS nombre_Estado_Asistencia,
        CONVERT(VARCHAR(8), h.Hora_Inicio, 108) AS hora_Clase_Inicio,
        CONVERT(VARCHAR(8), h.Hora_Fin, 108) AS hora_Clase_Fin
    FROM [SQM_GENERAL].[Tbl_Asistencias] asis
    INNER JOIN [SQM_GENERAL].[Tbl_Horarios] h ON asis.Id_Horario = h.Id_Horario
    INNER JOIN [SQM_GENERAL].[Tbl_Profesores] p ON h.Id_Profesor = p.Id_Profesor
    INNER JOIN [SQM_CATALOGOS].[Tbl_Materias] m ON h.Id_Materia = m.Id_Materia
    INNER JOIN [SQM_GENERAL].[Tbl_Alumnos] al ON asis.Id_Alumno = al.Id_Alumno
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] ua ON al.Id_Usuario = ua.Id_Usuario
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] up ON p.Id_Usuario = up.Id_Usuario
    INNER JOIN [SQM_CATALOGOS].[Tbl_Estados_Asistencia] ea ON asis.Id_Estado_Asistencia = ea.Id_Estado_Asistencia
    WHERE p.Id_Usuario = @Id_Usuario AND asis.Id_Estado = 1
    ORDER BY asis.Fecha DESC;
END;
GO