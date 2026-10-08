USE [DB_IPI_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Eliminar_Alumno_Materia]
    @Id_Materia INT,
    @Id_Alumno INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_GENERAL].[Tbl_Alumnos_Materias]
    SET Id_Estado = 2
    WHERE Id_Materia = @Id_Materia AND Id_Alumno = @Id_Alumno;
END;
GO