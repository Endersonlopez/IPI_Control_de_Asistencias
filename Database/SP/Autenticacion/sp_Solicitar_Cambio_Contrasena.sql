USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Solicitar_Cambio_Contrasena]
    @Nombre_Usuario VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Id_Usuario INT;

    SELECT @Id_Usuario = Id_Usuario
    FROM SQM_SEGURIDAD.Tbl_Usuarios
    WHERE (Nombre_Usuario = @Nombre_Usuario OR Correo_Electronico = @Nombre_Usuario)
      AND Id_Estado = 1;

    IF @Id_Usuario IS NULL
    BEGIN
        RAISERROR('Usuario no encontrado o inactivo.', 16, 1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM SQM_SEGURIDAD.Tbl_Solicitudes_Cambio
        WHERE Id_Usuario = @Id_Usuario AND Estado = 'Pendiente'
    )
    BEGIN
        RAISERROR('Ya tienes una solicitud pendiente.', 16, 1);
        RETURN;
    END

    INSERT INTO SQM_SEGURIDAD.Tbl_Solicitudes_Cambio (Id_Usuario)
    VALUES (@Id_Usuario);

    SELECT SCOPE_IDENTITY() AS Id_Solicitud;
END;