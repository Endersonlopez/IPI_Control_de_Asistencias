USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_Registrar]
    @Primer_Nombre VARCHAR(50),
    @Segundo_Nombre VARCHAR(50) = NULL,
    @Primer_Apellido VARCHAR(50),
    @Segundo_Apellido VARCHAR(50) = NULL,
    @Nombre_Usuario VARCHAR(50),
    @Correo_Electronico VARCHAR(100),
    @Telefono VARCHAR(20) = NULL,
    @Contrasena VARCHAR(100),
    @Id_Rol INT,
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;

    BEGIN TRY
        INSERT INTO [SQM_SEGURIDAD].[Tbl_Usuarios] 
            (Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Nombre_Usuario, Correo_Electronico, Telefono, Id_Estado, Id_Creador, Fecha_Creacion)
        VALUES 
            (@Primer_Nombre, @Segundo_Nombre, @Primer_Apellido, @Segundo_Apellido, @Nombre_Usuario, @Correo_Electronico, @Telefono, 1, @Id_Creador, GETDATE());

        DECLARE @NuevoIdUsuario INT = SCOPE_IDENTITY();

        DECLARE @Salt NVARCHAR(50) = CONCAT('Salt_', CAST(@NuevoIdUsuario AS NVARCHAR(10)), '_2026');
        DECLARE @PasswordHash VARBINARY(256) = HASHBYTES('SHA2_256', CONCAT(@Contrasena, @Salt));

        INSERT INTO [SQM_SEGURIDAD].[Tbl_Credenciales] 
            (Id_Usuario, PasswordHash, Salt, Fecha_Creacion)
        VALUES 
            (@NuevoIdUsuario, @PasswordHash, @Salt, GETDATE());

        INSERT INTO [SQM_SEGURIDAD].[Tbl_Usuarios_Roles] 
            (Id_Usuario, Id_Rol, Id_Creador, Fecha_Creacion)
        VALUES 
            (@NuevoIdUsuario, @Id_Rol, @Id_Creador, GETDATE());

        COMMIT TRANSACTION;
        
        SELECT @NuevoIdUsuario; 

    END TRY
    BEGIN CATCH
          ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;