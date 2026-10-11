USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Alumnos_Registrar_Integral]
    @Primer_Nombre VARCHAR(100),
    @Segundo_Nombre VARCHAR(100) = NULL,
    @Primer_Apellido VARCHAR(100),
    @Segundo_Apellido VARCHAR(100) = NULL,
    @Nombre_Usuario VARCHAR(50),
    @Correo_Electronico VARCHAR(80),
    @Telefono VARCHAR(20),
    @Contrasena NVARCHAR(MAX),
    @Id_Rol INT,
    @Id_Grado INT,
    @Documento_Identidad VARCHAR(50),
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

    IF EXISTS (SELECT 1 FROM [SQM_GENERAL].[Tbl_Alumnos] WHERE Documento_Identidad = @Documento_Identidad)
    BEGIN
        RAISERROR('El documento de identidad ya está registrado.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @Id_Usuario_Nuevo INT;
        DECLARE @FechaActual DATETIME = GETDATE();

        INSERT INTO [SQM_SEGURIDAD].[Tbl_Usuarios] 
            (Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Nombre_Usuario, Correo_Electronico, Telefono, Id_Estado, Id_Creador, Fecha_Creacion)
        VALUES 
            (@Primer_Nombre, @Segundo_Nombre, @Primer_Apellido, @Segundo_Apellido, @Nombre_Usuario, @Correo_Electronico, @Telefono, 1, @Id_Creador, @FechaActual);

        SET @Id_Usuario_Nuevo = SCOPE_IDENTITY();

        INSERT INTO [SQM_SEGURIDAD].[Tbl_Usuarios_Roles]
            (Id_Usuario, Id_Rol, Id_Creador, Fecha_Creacion)
        VALUES
            (@Id_Usuario_Nuevo, @Id_Rol, @Id_Creador, @FechaActual);

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

        DECLARE @Id_Alumno_Nuevo INT;
        INSERT INTO [SQM_GENERAL].[Tbl_Alumnos]
            (Id_Usuario, Id_Grado, Documento_Identidad, Id_Estado, Id_Creador, Fecha_Creacion)
        VALUES
            (@Id_Usuario_Nuevo, @Id_Grado, @Documento_Identidad, 1, @Id_Creador, @FechaActual);

        SET @Id_Alumno_Nuevo = SCOPE_IDENTITY();

        COMMIT TRANSACTION;

        SELECT @Id_Alumno_Nuevo AS Id_Alumno;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO