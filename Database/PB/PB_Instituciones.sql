USE [DB_Control_Asistencias];
GO

-- PRUEBA CREAR
EXEC [SQM_GENERAL].[sp_Instituciones_Insertar]
    @Nombre_Institucion = 'Universidad Temporal',
    @Id_Estado = 1,
    @Id_Creador = 1;
GO

-- PRUEBA LISTAR
EXEC [SQM_GENERAL].[sp_Instituciones_Listar] 
    @Id_Estado_Activo = 1;
GO

-- PRUEBA ACTUALIZAR
EXEC [SQM_GENERAL].[sp_Instituciones_Actualizar]
    @Id_Institucion = 2, 
    @Nombre_Institucion = 'Universidad de León',
    @Id_Estado = 1,
    @Id_Modificador = 1;
GO

-- PRUEBA ELIMINAR (BORRADO LÓGICO)
EXEC [SQM_GENERAL].[sp_Instituciones_Eliminar]
    @Id_Institucion = 2,
    @Id_Estado_Inactivo = 2,
    @Id_Modificador = 1;
GO

-- PRUEBA FILTRAR
EXEC [SQM_GENERAL].[sp_Instituciones_Filtrar]
    @Busqueda = 'Managua',
    @Id_Estado_Activo = 1;
GO