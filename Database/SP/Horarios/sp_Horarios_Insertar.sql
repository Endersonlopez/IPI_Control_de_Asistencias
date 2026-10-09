CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Horarios_Insertar]
    @Id_Materia INT,
    @Id_Profesor INT,
    @Dia_Semana INT,
    @Hora_Inicio TIME,
    @Hora_Fin TIME,
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO [SQM_GENERAL].[Tbl_Horarios] (
            Id_Materia, Id_Profesor, Dia_Semana, Hora_Inicio, Hora_Fin,
            Id_Estado, Id_Creador, Fecha_Creacion
        )
        VALUES (
            @Id_Materia, @Id_Profesor, @Dia_Semana, @Hora_Inicio, @Hora_Fin,
            1, @Id_Creador, GETDATE()
        );

        DECLARE @IdHorario INT = SCOPE_IDENTITY();

        COMMIT TRANSACTION;
        SELECT @IdHorario AS Id_Horario;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO