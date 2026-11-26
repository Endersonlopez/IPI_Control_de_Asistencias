CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Profesores_Activar]
    @Id_Profesor INT,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        DECLARE @Id_Usuario INT;
        SELECT @Id_Usuario = Id_Usuario FROM SQM_GENERAL.Tbl_Profesores WHERE Id_Profesor = @Id_Profesor;
        UPDATE SQM_GENERAL.Tbl_Profesores SET Id_Estado = 1, Id_Modificador = @Id_Modificador, Fecha_Modificacion = GETDATE() WHERE Id_Profesor = @Id_Profesor;
        IF @Id_Usuario IS NOT NULL
            UPDATE SQM_SEGURIDAD.Tbl_Usuarios SET Id_Estado = 1, Id_Modificador = @Id_Modificador, Fecha_Modificacion = GETDATE() WHERE Id_Usuario = @Id_Usuario;
        COMMIT TRANSACTION;
        SELECT @Id_Profesor AS Id_Profesor;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;