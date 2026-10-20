USE [DB_Control_Asistencias];
GO

-- PRUEBA CREAR
EXEC [SQM_CATALOGOS].[sp_Materias_Insertar]
    @Nombre_Materia = 'Programación Orientada a Objetos',
    @Codigo_Materia = 'PRG-101',
    @Id_Estado = 1,
    @Id_Creador = 1;
GO

-- PRUEBA LISTAR
EXEC [SQM_CATALOGOS].[sp_Materias_Listar] @Id_Estado_Activo = 1;
GO

-- PRUEBA ACTUALIZAR
EXEC [SQM_CATALOGOS].[sp_Materias_Actualizar]
    @Id_Materia = 1,
    @Nombre_Materia = 'Programación Orientada a Objetos',
    @Codigo_Materia = 'BD-100',
    @Id_Estado = 1,
    @Id_Modificador = 1;
GO

-- ELIMINAR
EXEC [SQM_CATALOGOS].[sp_Materias_Eliminar]
    @Id_Materia = 1,
    @Id_Estado_Inactivo = 2,
    @Id_Modificador = 1;
GO

-- FILTRAR
EXEC [SQM_CATALOGOS].[sp_Materias_Filtrar]
    @Busqueda = 'Programación',
    @Id_Estado_Activo = 1;
GO