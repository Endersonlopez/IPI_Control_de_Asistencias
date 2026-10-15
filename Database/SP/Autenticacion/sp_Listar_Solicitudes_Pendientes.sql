USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Listar_Solicitudes_Pendientes]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        S.Id_Solicitud,
        S.Id_Usuario,
        U.Nombre_Usuario,
        U.Primer_Nombre + ' ' + U.Primer_Apellido AS Nombre_Completo,
        S.Fecha_Solicitud,
        S.Estado
    FROM SQM_SEGURIDAD.Tbl_Solicitudes_Cambio S
    INNER JOIN SQM_SEGURIDAD.Tbl_Usuarios U ON S.Id_Usuario = U.Id_Usuario
    WHERE S.Estado = 'Pendiente'
    ORDER BY S.Fecha_Solicitud DESC;
END;