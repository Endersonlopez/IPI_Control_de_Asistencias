USE DB_Control_Asistencias
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Alumnos_Filtrar]
    @Busqueda VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        A.Id_Alumno,
        A.Id_Usuario,
        LTRIM(RTRIM(
            ISNULL(U.Primer_Nombre, '') + ' ' + 
            ISNULL(U.Segundo_Nombre, '') + ' ' + 
            ISNULL(U.Primer_Apellido, '') + ' ' + 
            ISNULL(U.Segundo_Apellido, '')
        )) AS Nombre_Completo,
        A.Id_Grado,
        G.Nombre_Grado,
        A.Documento_Identidad,
        A.Id_Estado,
        E.Nombre_Estado,
        A.Id_Creador,
        A.Fecha_Creacion,
        A.Id_Modificador,
        A.Fecha_Modificacion
    FROM [SQM_GENERAL].[Tbl_Alumnos] A
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] U ON A.Id_Usuario = U.Id_Usuario
    INNER JOIN [SQM_CATALOGOS].[Tbl_Grados] G ON A.Id_Grado = G.Id_Grado
    INNER JOIN [SQM_CATALOGOS].[Tbl_Estados] E ON A.Id_Estado = E.Id_Estado
    WHERE 
    (
        A.Documento_Identidad LIKE '%' + @Busqueda + '%' OR
        U.Nombre_Usuario LIKE '%' + @Busqueda + '%' OR
        U.Primer_Nombre LIKE '%' + @Busqueda + '%' OR
        U.Segundo_Nombre LIKE '%' + @Busqueda + '%' OR
        U.Primer_Apellido LIKE '%' + @Busqueda + '%' OR
        U.Segundo_Apellido LIKE '%' + @Busqueda + '%' OR
        G.Nombre_Grado LIKE '%' + @Busqueda + '%' OR
        U.Correo_Electronico LIKE '%' + @Busqueda + '%' OR
        (ISNULL(U.Primer_Nombre, '') + ' ' + ISNULL(U.Primer_Apellido, '')) LIKE '%' + @Busqueda + '%'
    );
END;
GO