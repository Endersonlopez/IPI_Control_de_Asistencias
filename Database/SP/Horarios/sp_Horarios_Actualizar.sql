CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Horarios_Actualizar]
    @Id_Horario INT,
    @Id_Materia INT,
    @Id_Profesor INT,
    @Dia_Semana INT,
    @Hora_Inicio TIME,
    @Hora_Fin TIME,
    @Id_Estado INT = 1,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE [SQM_GENERAL].[Tbl_Horarios]
        SET Id_Materia = @Id_Materia,
            Id_Profesor = @Id_Profesor,
            Dia_Semana = @Dia_Semana,
            Hora_Inicio = @Hora_Inicio,
            Hora_Fin = @Hora_Fin,
            Id_Estado = @Id_Estado,
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