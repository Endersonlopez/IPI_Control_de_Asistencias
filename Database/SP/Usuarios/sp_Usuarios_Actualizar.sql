USE [DB_Control_Asistencias];
GO

-- ACTUALIZAR
CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_Actualizar]
    @Id_Usuario INT,
    @Primer_Nombre VARCHAR(100),
    @Segundo_Nombre VARCHAR(100) = NULL,
    @Primer_Apellido VARCHAR(100),
    @Segundo_Apellido VARCHAR(100) = NULL,
    @Nombre_Usuario VARCHAR(50),
    @Correo_Electronico VARCHAR(80),
    @Telefono VARCHAR(20),
    @Id_Estado INT,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_SEGURIDAD].[Tbl_Usuarios]
    SET Primer_Nombre = @Primer_Nombre,
        Segundo_Nombre = @Segundo_Nombre,
        Primer_Apellido = @Primer_Apellido,
        Segundo_Apellido = @Segundo_Apellido,
        Nombre_Usuario = @Nombre_Usuario,
        Correo_Electronico = @Correo_Electronico,
        Telefono = @Telefono,
        Id_Estado = @Id_Estado,
        Id_Modificador = @Id_Modificador,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Usuario = @Id_Usuario;
END;
GO