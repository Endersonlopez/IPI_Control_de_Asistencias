CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Eliminar_Profesor]
    @Id_Profesor INT,
    @Id_Modificador INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @Id_Usuario INT;

        SELECT @Id_Usuario = Id_Usuario 
        FROM [SQM_GENERAL].[Tbl_Profesores] 
        WHERE Id_Profesor = @Id_Profesor;

        -- Inactivar en Tbl_Profesores
        UPDATE [SQM_GENERAL].[Tbl_Profesores]
        SET Id_Estado = 2, -- 2 = Inactivo
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Profesor = @Id_Profesor;

        -- Inactivar en Tbl_Usuarios
        IF @Id_Usuario IS NOT NULL
        BEGIN
            UPDATE [SQM_SEGURIDAD].[Tbl_Usuarios]
            SET Id_Estado = 2, -- 2 = Inactivo
                Id_Modificador = @Id_Modificador,
                Fecha_Modificacion = GETDATE()
            WHERE Id_Usuario = @Id_Usuario;
        END

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