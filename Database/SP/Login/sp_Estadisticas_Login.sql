USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Estadisticas_Login]
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalAlumnos INT;
    DECLARE @TotalRegistros INT;
    DECLARE @TotalProfesores INT;

    SELECT @TotalAlumnos = COUNT(*) FROM [SQM_GENERAL].[Tbl_Alumnos];
    SELECT @TotalRegistros = COUNT(*) FROM [SQM_GENERAL].[Tbl_Asistencias];
    SELECT @TotalProfesores = COUNT(*) FROM [SQM_GENERAL].[Tbl_Profesores];

    SELECT 
        @TotalAlumnos AS TotalAlumnos,
        @TotalRegistros AS TotalRegistros,
        @TotalProfesores AS TotalProfesores;
END;
GO