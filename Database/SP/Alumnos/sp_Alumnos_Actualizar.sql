USE [DB_Control_Asistencias];
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Alumnos_Actualizar]
    @Id_Alumno INT,
    @Id_Usuario INT,
    @Primer_Nombre VARCHAR(50),
    @Segundo_Nombre VARCHAR(50) = NULL,
    @Primer_Apellido VARCHAR(50),
    @Segundo_Apellido VARCHAR(50) = NULL,
    @Nombre_Usuario VARCHAR(50),
    @Telefono VARCHAR(20) = NULL,
    @Id_Grado INT,
    @Documento_Identidad VARCHAR(50),
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Valida que el nombre de usuario no exista en otro registro
    IF EXISTS (SELECT 1 FROM [SQM_SEGURIDAD].[Tbl_Usuarios] WHERE Nombre_Usuario = @Nombre_Usuario AND Id_Usuario <> @Id_Usuario)
    BEGIN
        RAISERROR('El nombre de usuario ya está en uso por otra persona.', 16, 1);
        RETURN;
    END

    -- Actualiza la tabla de usuarios
    UPDATE [SQM_SEGURIDAD].[Tbl_Usuarios]
    SET Primer_Nombre = @Primer_Nombre,
        Segundo_Nombre = @Segundo_Nombre,
        Primer_Apellido = @Primer_Apellido,
        Segundo_Apellido = @Segundo_Apellido,
        Nombre_Usuario = @Nombre_Usuario,
        Telefono = @Telefono
    WHERE Id_Usuario = @Id_Usuario;

    -- Actualiza la tabla de Alumnos
    UPDATE [SQM_GENERAL].[Tbl_Alumnos]
    SET Id_Grado = @Id_Grado,
        Documento_Identidad = @Documento_Identidad,
        Id_Modificador = @Id_Modificador, 
        Fecha_Modificacion = GETDATE()       
    WHERE Id_Alumno = @Id_Alumno;

    -- Retorna 1 para indicar éxito
    SELECT 1;
END;
GO