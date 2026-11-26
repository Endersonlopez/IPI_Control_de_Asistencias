USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Estadisticas_Alumno]
    @Id_Alumno INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(*) AS TotalAsistencias,
        SUM(CASE WHEN MONTH(a.Fecha) = MONTH(GETDATE()) AND YEAR(a.Fecha) = YEAR(GETDATE()) THEN 1 ELSE 0 END) AS EsteMes,
        SUM(CASE WHEN a.Fecha >= DATEADD(DAY, 1 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE))
                  AND a.Fecha < DATEADD(DAY, 8 - DATEPART(WEEKDAY, GETDATE()), CAST(GETDATE() AS DATE)) THEN 1 ELSE 0 END) AS EstaSemana
    FROM [SQM_GENERAL].[Tbl_Asistencias] a
    WHERE a.Id_Alumno = @Id_Alumno AND a.Id_Estado = 1;
END;