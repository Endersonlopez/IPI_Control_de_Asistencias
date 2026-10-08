USE [DB_IPI_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Horarios_Clases]
    @Id_Usuario INT,
    @EsAdmin BIT = 0   -- 1 = administrador (ver todas las clases)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        h.Id_Horario,
        h.Id_Materia,
        m.Nombre_Materia,
        m.Codigo_Materia,
        p.Id_Profesor,
        CONCAT(u.Primer_Nombre, ' ', u.Primer_Apellido) AS Nombre_Profesor,
        h.Dia_Semana,
        CASE h.Dia_Semana 
            WHEN 1 THEN 'Domingo'
            WHEN 2 THEN 'Lunes'
            WHEN 3 THEN 'Martes'
            WHEN 4 THEN 'Miércoles'
            WHEN 5 THEN 'Jueves'
            WHEN 6 THEN 'Viernes'
            WHEN 7 THEN 'Sábado'
            ELSE 'Desconocido'
        END AS Nombre_Dia,
        CONVERT(VARCHAR(8), h.Hora_Inicio, 108) AS Hora_Inicio,
        CONVERT(VARCHAR(8), h.Hora_Fin, 108) AS Hora_Fin,
        ISNULL((
            SELECT COUNT(am.Id_Alumno) 
            FROM [SQM_GENERAL].[Tbl_Alumnos_Materias] am 
            WHERE am.Id_Materia = h.Id_Materia 
              AND am.Id_Estado = 1
        ), 0) AS Alumnos_Inscritos,
        h.Id_Estado AS Estado_Horario
    FROM [SQM_GENERAL].[Tbl_Horarios] h
    INNER JOIN [SQM_GENERAL].[Tbl_Profesores] p ON h.Id_Profesor = p.Id_Profesor
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] u ON p.Id_Usuario = u.Id_Usuario
    INNER JOIN [SQM_CATALOGOS].[Tbl_Materias] m ON h.Id_Materia = m.Id_Materia
    WHERE (@EsAdmin = 1 OR p.Id_Usuario = @Id_Usuario);  -- Si es admin, no filtra por profesor
END;
GO