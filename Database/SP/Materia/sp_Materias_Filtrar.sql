USE DB_IPI_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Materias_Filtrar]
    @Busqueda VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        M.Id_Materia,
        M.Codigo_Materia,
        M.Nombre_Materia,
        M.Id_Estado,
        E.Nombre_Estado,
        M.Id_Creador,
        U_CRE.Primer_Nombre + ' ' + U_CRE.Primer_Apellido AS Nombre_Creador,
        M.Fecha_Creacion,
        M.Id_Modificador,
        ISNULL(U_MOD.Primer_Nombre + ' ' + U_MOD.Primer_Apellido, '') AS Nombre_Modificador,
        M.Fecha_Modificacion
    FROM [SQM_CATALOGOS].[Tbl_Materias] M
    INNER JOIN [SQM_CATALOGOS].[Tbl_Estados] E ON M.Id_Estado = E.Id_Estado
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] U_CRE ON M.Id_Creador = U_CRE.Id_Usuario
    LEFT JOIN [SQM_SEGURIDAD].[Tbl_Usuarios] U_MOD ON M.Id_Modificador = U_MOD.Id_Usuario
    WHERE (M.Nombre_Materia LIKE '%' + @Busqueda + '%'
           OR M.Codigo_Materia LIKE '%' + @Busqueda + '%')
    ORDER BY M.Codigo_Materia ASC;
END;
GO