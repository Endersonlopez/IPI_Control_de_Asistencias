USE [DB_Control_Asistencias];
GO

-- AUDITORIA ASISTENCIAS
CREATE OR ALTER TRIGGER [SQM_GENERAL].[trg_Auditoria_Asistencias]
ON [SQM_GENERAL].[Tbl_Asistencias]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF UPDATE(Id_Estado_Asistencia)
    BEGIN
        INSERT INTO [SQM_GENERAL].[Tbl_Historial_Asistencias] (
            Id_Asistencia, 
            Id_EstadoAnterior, 
            Id_Estado_Nuevo,
            Fecha_Cambio,
            Id_Modificador
        )
        SELECT 
            i.Id_Asistencia,
            d.Id_Estado_Asistencia,
            i.Id_Estado_Asistencia,
            GETDATE(),
            i.Id_Modificador
        FROM inserted i
        INNER JOIN deleted d ON i.Id_Asistencia = d.Id_Asistencia
        WHERE i.Id_Estado_Asistencia <> d.Id_Estado_Asistencia;
    END
END;
GO