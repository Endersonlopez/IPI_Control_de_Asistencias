USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_Insertar]
    @Primer_Nombre VARCHAR(100),
    @Segundo_Nombre VARCHAR(100) = NULL,
    @Primer_Apellido VARCHAR(100),
    @Segundo_Apellido VARCHAR(100) = NULL,
    @Nombre_Usuario VARCHAR(50),
    @Contrasena VARBINARY(256),
    @Correo_Electronico VARCHAR(80),
    @Telefono VARCHAR(20),
    @Id_Estado INT = 1,
    @Id_Creador INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @IdUsuarioNuevo INT;

        INSERT INTO [SQM_SEGURIDAD].[Tbl_Usuarios] (
            Primer_Nombre, 
            Segundo_Nombre, 
            Primer_Apellido, 
            Segundo_Apellido, 
            Nombre_Usuario, 
            Correo_Electronico, 
            Telefono, 
            Id_Estado, 
            Id_Creador, 
            Fecha_Creacion
        )
        VALUES (
            @Primer_Nombre, 
            @Segundo_Nombre, 
            @Primer_Apellido, 
            @Segundo_Apellido, 
            @Nombre_Usuario, 
            @Correo_Electronico, 
            @Telefono, 
            @Id_Estado, 
            @Id_Creador, 
            GETDATE()
        );

        SET @IdUsuarioNuevo = SCOPE_IDENTITY();

        INSERT INTO [SQM_SEGURIDAD].[Tbl_Credenciales] (
            Id_Usuario,
            PasswordHash,
            Salt,
            Id_Creador,
            Fecha_Creacion
        )
        VALUES (
            @IdUsuarioNuevo,
            @Contrasena,
            'N/A',
            @Id_Creador,
            GETDATE()
        );

        COMMIT TRANSACTION;

        SELECT @IdUsuarioNuevo AS Id_Usuario;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO