USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Instituciones_Actualizar]
    @Id_Institucion INT,
    @Nombre_Institucion VARCHAR(150),
    @Id_Estado INT,
    @Id_Modificador INT
AS
BEGIN

    UPDATE [SQM_GENERAL].[Tbl_Instituciones]
    SET Nombre_Institucion = @Nombre_Institucion,
        Id_Estado = @Id_Estado,
        Id_Modificador = @Id_Modificador,
        Fecha_Modificacion = GETDATE()
    WHERE Id_Institucion = @Id_Institucion;
END;
GO