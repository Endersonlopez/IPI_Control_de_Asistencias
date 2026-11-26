USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_CambiarContrasena]
    @Id_Usuario INT,
    @ContrasenaActual VARCHAR(100),
    @ContrasenaNueva VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Salt NVARCHAR(50);
    SELECT @Salt = Salt FROM SQM_SEGURIDAD.Tbl_Credenciales WHERE Id_Usuario = @Id_Usuario;

    IF NOT EXISTS (SELECT 1 FROM SQM_SEGURIDAD.Tbl_Credenciales 
                   WHERE Id_Usuario = @Id_Usuario 
                   AND PasswordHash = HASHBYTES('SHA2_256', CONCAT(@ContrasenaActual, @Salt)))
    BEGIN
        RAISERROR('Contraseña actual incorrecta.', 16, 1);
        RETURN;
    END

    UPDATE SQM_SEGURIDAD.Tbl_Credenciales
    SET PasswordHash = HASHBYTES('SHA2_256', CONCAT(@ContrasenaNueva, @Salt)),
        Id_Modificador = @Id_Usuario,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Usuario = @Id_Usuario;
END;