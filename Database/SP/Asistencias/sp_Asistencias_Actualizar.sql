USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Asistencias_Actualizar]
    @Id_Asistencia INT,
    @Id_Alumno INT,
    @Id_Materia INT,
    @Id_Profesor INT,
    @Fecha DATE, 
    @Hora TIME,  
    @Id_Estado_Asistencia INT,
    @Id_Estado INT,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_GENERAL].[Tbl_Asistencias]
    SET Id_Alumno = @Id_Alumno,
        Id_Materia = @Id_Materia,
        Id_Profesor = @Id_Profesor,
        Fecha = @Fecha,
        Hora = @Hora,
        Id_Estado_Asistencia = @Id_Estado_Asistencia,
        Id_Estado = @Id_Estado,
        Id_Modificador = @Id_Modificador,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Asistencia = @Id_Asistencia;

    SELECT @Id_Asistencia AS Id_Asistencia;
END;
GO