USE [DB_Control_Asistencias];
GO

-- PRUEBA CREAR
EXEC [SQM_CATALOGOS].[sp_Roles_Insertar] 
    @Nombre_Rol = 'Rol Temporal', 
    @Descripcion = 'Este rol es solo para pruebas.';
GO

-- PRUEBA LISTAR
EXEC [SQM_CATALOGOS].[sp_Roles_Listar] @Id_Estado_Activo = 1;
GO

-- ACTUALIZAR
EXEC [SQM_CATALOGOS].[sp_Roles_Actualizar]
    @Id_Rol = 4, 
    @Nombre_Rol = 'Coordinador', 
    @Descripcion = 'Descripción actualizada exitosamente.';
GO

-- ELIMINAR
EXEC [SQM_CATALOGOS].[sp_Roles_Eliminar]
    @Id_Rol = 4, 
    @Id_Estado_Inactivo = 2;
GO

-- FILTRAR
EXEC [SQM_CATALOGOS].[sp_Roles_Filtrar] 
    @Busqueda = 'Temporal';
GO