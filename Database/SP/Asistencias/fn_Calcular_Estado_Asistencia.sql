USE [DB_Control_Asistencias];
GO

CREATE OR ALTER FUNCTION [SQM_GENERAL].[fn_Calcular_Estado_Asistencia]
(
    @Hora_Marcaje TIME,
    @Hora_Inicio TIME,
    @Hora_Fin TIME
)
RETURNS INT
AS
BEGIN
    DECLARE @Id_Estado_Asistencia INT;

    IF @Hora_Marcaje <= @Hora_Inicio
        SET @Id_Estado_Asistencia = 1;

    ELSE IF @Hora_Marcaje > @Hora_Inicio AND @Hora_Marcaje <= DATEADD(minute, 15, @Hora_Inicio)
        SET @Id_Estado_Asistencia = 6;

    ELSE IF @Hora_Marcaje > DATEADD(minute, 15, @Hora_Inicio) AND @Hora_Marcaje <= @Hora_Fin
        SET @Id_Estado_Asistencia = 3;

    ELSE
        SET @Id_Estado_Asistencia = 2;

    RETURN @Id_Estado_Asistencia;
END;
GO