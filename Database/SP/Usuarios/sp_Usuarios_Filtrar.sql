USE DB_Control_Asistencias;
GO

-- FILTRAR
CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_Filtrar]
    @Busqueda VARCHAR(100),
    @Id_Estado_Activo INT = 1
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        U.Id_Usuario,
        U.Primer_Nombre,
        U.Segundo_Nombre,
        U.Primer_Apellido,
        U.Segundo_Apellido,
        U.Primer_Nombre + ' ' + ISNULL(U.Segundo_Nombre, '') + ' ' + U.Primer_Apellido + ' ' + ISNULL(U.Segundo_Apellido, '') AS Nombre_Completo,
        U.Nombre_Usuario,
        U.Correo_Electronico,
        U.Telefono,
        U.Id_Estado,
        U.Id_Creador,
        U.Fecha_Creacion,     
        U.Id_Modificador, 
        U.Fecha_Modificacion
    FROM [SQM_SEGURIDAD].[Tbl_Usuarios] U
    INNER JOIN [SQM_CATALOGOS].[Tbl_Estados] E ON U.Id_Estado = E.Id_Estado
    WHERE U.Id_Estado = @Id_Estado_Activo
    AND (
        U.Primer_Nombre LIKE '%' + @Busqueda + '%' OR
        U.Primer_Apellido LIKE '%' + @Busqueda + '%' OR
        U.Nombre_Usuario LIKE '%' + @Busqueda + '%' OR
        U.Correo_Electronico LIKE '%' + @Busqueda + '%' OR
        U.Telefono LIKE '%' + @Busqueda + '%'
    );
END;
GO