USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Profesores_Registrar_Integral]
    @Primer_Nombre VARCHAR(100),
    @Segundo_Nombre VARCHAR(100) = NULL,
    @Primer_Apellido VARCHAR(100),
    @Segundo_Apellido VARCHAR(100) = NULL,
    @Nombre_Usuario VARCHAR(50),
    @Correo_Electronico VARCHAR(80),
    @Telefono VARCHAR(20),
    @Facultad VARCHAR(100),
    @Contrasena NVARCHAR(MAX),
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [SQM_SEGURIDAD].[Tbl_Usuarios] WHERE Nombre_Usuario = @Nombre_Usuario)
    BEGIN
        RAISERROR('El nombre de usuario ya está en uso.', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM [SQM_SEGURIDAD].[Tbl_Usuarios] WHERE Correo_Electronico = @Correo_Electronico)
    BEGIN
        RAISERROR('El correo electrónico ya está en uso.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @Id_Usuario_Nuevo INT;
        DECLARE @Id_Profesor_Nuevo INT;
        DECLARE @IdRolDocente INT;
        DECLARE @FechaActual DATETIME = GETDATE();

        INSERT INTO [SQM_SEGURIDAD].[Tbl_Usuarios] 
            (Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Nombre_Usuario, Correo_Electronico, Telefono, Id_Estado, Id_Creador, Fecha_Creacion)
        VALUES 
            (@Primer_Nombre, @Segundo_Nombre, @Primer_Apellido, @Segundo_Apellido, @Nombre_Usuario, @Correo_Electronico, @Telefono, 1, @Id_Creador, @FechaActual);

        SET @Id_Usuario_Nuevo = SCOPE_IDENTITY();

        INSERT INTO [SQM_GENERAL].[Tbl_Profesores]
            (Id_Usuario, Facultad, Id_Estado, Id_Creador, Fecha_Creacion)
        VALUES
            (@Id_Usuario_Nuevo, @Facultad, 1, @Id_Creador, @FechaActual);

        SET @Id_Profesor_Nuevo = SCOPE_IDENTITY();

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
                (@Id_Usuario_Nuevo, @IdRolDocente, @Id_Creador, @FechaActual);
        END

        DECLARE @Salt NVARCHAR(50);
        SET @Salt = N'Salt_' + CAST(@Id_Usuario_Nuevo AS NVARCHAR(10)) + N'_2026';

        INSERT INTO [SQM_SEGURIDAD].[Tbl_Credenciales]
            (Id_Usuario, PasswordHash, Salt, Id_Creador, Fecha_Creacion)
        VALUES
            (
                @Id_Usuario_Nuevo, 
                HASHBYTES('SHA2_256', CAST(CONCAT(@Contrasena, @Salt) AS NVARCHAR(MAX))), 
                @Salt, 
                @Id_Creador, 
                @FechaActual
            );

        COMMIT TRANSACTION;

        SELECT @Id_Profesor_Nuevo AS Id_Profesor;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO