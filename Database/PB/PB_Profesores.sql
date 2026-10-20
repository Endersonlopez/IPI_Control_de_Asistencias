USE [DB_Control_Asistencias];
GO

-- CREAR
EXEC [SQM_GENERAL].[sp_Profesores_Insertar]
    @Id_Usuario = 4,
    @Especialidad = 'Ingeniería de Software',
    @Departamento = 'Sistemas',
    @Facultad = 'Ciencias de la Computación',
    @Id_Estado = 1,
    @Id_Creador = 1;
GO

-- LISTAR
EXEC [SQM_GENERAL].[sp_Profesores_Listar] 
    @Id_Estado_Activo = 1;
GO

-- ACTUALIZAR
EXEC [SQM_GENERAL].[sp_Profesores_Actualizar]
    @Id_Profesor = 4,
    @Especialidad = 'Ingeniería de Software',
    @Departamento = 'Sistemas',
    @Facultad = 'Ciencias de la Computación',
    @Id_Estado = 1,
    @Id_Modificador = 1;
GO

-- PRUEBA ELIMINAR
EXEC [SQM_GENERAL].[sp_Profesores_Eliminar]
    @Id_Profesor = 1,
    @Id_Estado_Inactivo = 2,
    @Id_Modificador = 1;
GO

-- FILTRAR
EXEC [SQM_GENERAL].[sp_Profesores_Filtrar]
    @Busqueda = 'Software',
    @Id_Estado_Activo = 1;
GO