USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_Listar]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        U.Id_Usuario,
        U.Primer_Nombre,
        U.Segundo_Nombre,
        U.Primer_Apellido,
        U.Segundo_Apellido,
        U.Nombre_Usuario,
        U.Correo_Electronico,
        U.Telefono,
        U.Id_Estado,
        E.Nombre_Estado,
        U.Id_Creador,
        U.Fecha_Creacion,
        U.Id_Modificador,
        U.Fecha_Modificacion
    FROM [SQM_SEGURIDAD].[Tbl_Usuarios] U
    INNER JOIN [SQM_CATALOGOS].[Tbl_Estados] E 
        ON U.Id_Estado = E.Id_Estado;
END;
GO