USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Asignar_Nueva_Contrasena]
    @Id_Solicitud INT,
    @Nueva_Contrasena NVARCHAR(MAX),   -- cambiado a NVARCHAR(MAX) para coincidir con el registro
    @Id_Admin INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Id_Usuario INT;
    SELECT @Id_Usuario = Id_Usuario FROM SQM_SEGURIDAD.Tbl_Solicitudes_Cambio WHERE Id_Solicitud = @Id_Solicitud;
    
    DECLARE @Salt NVARCHAR(50);
    SELECT @Salt = Salt FROM SQM_SEGURIDAD.Tbl_Credenciales WHERE Id_Usuario = @Id_Usuario;

    UPDATE SQM_SEGURIDAD.Tbl_Credenciales
    SET PasswordHash = HASHBYTES('SHA2_256', CAST(CONCAT(@Nueva_Contrasena, @Salt) AS NVARCHAR(MAX))),
        Id_Modificador = @Id_Admin,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Usuario = @Id_Usuario;

    UPDATE SQM_SEGURIDAD.Tbl_Solicitudes_Cambio
    SET Estado = 'Aprobada',
        Nueva_Contrasena = @Nueva_Contrasena,
        Fecha_Atencion = GETDATE(),
        Id_Admin_Atencion = @Id_Admin
    WHERE Id_Solicitud = @Id_Solicitud;
END;
GO