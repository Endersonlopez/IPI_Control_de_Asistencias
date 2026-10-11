CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Crear_Profesor]
    @Primer_Nombre VARCHAR(100),
    @Segundo_Nombre VARCHAR(100) = NULL,
    @Primer_Apellido VARCHAR(100),
    @Segundo_Apellido VARCHAR(100) = NULL,
    @Nombre_Usuario VARCHAR(50),
    @Correo_Electronico VARCHAR(80),
    @Telefono VARCHAR(20),
    @Especialidad VARCHAR(100),
    @Departamento VARCHAR(100),
    @Facultad VARCHAR(100),
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @NewIdUsuario INT;
        DECLARE @NewIdProfesor INT;
        DECLARE @IdRolDocente INT;

        -- 1. Insertar en Tbl_Usuarios
        INSERT INTO [SQM_SEGURIDAD].[Tbl_Usuarios]
        (
            Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido,
            Nombre_Usuario, Correo_Electronico, Telefono, Id_Estado,
            Id_Creador, Fecha_Creacion
        )
        VALUES
        (
            @Primer_Nombre, @Segundo_Nombre, @Primer_Apellido, @Segundo_Apellido,
            @Nombre_Usuario, @Correo_Electronico, @Telefono, 1, -- 1 = Activo
            @Id_Creador, GETDATE()
        );

        SET @NewIdUsuario = SCOPE_IDENTITY();

        -- 2. Insertar en Tbl_Profesores
        INSERT INTO [SQM_GENERAL].[Tbl_Profesores]
        (
            Id_Usuario, Especialidad, Departamento, Facultad,
            Id_Estado, Id_Creador, Fecha_Creacion
        )
        VALUES
        (
            @NewIdUsuario, @Especialidad, @Departamento, @Facultad,
            1, -- 1 = Activo
            @Id_Creador, GETDATE()
        );

        SET @NewIdProfesor = SCOPE_IDENTITY();

        -- 3. Buscar e Insertar en Tbl_Usuarios_Roles (Asignar Rol Docente)
        SELECT TOP 1 @IdRolDocente = Id_Rol 
        FROM [SQM_CATALOGOS].[Tbl_Roles] 
        WHERE Nombre_Rol LIKE '%Docente%' 
           OR Nombre_Rol LIKE '%Profesor%' 
           OR Nombre_Rol LIKE '%Maestro%';

        IF @IdRolDocente IS NOT NULL
        BEGIN
            INSERT INTO [SQM_SEGURIDAD].[Tbl_Usuarios_Roles]
                (Id_Usuario, Id_Rol, Id_Creador, Fecha_Creacion)
            VALUES
                (@NewIdUsuario, @IdRolDocente, @Id_Creador, GETDATE());
        END

        COMMIT TRANSACTION;

        -- Retornar el ID del nuevo profesor creado
        SELECT @NewIdProfesor AS Id_Profesor, @NewIdUsuario AS Id_Usuario;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO