USE [DB_Control_Asistencias];
GO

-- PRUEBA CREAR
EXEC [SQM_SEGURIDAD].[sp_Usuarios_Insertar]
    @Primer_Nombre = 'Duclis',
    @Primer_Apellido = 'Zamora',
    @Nombre_Usuario = 'dzamora',
    @Contrasena_Plana = '654321',
    @Correo_Electronico = 'dzamora@udem.edu.ni',
    @Telefono = '88887777',
    @Id_Estado = 1,
    @Id_Creador = 1;

-- PRUEBA LISTAR
EXEC [SQM_SEGURIDAD].[sp_Usuarios_Listar] 
    @Id_Estado_Activo = 1;
GO

-- PRUEBA ACTUALIZAR
EXEC [SQM_SEGURIDAD].[sp_Usuarios_Actualizar]
    @Id_Usuario = 3,
    @Primer_Nombre = 'Duclis',
    @Segundo_Nombre = 'Zamora',
    @Primer_Apellido = 'Gómez',
    @Segundo_Apellido = NULL,
    @Nombre_Usuario = 'dzamora',
    @Correo_Electronico = 'dzamora@udem.edu.ni',
    @Telefono = '88889999',
    @Id_Estado = 1,
    @Id_Modificador = 1
GO

-- PRUEBA ELIMINAR (BORRADO LÓGICO)
EXEC [SQM_SEGURIDAD].[sp_Usuarios_Eliminar]
    @Id_Usuario = 3,
    @Id_Estado_Inactivo = 2,
    @Id_Modificador = 1;
GO

-- PRUEBA FILTRAR
EXEC [SQM_SEGURIDAD].[sp_Usuarios_Filtrar]
    @Busqueda = 'Duclis',
    @Id_Estado_Activo = 1;
GO

-- PRUEBA AUTENTICAR
EXEC [SQM_SEGURIDAD].[sp_Usuarios_Autenticar]
    @Nombre_Usuario = 'elopez',
    @Contrasena_Intento = '123456';

-- PRUEBA CREAR
EXEC [SQM_SEGURIDAD].[sp_Usuarios_Insertar]
    @Primer_Nombre = 'Rebeca',
    @Primer_Apellido = 'Artola',
    @Nombre_Usuario = 'Corea',
    @Contrasena_Plana = '654321',
    @Correo_Electronico = 'rartola@udem.edu.ni',
    @Telefono = '88885555',
    @Id_Estado = 1,
    @Id_Creador = 1;
GO

-- PRUEBA ACTUALIZAR
EXEC [SQM_SEGURIDAD].[sp_Usuarios_Actualizar]
    @Id_Usuario = 4,
    @Primer_Nombre = 'Rebeca',
    @Segundo_Nombre = 'Artola',
    @Primer_Apellido = 'Corea',
    @Segundo_Apellido = NULL,
    @Nombre_Usuario = 'rartola',
    @Correo_Electronico = 'rartola@udem.edu.ni',
    @Telefono = '88885555',
    @Id_Estado = 1,
    @Id_Modificador = 1
GO