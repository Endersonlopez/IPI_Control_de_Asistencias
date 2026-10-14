USE DB_Control_Asistencias;
GO

-- ELIMINAR (BORRADO LÓGICO)
CREATE OR ALTER PROCEDURE [SQM_SEGURIDAD].[sp_Usuarios_Eliminar]
    @Id_Usuario INT,
    @Id_Estado_Inactivo INT =2,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [SQM_SEGURIDAD].[Tbl_Usuarios]
    SET Id_Estado = @Id_Estado_Inactivo,
        Id_Modificador = @Id_Modificador,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Usuario = @Id_Usuario;
END;
GO

