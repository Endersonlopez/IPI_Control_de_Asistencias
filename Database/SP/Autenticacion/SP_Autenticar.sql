USE DB_Control_Asistencias
GO

ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_Autenticar]
    @Nombre_Usuario VARCHAR(100),
    @Contrasena_Intento VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        U.Id_Usuario,
        U.Primer_Nombre,
        U.Primer_Apellido,
        U.Correo_Electronico,
        R.Nombre_Rol AS Roles
    FROM [SQM_SEGURIDAD].[Tbl_Usuarios] U
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Credenciales] C ON U.Id_Usuario = C.Id_Usuario
    INNER JOIN [SQM_SEGURIDAD].[Tbl_Usuarios_Roles] UR ON U.Id_Usuario = UR.Id_Usuario
    INNER JOIN [SQM_CATALOGOS].[Tbl_Roles] R ON UR.Id_Rol = R.Id_Rol
    WHERE (U.Nombre_Usuario = @Nombre_Usuario OR U.Correo_Electronico = @Nombre_Usuario)
      AND U.Id_Estado = 1
      AND C.PasswordHash = HASHBYTES('SHA2_256', CONCAT(@Contrasena_Intento, C.Salt));
END;