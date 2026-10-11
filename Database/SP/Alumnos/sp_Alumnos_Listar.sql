USE DB_Control_Asistencias
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Alumnos_Listar]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        A.Id_Alumno,
        A.Id_Usuario,
        A.Documento_Identidad,
        U.Nombre_Usuario,
        CONCAT_WS(' ', U.Primer_Nombre, U.Segundo_Nombre, U.Primer_Apellido, U.Segundo_Apellido) AS Nombre_Completo,
        U.Correo_Electronico,
        U.Telefono,
        A.Id_Grado,
        G.Nombre_Grado,
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
    --WHERE E.Nombre_Estado = 'Activo';
    ORDER BY Nombre_Completo ASC;
END;
GO