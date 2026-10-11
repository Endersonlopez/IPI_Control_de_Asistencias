USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Asistencias_PorAlumno]
    @Id_Alumno INT
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

        -- Calcula la fecha y hora de inicio de la clase (ajustada al día de la semana correcto)
        DATEADD(MINUTE, DATEDIFF(MINUTE, 0, h.Hora_Inicio),
            DATEADD(DAY, (h.Dia_Semana - DATEPART(WEEKDAY, a.Fecha) + 7) % 7, CAST(a.Fecha AS DATETIME))
        ) AS FechaHora_Inicio_Clase,

        -- Retraso corregido (negativo para llegadas tempranas, positivo para tardías)
        CASE 
            WHEN h.Hora_Inicio IS NULL OR h.Hora_Inicio = '00:00:00' THEN 'N/A'
            WHEN DATEDIFF(MINUTE, 
                DATEADD(MINUTE, DATEDIFF(MINUTE, 0, h.Hora_Inicio),
                    DATEADD(DAY, (h.Dia_Semana - DATEPART(WEEKDAY, a.Fecha) + 7) % 7, CAST(a.Fecha AS DATETIME))
                ),
                CAST(a.Fecha AS DATETIME) + CAST(a.Hora AS DATETIME)
            ) < 0 THEN 
                CONCAT(DATEDIFF(MINUTE, 
                    DATEADD(MINUTE, DATEDIFF(MINUTE, 0, h.Hora_Inicio),
                        DATEADD(DAY, (h.Dia_Semana - DATEPART(WEEKDAY, a.Fecha) + 7) % 7, CAST(a.Fecha AS DATETIME))
                    ),
                    CAST(a.Fecha AS DATETIME) + CAST(a.Hora AS DATETIME)
                ), ' min')
            WHEN DATEDIFF(MINUTE, 
                DATEADD(MINUTE, DATEDIFF(MINUTE, 0, h.Hora_Inicio),
                    DATEADD(DAY, (h.Dia_Semana - DATEPART(WEEKDAY, a.Fecha) + 7) % 7, CAST(a.Fecha AS DATETIME))
                ),
                CAST(a.Fecha AS DATETIME) + CAST(a.Hora AS DATETIME)
            ) = 0 THEN 'A tiempo'
            ELSE CONCAT('+', DATEDIFF(MINUTE, 
                DATEADD(MINUTE, DATEDIFF(MINUTE, 0, h.Hora_Inicio),
                    DATEADD(DAY, (h.Dia_Semana - DATEPART(WEEKDAY, a.Fecha) + 7) % 7, CAST(a.Fecha AS DATETIME))
                ),
                CAST(a.Fecha AS DATETIME) + CAST(a.Hora AS DATETIME)
            ), ' min')
        END AS Retraso,
        ISNULL(DATEDIFF(MINUTE, 
            DATEADD(MINUTE, DATEDIFF(MINUTE, 0, h.Hora_Inicio),
                DATEADD(DAY, (h.Dia_Semana - DATEPART(WEEKDAY, a.Fecha) + 7) % 7, CAST(a.Fecha AS DATETIME))
            ),
            CAST(a.Fecha AS DATETIME) + CAST(a.Hora AS DATETIME)
        ), 0) AS Minutos_Retraso

    FROM [SQM_GENERAL].[Tbl_Asistencias] a
    LEFT JOIN [SQM_GENERAL].[Tbl_Horarios] h ON a.Id_Horario = h.Id_Horario
    LEFT JOIN [SQM_CATALOGOS].[Tbl_Materias] m ON h.Id_Materia = m.Id_Materia
    LEFT JOIN [SQM_GENERAL].[Tbl_Alumnos] al ON a.Id_Alumno = al.Id_Alumno
    LEFT JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] ua ON al.Id_Usuario = ua.Id_Usuario
    LEFT JOIN [SQM_GENERAL].[Tbl_Profesores] prof ON h.Id_Profesor = prof.Id_Profesor
    LEFT JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] up ON prof.Id_Usuario = up.Id_Usuario
    LEFT JOIN [SQM_CATALOGOS].[Tbl_Estados_Asistencia] ea ON a.Id_Estado_Asistencia = ea.Id_Estado_Asistencia
    WHERE a.Id_Alumno = @Id_Alumno AND a.Id_Estado = 1
    ORDER BY a.Fecha DESC, a.Hora DESC;
END;
GO