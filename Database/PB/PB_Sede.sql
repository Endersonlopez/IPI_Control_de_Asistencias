USE [DB_Control_Asistencias];
GO

-- PRUEBA CREAR
EXEC [SQM_GENERAL].[sp_Sedes_Insertar]
    @Id_Institucion = 1,
    @Nombre_Sede = 'Campus Central',
    @Id_Estado = 1,
    @Id_Creador = 1;
GO

-- PRUEBA LISTAR
EXEC [SQM_GENERAL].[sp_Sedes_Listar] @Id_Estado_Activo = 1;
GO

-- PRUEBA ACTUALIZAR
EXEC [SQM_GENERAL].[sp_Sedes_Actualizar]
    @Id_Sede = 2, 
    @Id_Institucion = 1,
    @Nombre_Sede = 'Sede León',
    @Id_Estado = 1,
    @Id_Modificador = 1;
GO

-- PRUEBA ELIMINAR
EXEC [SQM_GENERAL].[sp_Sedes_Eliminar]
    @Id_Sede = 2,
    @Id_Estado_Inactivo = 2,
    @Id_Modificador = 1;
GO

-- PRUEBA FILTRAR
EXEC [SQM_GENERAL].[sp_Sedes_Filtrar]
    @Busqueda = 'Central',
    @Id_Estado_Activo = 1;
GO