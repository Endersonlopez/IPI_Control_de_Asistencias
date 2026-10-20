USE [DB_Control_Asistencias];
GO

CREATE OR ALTER TRIGGER [SQM_GENERAL].[trg_Calcular_Estado_Asistencia]
ON [SQM_GENERAL].[Tbl_Asistencias]
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [SQM_GENERAL].[Tbl_Asistencias]
    (
        Id_Alumno,
        Id_Materia,
        Id_Profesor,
        Fecha,
        Hora,
        Id_Estado_Asistencia,
        Id_Estado,
        Id_Creador,
        Fecha_Creacion,
        Id_Modificador,
        Fecha_Modificacion
    )
    SELECT 
        I.Id_Alumno,
        I.Id_Materia,
        I.Id_Profesor,
        I.Fecha,
        I.Hora,
        ISNULL(
            [SQM_GENERAL].[fn_Calcular_Estado_Asistencia](I.Hora, H.Hora_Inicio, H.Hora_Fin),
            I.Id_Estado_Asistencia
        ) AS Id_Estado_Asistencia,
        I.Id_Estado,
        I.Id_Creador,
        ISNULL(I.Fecha_Creacion, GETDATE()),
        I.Id_Modificador,
        I.Fecha_Modificacion
    FROM INSERTED I
    LEFT JOIN [SQM_GENERAL].[Tbl_Horarios] H 
        ON I.Id_Materia = H.Id_Materia 
       AND I.Id_Profesor = H.Id_Profesor
       AND H.Dia_Semana = DATEPART(WEEKDAY, I.Fecha)
       AND H.Id_Estado = 1;
END;
GO