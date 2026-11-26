USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Asistencias_ListarFiltrar]
    @Busqueda VARCHAR(100) = NULL,
    @FechaInicio DATE = NULL,
    @FechaFin DATE = NULL,
    @Id_Clase INT = NULL,
    @EstadoAsistencia VARCHAR(20) = NULL,
    @Id_Usuario INT = NULL,
    @EsAdmin BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    -- Asistencias registradas (sin cambios)
    SELECT 
        a.Id_Asistencia,
        a.Id_Alumno,
        ISNULL(ua.Primer_Nombre + ' ' + ua.Primer_Apellido, 'Sin Alumno') AS Nombre_Alumno,
        ISNULL(al.Id_Estado, 1) AS Id_Estado_Alumno,
        h.Id_Materia,
        ISNULL(m.Nombre_Materia, 'Sin Clase') AS Nombre_Materia,
        ISNULL(m.Codigo_Materia, 'N/A') AS Codigo_Materia,
        h.Id_Profesor,
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
        CONVERT(VARCHAR(8), h.Hora_Inicio, 108) AS Hora_Clase_Inicio,
        CONVERT(VARCHAR(8), h.Hora_Fin, 108) AS Hora_Clase_Fin,
        CASE 
            WHEN h.Hora_Inicio IS NULL OR h.Hora_Inicio = '00:00:00' THEN 'N/A'
            WHEN DATEDIFF(MINUTE, h.Hora_Inicio, a.Hora) <= 0 THEN 
                CONCAT(DATEDIFF(MINUTE, h.Hora_Inicio, a.Hora), ' min')
            ELSE CONCAT('+', DATEDIFF(MINUTE, h.Hora_Inicio, a.Hora), ' min')
        END AS Retraso,
        ISNULL(DATEDIFF(MINUTE, h.Hora_Inicio, a.Hora), 0) AS Minutos_Retraso,
        0 AS EsAusente,
        CASE WHEN @EsAdmin = 1 THEN m.Nombre_Materia ELSE (ua.Primer_Nombre + ' ' + ua.Primer_Apellido) END AS OrdenarPor
    FROM [SQM_GENERAL].[Tbl_Asistencias] a
    INNER JOIN [SQM_GENERAL].[Tbl_Horarios] h ON a.Id_Horario = h.Id_Horario
    INNER JOIN [SQM_CATALOGOS].[Tbl_Materias] m ON h.Id_Materia = m.Id_Materia
    LEFT JOIN [SQM_GENERAL].[Tbl_Alumnos] al ON a.Id_Alumno = al.Id_Alumno
    LEFT JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] ua ON al.Id_Usuario = ua.Id_Usuario
    LEFT JOIN [SQM_GENERAL].[Tbl_Profesores] prof ON h.Id_Profesor = prof.Id_Profesor
    LEFT JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] up ON prof.Id_Usuario = up.Id_Usuario
    LEFT JOIN [SQM_CATALOGOS].[Tbl_Estados_Asistencia] ea ON a.Id_Estado_Asistencia = ea.Id_Estado_Asistencia
    WHERE (a.Id_Estado = 1 OR a.Id_Estado IS NULL)
      AND (@FechaInicio IS NULL OR a.Fecha >= @FechaInicio)
      AND (@FechaFin IS NULL OR a.Fecha <= @FechaFin)
      AND (@Id_Clase IS NULL OR h.Id_Materia = @Id_Clase)
      AND (@EstadoAsistencia IS NULL OR ea.Nombre_Estado = @EstadoAsistencia)
      AND (@Id_Usuario IS NULL OR prof.Id_Usuario = @Id_Usuario)
      AND (@Busqueda IS NULL OR (
            ua.Primer_Nombre LIKE '%' + @Busqueda + '%' OR
            ua.Primer_Apellido LIKE '%' + @Busqueda + '%' OR
            up.Primer_Nombre LIKE '%' + @Busqueda + '%' OR
            up.Primer_Apellido LIKE '%' + @Busqueda + '%' OR
            m.Nombre_Materia LIKE '%' + @Busqueda + '%' OR
            m.Codigo_Materia LIKE '%' + @Busqueda + '%'
      ))

    UNION ALL

    -- Alumnos ausentes (genera una fila por cada clase a la que faltaron)
    SELECT 
        0 AS Id_Asistencia,
        am.Id_Alumno,
        ISNULL(ua.Primer_Nombre + ' ' + ua.Primer_Apellido, 'Sin Alumno') AS Nombre_Alumno,
        ISNULL(al.Id_Estado, 1) AS Id_Estado_Alumno,
        m.Id_Materia,
        m.Nombre_Materia,
        m.Codigo_Materia,
        p.Id_Profesor,
        ISNULL(up.Primer_Nombre + ' ' + up.Primer_Apellido, 'Sin Profesor') AS Nombre_Profesor,
        DATEADD(DAY, (h.Dia_Semana - DATEPART(WEEKDAY, @FechaInicio) + 7) % 7 + n.number * 7, @FechaInicio) AS Fecha,
        CAST('00:00' AS TIME) AS Hora,
        3 AS Id_Estado_Asistencia,
        'Ausente' AS Nombre_Estado_Asistencia,
        'No registró asistencia' AS Descripcion,
        1 AS Id_Estado,
        'Activo' AS Nombre_Estado,
        0 AS Id_Creador,
        CAST('1900-01-01' AS DATETIME) AS Fecha_Creacion,
        0 AS Id_Modificador,
        NULL AS Fecha_Modificacion,
        CONVERT(VARCHAR(8), h.Hora_Inicio, 108) AS Hora_Clase_Inicio,
        CONVERT(VARCHAR(8), h.Hora_Fin, 108) AS Hora_Clase_Fin,
        'N/A' AS Retraso,
        0 AS Minutos_Retraso,
        1 AS EsAusente,
        CASE WHEN @EsAdmin = 1 THEN m.Nombre_Materia ELSE (ua.Primer_Nombre + ' ' + ua.Primer_Apellido) END AS OrdenarPor
    FROM [SQM_GENERAL].[Tbl_Alumnos_Materias] am
    INNER JOIN [SQM_CATALOGOS].[Tbl_Materias] m ON am.Id_Materia = m.Id_Materia
    INNER JOIN [SQM_GENERAL].[Tbl_Horarios] h ON h.Id_Materia = m.Id_Materia
    INNER JOIN [SQM_GENERAL].[Tbl_Profesores] p ON h.Id_Profesor = p.Id_Profesor
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] up ON p.Id_Usuario = up.Id_Usuario
    INNER JOIN [SQM_GENERAL].[Tbl_Alumnos] al ON am.Id_Alumno = al.Id_Alumno
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] ua ON al.Id_Usuario = ua.Id_Usuario
    CROSS JOIN (
        SELECT TOP (DATEDIFF(DAY, @FechaInicio, @FechaFin) / 7 + 1)
               ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 AS number
        FROM master.dbo.spt_values
    ) AS n
    WHERE am.Id_Estado = 1
      AND al.Id_Estado = 1
      AND @FechaInicio IS NOT NULL
      AND @FechaFin IS NOT NULL
      AND DATEADD(DAY, (h.Dia_Semana - DATEPART(WEEKDAY, @FechaInicio) + 7) % 7 + n.number * 7, @FechaInicio) <= @FechaFin
      AND NOT EXISTS (
          SELECT 1 FROM [SQM_GENERAL].[Tbl_Asistencias] a
          WHERE a.Id_Alumno = am.Id_Alumno
            AND a.Id_Horario = h.Id_Horario
            AND a.Fecha = DATEADD(DAY, (h.Dia_Semana - DATEPART(WEEKDAY, @FechaInicio) + 7) % 7 + n.number * 7, @FechaInicio)
      )
      AND (@Id_Clase IS NULL OR h.Id_Materia = @Id_Clase)
      AND (@Id_Usuario IS NULL OR p.Id_Usuario = @Id_Usuario)
      AND (@Busqueda IS NULL OR (
            ua.Primer_Nombre LIKE '%' + @Busqueda + '%' OR
            ua.Primer_Apellido LIKE '%' + @Busqueda + '%'
      ))
      AND (@EstadoAsistencia IS NULL OR @EstadoAsistencia = 'Ausente')

    ORDER BY OrdenarPor, Fecha DESC, Hora DESC, Id_Asistencia DESC;
END;
GO