USE [DB_Control_Asistencias];
GO

-- PRUEBA CREAR
EXEC [SQM_GENERAL].[sp_Alumnos_Insertar]
    @Id_Usuario = 2,
    @Id_Grado = 1,
    @Documento_Identidad = '001-210899-1058C',
    @Id_Estado = 1,
    @Id_Creador = 1;
GO

-- PRUEBA LISTAR
EXEC [SQM_GENERAL].[sp_Alumnos_Listar] 
    @Id_Estado_Activo = 1;
GO

-- PRUEBA ACTUALIZAR
EXEC [SQM_GENERAL].[sp_Alumnos_Actualizar]
    @Id_Alumno = 1,
    @Id_Grado = 1,
    @Documento_Identidad = '001-220663-1058C',
    @Id_Estado = 1,
    @Id_Modificador = 1;
GO

-- PRUEBA ELIMINAR
EXEC [SQM_GENERAL].[sp_Alumnos_Eliminar]
    @Id_Alumno = 1,
    @Id_Estado_Inactivo = 2,
    @Id_Modificador = 1;
GO

-- PRUEBA FILTRAR
EXEC [SQM_GENERAL].[sp_Alumnos_Filtrar]
    @Busqueda = 'López',
    @Id_Estado_Activo = 1;
GO

EXEC [SQM_GENERAL].[sp_Alumnos_Filtrar]
    @Busqueda = '1058C',
    @Id_Estado_Activo = 1;
GO