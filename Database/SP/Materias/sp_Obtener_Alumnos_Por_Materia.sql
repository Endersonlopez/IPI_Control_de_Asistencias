USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Obtener_Alumnos_Por_Materia]
    @Id_Materia INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id_Alumno,
        Id_Usuario,
        Nombre_Completo
    FROM [SQM_GENERAL].[vw_Alumnos_Materias_Detalle]
    WHERE Id_Materia = @Id_Materia 
      AND Estado_Inscripcion = 1
    ORDER BY Nombre_Completo;
END;
GO