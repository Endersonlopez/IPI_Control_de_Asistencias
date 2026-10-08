CREATE DATABASE [DB_IPI_Control_Asistencias];
GO

USE [DB_IPI_Control_Asistencias];
GO

-- ESQUEMAS

CREATE SCHEMA [SQM_SEGURIDAD];
GO

CREATE SCHEMA [SQM_CATALOGOS];
GO

CREATE SCHEMA [SQM_GENERAL];
GO

-- TABLAS

CREATE TABLE [SQM_CATALOGOS].[Tbl_Estados]
(
    Id_Estado INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Estados PRIMARY KEY,
    Nombre_Estado VARCHAR(50) NOT NULL
);
GO

CREATE TABLE [SQM_CATALOGOS].[Tbl_Roles]
(
    Id_Rol INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Roles PRIMARY KEY,
    Nombre_Rol VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(150) NOT NULL,
    Id_Estado INT NOT NULL
        CONSTRAINT DF_Tbl_Roles_Id_Estado DEFAULT (1),
    CONSTRAINT FK_Tbl_Roles_Estado
        FOREIGN KEY (Id_Estado)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado)
);
GO

CREATE TABLE [SQM_SEGURIDAD].[Tbl_Usuarios]
(
    Id_Usuario INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Usuarios PRIMARY KEY,
    Primer_Nombre VARCHAR(100) NOT NULL,
    Segundo_Nombre VARCHAR(100) NULL,
    Primer_Apellido VARCHAR(100) NOT NULL,
    Segundo_Apellido VARCHAR(100) NULL,
    Nombre_Usuario VARCHAR(50) NOT NULL,
    Correo_Electronico VARCHAR(80) NOT NULL,
    Telefono VARCHAR(20) NOT NULL,
    Id_Estado INT NOT NULL,
    Id_Creador INT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Usuarios_Fecha_Creacion DEFAULT (SYSDATETIME()),
    Id_Modificador INT NULL,
    Fecha_Modificacion DATETIME2(3) NULL,
    CONSTRAINT UQ_Tbl_Usuarios_Nombre_Usuario UNIQUE (Nombre_Usuario),
    CONSTRAINT UQ_Tbl_Usuarios_Correo UNIQUE (Correo_Electronico),
    CONSTRAINT FK_Tbl_Usuarios_Estado
        FOREIGN KEY (Id_Estado)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    CONSTRAINT FK_Tbl_Usuarios_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Usuarios_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_SEGURIDAD].[Tbl_Credenciales]
(
    Id_Credencial INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Credenciales PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    PasswordHash VARBINARY(256) NOT NULL,
    Salt VARBINARY(64) NOT NULL,
    Id_Creador INT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Credenciales_Fecha_Creacion DEFAULT (SYSDATETIME()),
    Id_Modificador INT NULL,
    Fecha_Modificacion DATETIME2(3) NULL,
    CONSTRAINT UQ_Tbl_Credenciales_Usuario UNIQUE (Id_Usuario),
    CONSTRAINT FK_Tbl_Credenciales_Usuario
        FOREIGN KEY (Id_Usuario)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Credenciales_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Credenciales_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_SEGURIDAD].[Tbl_Usuarios_Roles]
(
    Id_Usuario_Rol INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Usuarios_Roles PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Id_Rol INT NOT NULL,
    Id_Creador INT NOT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Usuarios_Roles_Fecha_Creacion DEFAULT (SYSDATETIME()),
    CONSTRAINT UQ_Tbl_Usuarios_Roles UNIQUE (Id_Usuario, Id_Rol),
    CONSTRAINT FK_Tbl_Usuarios_Roles_Usuario
        FOREIGN KEY (Id_Usuario)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Usuarios_Roles_Rol
        FOREIGN KEY (Id_Rol)
        REFERENCES [SQM_CATALOGOS].[Tbl_Roles](Id_Rol),
    CONSTRAINT FK_Tbl_Usuarios_Roles_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_SEGURIDAD].[Tbl_Solicitudes_Cambio]
(
    Id_Solicitud INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Solicitudes_Cambio PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Estado VARCHAR(20) NOT NULL
        CONSTRAINT DF_Tbl_Solicitudes_Cambio_Estado DEFAULT ('Pendiente'),
    Fecha_Solicitud DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Solicitudes_Cambio_Fecha_Solicitud DEFAULT (SYSDATETIME()),
    Fecha_Atencion DATETIME2(3) NULL,
    Id_Admin_Atencion INT NULL,
    CONSTRAINT FK_Tbl_Solicitudes_Cambio_Usuario
        FOREIGN KEY (Id_Usuario)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Solicitudes_Cambio_Admin
        FOREIGN KEY (Id_Admin_Atencion)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_SEGURIDAD].[Tbl_Configuracion_Usuario]
(
    Id_Configuracion INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Configuracion_Usuario PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Tiempo_QR INT NOT NULL
        CONSTRAINT DF_Tbl_Configuracion_Usuario_Tiempo_QR DEFAULT (30),
    Notificaciones_Activas BIT NOT NULL
        CONSTRAINT DF_Tbl_Configuracion_Usuario_Notificaciones DEFAULT (1),
    CONSTRAINT UQ_Tbl_Configuracion_Usuario UNIQUE (Id_Usuario),
    CONSTRAINT FK_Tbl_Configuracion_Usuario_Usuario
        FOREIGN KEY (Id_Usuario)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_CATALOGOS].[Tbl_Estados_Asistencia]
(
    Id_Estado_Asistencia INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Estados_Asistencia PRIMARY KEY,
    Nombre_Estado VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(150) NOT NULL,
    Id_Creador INT NOT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Estados_Asistencia_Fecha_Creacion DEFAULT (SYSDATETIME()),
    Id_Modificador INT NULL,
    Fecha_Modificacion DATETIME2(3) NULL,
    CONSTRAINT FK_Tbl_Estados_Asistencia_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Estados_Asistencia_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_CATALOGOS].[Tbl_Carreras]
(
    Id_Carrera INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Carreras PRIMARY KEY,
    Nombre_Carrera VARCHAR(100) NOT NULL,
    Id_Estado INT NOT NULL,
    Id_Creador INT NOT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Carreras_Fecha_Creacion DEFAULT (SYSDATETIME()),
    Id_Modificador INT NULL,
    Fecha_Modificacion DATETIME2(3) NULL,
    CONSTRAINT FK_Tbl_Carreras_Estado
        FOREIGN KEY (Id_Estado)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    CONSTRAINT FK_Tbl_Carreras_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Carreras_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_CATALOGOS].[Tbl_Materias]
(
    Id_Materia INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Materias PRIMARY KEY,
    Nombre_Materia VARCHAR(100) NOT NULL,
    Codigo_Materia VARCHAR(20) NOT NULL,
    Id_Estado INT NOT NULL
        CONSTRAINT DF_Tbl_Materias_Estado DEFAULT (1),
    Id_Creador INT NOT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Materias_Fecha_Creacion DEFAULT (SYSDATETIME()),
    Id_Modificador INT NULL,
    Fecha_Modificacion DATETIME2(3) NULL,
    CONSTRAINT UQ_Tbl_Materias_Codigo UNIQUE (Codigo_Materia),
    CONSTRAINT FK_Tbl_Materias_Estado
        FOREIGN KEY (Id_Estado)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    CONSTRAINT FK_Tbl_Materias_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Materias_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_GENERAL].[Tbl_Alumnos]
(
    Id_Alumno INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Alumnos PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Id_Carrera INT NOT NULL,
    Documento_Identidad VARCHAR(50) NOT NULL,
    Id_Estado INT NOT NULL,
    Id_Creador INT NOT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Alumnos_Fecha_Creacion DEFAULT (SYSDATETIME()),
    Id_Modificador INT NULL,
    Fecha_Modificacion DATETIME2(3) NULL,
    CONSTRAINT UQ_Tbl_Alumnos_Usuario UNIQUE (Id_Usuario),
    CONSTRAINT UQ_Tbl_Alumnos_Documento UNIQUE (Documento_Identidad),
    CONSTRAINT FK_Tbl_Alumnos_Usuario
        FOREIGN KEY (Id_Usuario)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Alumnos_Carrera
        FOREIGN KEY (Id_Carrera)
        REFERENCES [SQM_CATALOGOS].[Tbl_Carreras](Id_Carrera),
    CONSTRAINT FK_Tbl_Alumnos_Estado
        FOREIGN KEY (Id_Estado)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    CONSTRAINT FK_Tbl_Alumnos_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Alumnos_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_GENERAL].[Tbl_Profesores]
(
    Id_Profesor INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Profesores PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Facultad VARCHAR(100) NOT NULL,
    Id_Estado INT NOT NULL,
    Id_Creador INT NOT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Profesores_Fecha_Creacion DEFAULT (SYSDATETIME()),
    Id_Modificador INT NULL,
    Fecha_Modificacion DATETIME2(3) NULL,
    CONSTRAINT UQ_Tbl_Profesores_Usuario UNIQUE (Id_Usuario),
    CONSTRAINT FK_Tbl_Profesores_Usuario
        FOREIGN KEY (Id_Usuario)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Profesores_Estado
        FOREIGN KEY (Id_Estado)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    CONSTRAINT FK_Tbl_Profesores_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Profesores_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_GENERAL].[Tbl_Horarios]
(
    Id_Horario INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Horarios PRIMARY KEY,
    Id_Materia INT NOT NULL,
    Id_Profesor INT NOT NULL,
    Dia_Semana INT NOT NULL,
    Hora_Inicio TIME NOT NULL,
    Hora_Fin TIME NOT NULL,
    Id_Estado INT NOT NULL
        CONSTRAINT DF_Tbl_Horarios_Estado DEFAULT (1),
    Id_Creador INT NOT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Horarios_Fecha_Creacion DEFAULT (SYSDATETIME()),
    Id_Modificador INT NULL,
    Fecha_Modificacion DATETIME2(3) NULL,
    CONSTRAINT CK_Tbl_Horarios_Dia_Semana CHECK (Dia_Semana BETWEEN 1 AND 7),
    CONSTRAINT CK_Tbl_Horarios_Horas CHECK (Hora_Inicio < Hora_Fin),
    CONSTRAINT FK_Tbl_Horarios_Materia
        FOREIGN KEY (Id_Materia)
        REFERENCES [SQM_CATALOGOS].[Tbl_Materias](Id_Materia),
    CONSTRAINT FK_Tbl_Horarios_Profesor
        FOREIGN KEY (Id_Profesor)
        REFERENCES [SQM_GENERAL].[Tbl_Profesores](Id_Profesor),
    CONSTRAINT FK_Tbl_Horarios_Estado
        FOREIGN KEY (Id_Estado)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    CONSTRAINT FK_Tbl_Horarios_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Horarios_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_GENERAL].[Tbl_Alumnos_Materias]
(
    Id_Alumno_Materia INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Alumnos_Materias PRIMARY KEY,
    Id_Alumno INT NOT NULL,
    Id_Materia INT NOT NULL,
    Id_Estado INT NOT NULL
        CONSTRAINT DF_Tbl_Alumnos_Materias_Estado DEFAULT (1),
    Id_Creador INT NOT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Alumnos_Materias_Fecha_Creacion DEFAULT (SYSDATETIME()),
    Id_Modificador INT NULL,
    Fecha_Modificacion DATETIME2(3) NULL,
    CONSTRAINT UQ_Tbl_Alumnos_Materias UNIQUE (Id_Alumno, Id_Materia),
    CONSTRAINT FK_Tbl_Alumnos_Materias_Alumno
        FOREIGN KEY (Id_Alumno)
        REFERENCES [SQM_GENERAL].[Tbl_Alumnos](Id_Alumno),
    CONSTRAINT FK_Tbl_Alumnos_Materias_Materia
        FOREIGN KEY (Id_Materia)
        REFERENCES [SQM_CATALOGOS].[Tbl_Materias](Id_Materia),
    CONSTRAINT FK_Tbl_Alumnos_Materias_Estado
        FOREIGN KEY (Id_Estado)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    CONSTRAINT FK_Tbl_Alumnos_Materias_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Alumnos_Materias_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_GENERAL].[Tbl_Asistencias]
(
    Id_Asistencia INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Asistencias PRIMARY KEY,
    Id_Alumno INT NOT NULL,
    Id_Horario INT NOT NULL,
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    Id_Estado_Asistencia INT NOT NULL,
    Id_Estado INT NOT NULL,
    Id_Creador INT NOT NULL,
    Fecha_Creacion DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Asistencias_Fecha_Creacion DEFAULT (SYSDATETIME()),
    Id_Modificador INT NULL,
    Fecha_Modificacion DATETIME2(3) NULL,
    CONSTRAINT UQ_Tbl_Asistencias_Alumno_Horario_Fecha
        UNIQUE (Id_Alumno, Id_Horario, Fecha),
    CONSTRAINT FK_Tbl_Asistencias_Alumno
        FOREIGN KEY (Id_Alumno)
        REFERENCES [SQM_GENERAL].[Tbl_Alumnos](Id_Alumno),
    CONSTRAINT FK_Tbl_Asistencias_Horario
        FOREIGN KEY (Id_Horario)
        REFERENCES [SQM_GENERAL].[Tbl_Horarios](Id_Horario),
    CONSTRAINT FK_Tbl_Asistencias_Estado_Asistencia
        FOREIGN KEY (Id_Estado_Asistencia)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados_Asistencia](Id_Estado_Asistencia),
    CONSTRAINT FK_Tbl_Asistencias_Estado
        FOREIGN KEY (Id_Estado)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    CONSTRAINT FK_Tbl_Asistencias_Creador
        FOREIGN KEY (Id_Creador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    CONSTRAINT FK_Tbl_Asistencias_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

CREATE TABLE [SQM_GENERAL].[Tbl_Historial_Asistencias]
(
    Id_Historial_Asistencia INT IDENTITY(1,1) NOT NULL
        CONSTRAINT PK_Tbl_Historial_Asistencias PRIMARY KEY,
    Id_Asistencia INT NOT NULL,
    Id_EstadoAnterior INT NOT NULL,
    Id_Estado_Nuevo INT NOT NULL,
    Fecha_Cambio DATETIME2(3) NOT NULL
        CONSTRAINT DF_Tbl_Historial_Asistencias_Fecha_Cambio DEFAULT (SYSDATETIME()),
    Id_Modificador INT NOT NULL,
    CONSTRAINT FK_Tbl_Historial_Asistencias_Asistencia
        FOREIGN KEY (Id_Asistencia)
        REFERENCES [SQM_GENERAL].[Tbl_Asistencias](Id_Asistencia),
    CONSTRAINT FK_Tbl_Historial_Asistencias_Estado_Anterior
        FOREIGN KEY (Id_EstadoAnterior)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados_Asistencia](Id_Estado_Asistencia),
    CONSTRAINT FK_Tbl_Historial_Asistencias_Estado_Nuevo
        FOREIGN KEY (Id_Estado_Nuevo)
        REFERENCES [SQM_CATALOGOS].[Tbl_Estados_Asistencia](Id_Estado_Asistencia),
    CONSTRAINT FK_Tbl_Historial_Asistencias_Modificador
        FOREIGN KEY (Id_Modificador)
        REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO