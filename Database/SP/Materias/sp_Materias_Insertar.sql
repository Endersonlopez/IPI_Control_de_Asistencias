USE DB_Control_Asistencias;
GO

CREATE OR ALTER PROCEDURE [SQM_CATALOGOS].[sp_Materias_Insertar]
    @Nombre_Materia VARCHAR(100),
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Prefijo VARCHAR(3);
    DECLARE @SiguienteNumero INT;
    DECLARE @Codigo_Materia VARCHAR(20);
    
    SET @Prefijo = UPPER(LEFT(REPLACE(@Nombre_Materia, ' ', ''), 3));

    SELECT @SiguienteNumero = ISNULL(
        MAX(CAST(SUBSTRING(Codigo_Materia, CHARINDEX('-', Codigo_Materia) + 1, LEN(Codigo_Materia)) AS INT)), 
        0 
    ) + 1
    FROM [SQM_CATALOGOS].[Tbl_Materias]
    WHERE Codigo_Materia LIKE @Prefijo + '-%';

    SET @Codigo_Materia = @Prefijo + '-' + FORMAT(@SiguienteNumero, '000');

    DECLARE @OutputTable TABLE (Id_Materia INT, Codigo_Materia VARCHAR(20));

    INSERT INTO [SQM_CATALOGOS].[Tbl_Materias] (
        Nombre_Materia, 
        Codigo_Materia, 
        Id_Estado, 
        Id_Creador, 
        Fecha_Creacion
    )
    OUTPUT INSERTED.Id_Materia, INSERTED.Codigo_Materia INTO @OutputTable
    VALUES (
        @Nombre_Materia, 
        @Codigo_Materia, 
        1, 
        @Id_Creador, 
        GETDATE()
    );

    SELECT Id_Materia, Codigo_Materia FROM @OutputTable;
END;
GO