USE [DB_Control_Asistencias];
GO

CREATE TABLE [SQM_SEGURIDAD].[Tbl_Configuracion_Usuario](
    Id_Configuracion INT PRIMARY KEY IDENTITY(1,1),
    Id_Usuario INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Tiempo_QR INT NOT NULL DEFAULT 30,
    Notificaciones_Activas BIT NOT NULL DEFAULT 1,
    UNIQUE (Id_Usuario)
);
GO