USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Alumnos_Activar]
    @Id_Alumno INT,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @Id_Usuario INT;
        SELECT @Id_Usuario = Id_Usuario FROM SQM_GENERAL.Tbl_Alumnos WHERE Id_Alumno = @Id_Alumno;

        -- Activar alumno
        UPDATE SQM_GENERAL.Tbl_Alumnos 
        SET Id_Estado = 1, Id_Modificador = @Id_Modificador, Fecha_Modificacion = GETDATE()
        WHERE Id_Alumno = @Id_Alumno;

        -- Activar usuario asociado
        IF @Id_Usuario IS NOT NULL
        BEGIN
            UPDATE SQM_SEGURIDAD.Tbl_Usuarios 
            SET Id_Estado = 1, Id_Modificador = @Id_Modificador, Fecha_Modificacion = GETDATE()
            WHERE Id_Usuario = @Id_Usuario;
        END

        COMMIT TRANSACTION;
        SELECT @Id_Alumno AS Id_Alumno;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO