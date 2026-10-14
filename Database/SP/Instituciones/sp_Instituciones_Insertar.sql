USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_GENERAL].[sp_Instituciones_Insertar]
    @Nombre_Institucion VARCHAR(150),
    @Id_Estado INT = 1,
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [SQM_GENERAL].[Tbl_Instituciones] (
        Nombre_Institucion, 
        Id_Estado, 
        Id_Creador, 
        Fecha_Creacion
    )
    VALUES (
        @Nombre_Institucion, 
        @Id_Estado, 
        @Id_Creador, 
        GETDATE()
    );

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS Nuevo_Id;
END;
GO