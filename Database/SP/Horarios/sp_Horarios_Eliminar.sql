CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Horarios_Eliminar]
    @Id_Horario INT,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE [SQM_GENERAL].[Tbl_Horarios]
        SET Id_Estado = 2, -- Inactivo
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Horario = @Id_Horario;

        COMMIT TRANSACTION;
        SELECT @Id_Horario AS Id_Horario;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO