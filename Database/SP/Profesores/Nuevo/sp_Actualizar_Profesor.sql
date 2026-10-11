CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Actualizar_Profesor]
    @Id_Profesor INT,
    @Id_Usuario INT,
    @Primer_Nombre VARCHAR(100),
    @Segundo_Nombre VARCHAR(100) = NULL,
    @Primer_Apellido VARCHAR(100),
    @Segundo_Apellido VARCHAR(100) = NULL,
    @Correo_Electronico VARCHAR(80),
    @Telefono VARCHAR(20),
    @Especialidad VARCHAR(100),
    @Departamento VARCHAR(100),
    @Facultad VARCHAR(100),
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Actualizar Datos de Usuario
        UPDATE [SQM_SEGURIDAD].[Tbl_Usuarios]
        SET Primer_Nombre = @Primer_Nombre,
            Segundo_Nombre = @Segundo_Nombre,
            Primer_Apellido = @Primer_Apellido,
            Segundo_Apellido = @Segundo_Apellido,
            Correo_Electronico = @Correo_Electronico,
            Telefono = @Telefono,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Usuario = @Id_Usuario;

        -- 2. Actualizar Datos del Profesor
        UPDATE [SQM_GENERAL].[Tbl_Profesores]
        SET Especialidad = @Especialidad,
            Departamento = @Departamento,
            Facultad = @Facultad,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Profesor = @Id_Profesor;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO