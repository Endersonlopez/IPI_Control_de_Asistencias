USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Asistencias_Insertar]
    @Id_Alumno INT,
    @Id_Materia INT,
    @Id_Profesor INT,
    @Fecha DATE = NULL,
    @Hora TIME = NULL,
    @Id_Estado INT = 1,
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;
    SET DATEFIRST 1;

    DECLARE @FechaFinal DATE = ISNULL(@Fecha, CAST(GETDATE() AS DATE));
    DECLARE @HoraFinal TIME = ISNULL(@Hora, CAST(GETDATE() AS TIME));
    DECLARE @DiaSemana INT;
    DECLARE @Id_Horario INT;
    DECLARE @HoraInicio TIME;
    DECLARE @HoraFin TIME;
    DECLARE @DiferenciaMinutos INT;
    DECLARE @Id_Estado_Asistencia INT;

    IF NOT EXISTS (
        SELECT 1
        FROM [SQM_GENERAL].[Tbl_Alumnos_Materias]
        WHERE Id_Alumno = @Id_Alumno
          AND Id_Materia = @Id_Materia
          AND Id_Estado = 1
    )
    BEGIN
        RAISERROR('El alumno no está inscrito en la materia especificada.', 16, 1);
        RETURN;
    END

    SET @DiaSemana = DATEPART(dw, @FechaFinal);

    SELECT @Id_Horario = Id_Horario,
           @HoraInicio = Hora_Inicio,
           @HoraFin = Hora_Fin
    FROM [SQM_GENERAL].[Tbl_Horarios]
    WHERE Id_Materia = @Id_Materia
      AND Id_Profesor = @Id_Profesor
      AND Dia_Semana = @DiaSemana
      AND Id_Estado = 1;

    IF @Id_Horario IS NULL
    BEGIN
        RAISERROR('No se encontró un horario activo para la materia y profesor en el día seleccionado.', 16, 1);
        RETURN;
    END

    SET @DiferenciaMinutos = DATEDIFF(MINUTE, @HoraInicio, @HoraFinal);

    IF @DiferenciaMinutos <= 0
        SET @Id_Estado_Asistencia = 1;
    ELSE IF @DiferenciaMinutos BETWEEN 1 AND 15
        SET @Id_Estado_Asistencia = 6;
    ELSE IF @DiferenciaMinutos > 15 AND @HoraFinal <= @HoraFin
        SET @Id_Estado_Asistencia = 3;
    ELSE
        SET @Id_Estado_Asistencia = 2;

    INSERT INTO [SQM_GENERAL].[Tbl_Asistencias] (
        Id_Alumno, Id_Horario, Fecha, Hora,
        Id_Estado_Asistencia, Id_Estado, Id_Creador, Fecha_Creacion
    )
    VALUES (
        @Id_Alumno, @Id_Horario, @FechaFinal, @HoraFinal,
        @Id_Estado_Asistencia, @Id_Estado, @Id_Creador, GETDATE()
    );

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id_Asistencia;
END;
GO