USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Profesores_Actualizar]
    @Id_Profesor INT,
    @Id_Usuario INT,
    @Primer_Nombre VARCHAR(100),
    @Segundo_Nombre VARCHAR(100) = NULL,
    @Primer_Apellido VARCHAR(100),
    @Segundo_Apellido VARCHAR(100) = NULL,
    @Nombre_Usuario VARCHAR(50),
    @Correo_Electronico VARCHAR(80),
    @Telefono VARCHAR(20),
    @Facultad VARCHAR(100),
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [SQM_SEGURIDAD].[Tbl_Usuarios] WHERE Nombre_Usuario = @Nombre_Usuario AND Id_Usuario != @Id_Usuario)
    BEGIN
        RAISERROR('El nombre de usuario ya está en uso.', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM [SQM_SEGURIDAD].[Tbl_Usuarios] WHERE Correo_Electronico = @Correo_Electronico AND Id_Usuario != @Id_Usuario)
    BEGIN
        RAISERROR('El correo electrónico ya está en uso.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE [SQM_SEGURIDAD].[Tbl_Usuarios]
        SET Primer_Nombre = @Primer_Nombre,
            Segundo_Nombre = @Segundo_Nombre,
            Primer_Apellido = @Primer_Apellido,
            Segundo_Apellido = @Segundo_Apellido,
            Nombre_Usuario = @Nombre_Usuario,
            Correo_Electronico = @Correo_Electronico,
            Telefono = @Telefono,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Usuario = @Id_Usuario;

        UPDATE [SQM_GENERAL].[Tbl_Profesores]
        SET Facultad = @Facultad,
            Id_Modificador = @Id_Modificador, 
            Fecha_Modificacion = GETDATE()       
        WHERE Id_Profesor = @Id_Profesor;

        COMMIT TRANSACTION;

        SELECT @Id_Profesor AS Id_Profesor;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO