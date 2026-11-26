USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Asistencias_Filtrar]
    @Busqueda VARCHAR(100) = NULL,
    @FechaInicio DATE = NULL,
    @FechaFin DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        a.Id_Asistencia,
        a.Id_Alumno,
        ISNULL(ua.Primer_Nombre + ' ' + ua.Primer_Apellido, 'Sin Alumno') AS Nombre_Alumno,
        ISNULL(al.Id_Estado, 1) AS Id_Estado_Alumno,
        
        ISNULL(h.Id_Materia, 0) AS Id_Materia,
        ISNULL(m.Nombre_Materia, 'Sin Clase') AS Nombre_Materia,
        ISNULL(m.Codigo_Materia, 'N/A') AS Codigo_Materia,
        
        ISNULL(h.Id_Profesor, 0) AS Id_Profesor,
        ISNULL(up.Primer_Nombre + ' ' + up.Primer_Apellido, 'Sin Profesor') AS Nombre_Profesor,
        
        a.Fecha,
        a.Hora,
        
        a.Id_Estado_Asistencia,
        ISNULL(ea.Nombre_Estado, 'Presente') AS Nombre_Estado_Asistencia,
        ISNULL(ea.Descripcion, '') AS Descripcion,
        
        a.Id_Estado,
        CASE WHEN a.Id_Estado = 1 THEN 'Activo' ELSE 'Inactivo' END AS Nombre_Estado,
        
        a.Id_Creador,
        a.Fecha_Creacion,
        a.Id_Modificador,
        a.Fecha_Modificacion,
        
        ISNULL(CONVERT(VARCHAR(8), h.Hora_Inicio, 108), '00:00:00') AS Hora_Clase_Inicio,
        ISNULL(CONVERT(VARCHAR(8), h.Hora_Fin, 108), '00:00:00') AS Hora_Clase_Fin,

        -- Nuevo campo calculado de retraso
        CASE 
            WHEN h.Hora_Inicio IS NULL OR h.Hora_Inicio = '00:00:00' THEN 'N/A'
            WHEN DATEDIFF(MINUTE, h.Hora_Inicio, a.Hora) <= 0 THEN 'A tiempo'
            ELSE CONCAT('+', DATEDIFF(MINUTE, h.Hora_Inicio, a.Hora), ' min')
        END AS Retraso,
        ISNULL(DATEDIFF(MINUTE, h.Hora_Inicio, a.Hora), 0) AS Minutos_Retraso

    FROM [SQM_GENERAL].[Tbl_Asistencias] a
    LEFT JOIN [SQM_GENERAL].[Tbl_Horarios] h ON a.Id_Horario = h.Id_Horario
    LEFT JOIN [SQM_CATALOGOS].[Tbl_Materias] m ON h.Id_Materia = m.Id_Materia
    LEFT JOIN [SQM_GENERAL].[Tbl_Alumnos] al ON a.Id_Alumno = al.Id_Alumno
    LEFT JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] ua ON al.Id_Usuario = ua.Id_Usuario
    LEFT JOIN [SQM_GENERAL].[Tbl_Profesores] prof ON h.Id_Profesor = prof.Id_Profesor
    LEFT JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] up ON prof.Id_Usuario = up.Id_Usuario
    LEFT JOIN [SQM_CATALOGOS].[Tbl_Estados_Asistencia] ea ON a.Id_Estado_Asistencia = ea.Id_Estado_Asistencia
    WHERE (a.Id_Estado = 1 OR a.Id_Estado IS NULL)
      AND (@FechaInicio IS NULL OR a.Fecha >= @FechaInicio)
      AND (@FechaFin IS NULL OR a.Fecha <= @FechaFin)
      AND (@Busqueda IS NULL OR (
            ua.Primer_Nombre LIKE '%' + @Busqueda + '%' OR
            ua.Primer_Apellido LIKE '%' + @Busqueda + '%' OR
            up.Primer_Nombre LIKE '%' + @Busqueda + '%' OR
            up.Primer_Apellido LIKE '%' + @Busqueda + '%' OR
            m.Nombre_Materia LIKE '%' + @Busqueda + '%' OR
            m.Codigo_Materia LIKE '%' + @Busqueda + '%'
      ))
    ORDER BY a.Fecha DESC, a.Hora DESC, a.Id_Asistencia DESC;
END;
GO