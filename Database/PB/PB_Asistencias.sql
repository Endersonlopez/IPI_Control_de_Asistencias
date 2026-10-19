USE [DB_Control_Asistencias];
GO

-- PRUEBA CREAR
EXEC [SQM_GENERAL].[sp_Asistencias_Insertar]
    @Id_Alumno = 1,
    @Id_Materia = 1,
    @Id_Profesor = 1,
    @Fecha = '2026-06-13',
    @Hora = '08:00:00',
    @Id_Estado_Asistencia = 1,
    @Id_Estado = 1,
    @Id_Creador = 1;
GO

-- PRUEBA LISTAR
EXEC [SQM_GENERAL].[sp_Asistencias_Listar] 
    @Id_Estado_Activo = 1;
GO

-- PRUEBA ACTUALIZAR
EXEC [SQM_GENERAL].[sp_Asistencias_Actualizar]
    @Id_Asistencia = 1,
    @Id_Estado_Asistencia = 4,
    @Id_Estado = 1,
    @Id_Modificador = 1;
GO

-- PRUEBA ELIMINAR
EXEC [SQM_GENERAL].[sp_Asistencias_Eliminar]
    @Id_Asistencia = 1,
    @Id_Estado_Inactivo = 2,
    @Id_Modificador = 1;
GO

-- PRUEBA FILTRAR
EXEC [SQM_GENERAL].[sp_Asistencias_Filtrar]
    @Busqueda = 'Programación',
    @Id_Estado_Activo = 2;
GO