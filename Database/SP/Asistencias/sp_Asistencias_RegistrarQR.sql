USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Asistencias_RegistrarQR]
    @Id_Horario INT,
    @Id_Alumno INT,
    @TokenQR VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Id_Materia INT;
    DECLARE @Hora_Inicio TIME;
    DECLARE @Hora_Fin TIME;
    DECLARE @TimestampMs BIGINT;
    DECLARE @SegundosValidez INT = 30;
    DECLARE @DiferenciaMinutos INT;
    DECLARE @Id_Estado_Asistencia INT;

    SELECT @SegundosValidez = ISNULL(cu.Tiempo_QR, 30)
    FROM [SQM_GENERAL].[Tbl_Horarios] h
    INNER JOIN [SQM_GENERAL].[Tbl_Profesores] p ON h.Id_Profesor = p.Id_Profesor
    LEFT JOIN [SQM_SEGURIDAD].[Tbl_Configuracion_Usuario] cu ON p.Id_Usuario = cu.Id_Usuario
    WHERE h.Id_Horario = @Id_Horario;

    IF @TokenQR NOT LIKE 'ASISTENCIA-%'
    BEGIN
        RAISERROR('Formato de QR no válido.', 16, 1);
        RETURN;
    END

    DECLARE @UltimoGuion INT = LEN(@TokenQR) - CHARINDEX('-', REVERSE(@TokenQR)) + 1;
    BEGIN TRY
        SET @TimestampMs = CAST(SUBSTRING(@TokenQR, @UltimoGuion + 1, LEN(@TokenQR) - @UltimoGuion) AS BIGINT);
    END TRY
    BEGIN CATCH
        RAISERROR('Timestamp inválido en el QR.', 16, 1);
        RETURN;
    END CATCH

    DECLARE @AhoraMs BIGINT = DATEDIFF_BIG(MILLISECOND, '1970-01-01', GETUTCDATE());
    IF ABS(@AhoraMs - @TimestampMs) > @SegundosValidez * 1000
    BEGIN
        RAISERROR('El código QR ha expirado.', 16, 1);
        RETURN;
    END

    SELECT @Id_Materia = h.Id_Materia,
           @Hora_Inicio = h.Hora_Inicio,
           @Hora_Fin = h.Hora_Fin
    FROM [SQM_GENERAL].[Tbl_Horarios] h
    WHERE h.Id_Horario = @Id_Horario AND h.Id_Estado = 1;

    IF @Id_Materia IS NULL
    BEGIN
        RAISERROR('El horario no existe o no está activo.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM [SQM_GENERAL].[Tbl_Alumnos] WHERE Id_Alumno = @Id_Alumno AND Id_Estado = 1)
    BEGIN
        RAISERROR('El alumno no existe o no está activo.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1
        FROM [SQM_GENERAL].[Tbl_Alumnos_Materias]
        WHERE Id_Alumno = @Id_Alumno
          AND Id_Materia = @Id_Materia
          AND Id_Estado = 1
    )
    BEGIN
        RAISERROR('Acceso denegado. No estás inscrito en esta clase.', 16, 1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1 FROM [SQM_GENERAL].[Tbl_Asistencias]
        WHERE Id_Horario = @Id_Horario
          AND Id_Alumno = @Id_Alumno
          AND CAST(Fecha AS DATE) = CAST(GETDATE() AS DATE)
    )
    BEGIN
        RAISERROR('Ya registraste tu asistencia en esta clase hoy.', 16, 1);
        RETURN;
    END

    DECLARE @Hora_Actual TIME = CAST(GETDATE() AS TIME);
    SET @DiferenciaMinutos = DATEDIFF(MINUTE, @Hora_Inicio, @Hora_Actual);

    IF @DiferenciaMinutos <= 0
        SET @Id_Estado_Asistencia = 1;
    ELSE IF @DiferenciaMinutos BETWEEN 1 AND 15
        SET @Id_Estado_Asistencia = 6;
    ELSE IF @DiferenciaMinutos > 15 AND @Hora_Actual <= @Hora_Fin
        SET @Id_Estado_Asistencia = 3;
    ELSE
    BEGIN
        SET @Id_Estado_Asistencia = 2;
        RAISERROR('La clase ya finalizó. Se registró como ausente.', 10, 1) WITH NOWAIT;
    END

    INSERT INTO [SQM_GENERAL].[Tbl_Asistencias] (
        Id_Alumno, Id_Horario, Fecha, Hora,
        Id_Estado_Asistencia, Id_Estado, Id_Creador, Fecha_Creacion
    )
    VALUES (
        @Id_Alumno, @Id_Horario, CAST(GETDATE() AS DATE), @Hora_Actual,
        @Id_Estado_Asistencia, 1, 1, GETDATE()
    );

    SELECT
        m.Nombre_Materia,
        m.Codigo_Materia,
        CONCAT(u.Primer_Nombre, ' ', u.Primer_Apellido) AS Nombre_Profesor,
        CONVERT(VARCHAR(8), h.Hora_Inicio, 108) AS Hora_Inicio,
        CONVERT(VARCHAR(8), h.Hora_Fin, 108) AS Hora_Fin
    FROM [SQM_GENERAL].[Tbl_Horarios] h
    INNER JOIN [SQM_CATALOGOS].[Tbl_Materias] m ON h.Id_Materia = m.Id_Materia
    INNER JOIN [SQM_GENERAL].[Tbl_Profesores] p ON h.Id_Profesor = p.Id_Profesor
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] u ON p.Id_Usuario = u.Id_Usuario
    WHERE h.Id_Horario = @Id_Horario;
END;
GO