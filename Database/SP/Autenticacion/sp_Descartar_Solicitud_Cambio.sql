USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Descartar_Solicitud_Cambio]
    @Id_Solicitud INT,
    @Id_Admin INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE SQM_SEGURIDAD.Tbl_Solicitudes_Cambio
    SET Estado = 'Descartada',
        Fecha_Atencion = GETDATE(),
        Id_Admin_Atencion = @Id_Admin
    WHERE Id_Solicitud = @Id_Solicitud;
END;