USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Guardar_Alumnos_Materia]
    @Id_Materia INT,
    @Id_Alumno INT,
    @Id_Creador INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CreadorFinal INT = ISNULL(@Id_Creador, 1);

    IF EXISTS (
        SELECT 1 
        FROM [SQM_GENERAL].[Tbl_Alumnos_Materias] 
        WHERE Id_Materia = @Id_Materia AND Id_Alumno = @Id_Alumno
    )
    BEGIN
        UPDATE [SQM_GENERAL].[Tbl_Alumnos_Materias]
        SET Id_Estado = 1
        WHERE Id_Materia = @Id_Materia AND Id_Alumno = @Id_Alumno;
    END
    ELSE
    BEGIN
        INSERT INTO [SQM_GENERAL].[Tbl_Alumnos_Materias] (Id_Alumno, Id_Materia, Id_Estado, Id_Creador)
        VALUES (@Id_Alumno, @Id_Materia, 1, @CreadorFinal);
    END
END;
GO