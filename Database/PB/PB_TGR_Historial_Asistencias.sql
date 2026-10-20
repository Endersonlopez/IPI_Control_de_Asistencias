USE [DB_Control_Asistencias];
GO

-- CREAR
EXEC [SQM_GENERAL].[sp_Asistencias_Insertar]
    @Id_Alumno = 1,
    @Id_Materia = 1,
    @Id_Profesor = 1,
    @Fecha = '2026-06-16',
    @Hora = '08:00:00',
    @Id_Estado_Asistencia = 2,
    @Id_Estado = 1,
    @Id_Creador = 1;
GO

-- LISTAR
SELECT TOP 1 Id_Asistencia, Fecha, Id_Estado_Asistencia 
FROM [SQM_GENERAL].[Tbl_Asistencias] 
ORDER BY Id_Asistencia DESC;
GO

-- ACTUALIZAR
EXEC [SQM_GENERAL].[sp_Asistencias_Actualizar]
    @Id_Asistencia = 3,
    @Id_Estado_Asistencia = 4,
    @Id_Estado = 1,
    @Id_Modificador = 1;
GO

-- TRIGGER
SELECT * FROM [SQM_GENERAL].[Tbl_Historial_Asistencias];
GO