CREATE DATABASE [DB_Control_Asistencias];
GO

USE [DB_Control_Asistencias];
GO

-- ESQUEMAS
CREATE SCHEMA [SQM_SEGURIDAD];
GO
CREATE SCHEMA [SQM_CATALOGOS];
GO
CREATE SCHEMA [SQM_GENERAL];
GO

CREATE TABLE [SQM_Catalogos].[Tbl_Estados]
(
    Id_Estado INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Estado VARCHAR(50) NOT NULL
);

-- ROLES
CREATE TABLE [SQM_CATALOGOS].[Tbl_Roles]
(
    Id_Rol INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Rol VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(150) NOT NULL,
    Id_Estado INT NOT NULL DEFAULT 1 REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado)
);

-- ESTADOS ASISTENCIA
CREATE TABLE [SQM_CATALOGOS].[Tbl_Estados_Asistencia]
(
    Id_Estado_Asistencia INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Estado VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(150) NOT NULL,
    Fecha_Creacion DATETIME NOT NULL,
    Fecha_Modificacion DATETIME NULL
);

-- USUARIOS
CREATE TABLE [SQM_SEGURIDAD].[Tbl_Usuarios]
(
    Id_Usuario INT PRIMARY KEY IDENTITY (1,1),
    Primer_Nombre VARCHAR(100) NOT NULL,
    Segundo_Nombre VARCHAR(100) NULL,
    Primer_Apellido VARCHAR(100) NOT NULL,
    Segundo_Apellido VARCHAR(100) NULL,
    Nombre_Usuario VARCHAR(50) NOT NULL UNIQUE,
    Correo_Electronico VARCHAR(80) NOT NULL UNIQUE,
    Telefono VARCHAR(20) NOT NULL,
    Id_Estado INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    Id_Creador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL,
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL
);

-- USUARIOS ROLES
CREATE TABLE [SQM_SEGURIDAD].[Tbl_Usuarios_Roles]
(
    Id_Usuario_Rol INT PRIMARY KEY IDENTITY(1,1),
    Id_Usuario INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Id_Rol INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Roles](Id_Rol),
    Id_Creador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL,
    CONSTRAINT UQ_Usuario_Rol UNIQUE (Id_Usuario, Id_Rol)
);


-- INSTITUCIONES
CREATE TABLE [SQM_GENERAL].[Tbl_Instituciones]
(
    Id_Institucion INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Institucion VARCHAR(150) NOT NULL,
    Id_Estado INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    Id_Creador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL,
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL
);

-- SEDES
CREATE TABLE [SQM_GENERAL].[Tbl_Sedes]
(
    Id_Sede INT PRIMARY KEY IDENTITY(1,1),
    Id_Institucion INT NOT NULL REFERENCES [SQM_GENERAL].[Tbl_Instituciones](Id_Institucion),
    Nombre_Sede VARCHAR(150) NOT NULL,
    Id_Estado INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    Id_Creador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL,
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL
);

-- GRADOS
CREATE TABLE [SQM_CATALOGOS].[Tbl_Grados]
(
    Id_Grado INT PRIMARY KEY IDENTITY(1,1),
    Id_Sede INT NOT NULL REFERENCES [SQM_GENERAL].[Tbl_Sedes](Id_Sede),
    Nombre_Grado VARCHAR(100) NOT NULL,
    Id_Estado INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    Id_Creador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL,
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL
);

-- ALUMNOS
CREATE TABLE [SQM_GENERAL].[Tbl_Alumnos]
(
    Id_Alumno INT PRIMARY KEY IDENTITY(1,1),
    Id_Usuario INT NOT NULL UNIQUE REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Id_Grado INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Grados](Id_Grado),
    Documento_Identidad VARCHAR(50) NOT NULL UNIQUE,
    Id_Estado INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    Id_Creador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL,
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL
);

-- PROFESORES
CREATE TABLE [SQM_GENERAL].[Tbl_Profesores](
    Id_Profesor INT PRIMARY KEY IDENTITY(1,1),
    Id_Usuario INT NOT NULL UNIQUE REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Facultad VARCHAR(100) NOT NULL,
    Id_Estado INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    Id_Creador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL,
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL
);
GO

-- ASISTENCIAS
CREATE TABLE [SQM_GENERAL].[Tbl_Asistencias]
(
    Id_Asistencia INT PRIMARY KEY IDENTITY(1,1),
    Id_Alumno INT NOT NULL REFERENCES [SQM_GENERAL].[Tbl_Alumnos](Id_Alumno),
    Id_Horario INT NOT NULL REFERENCES [SQM_GENERAL].[Tbl_Horarios](Id_Horario),
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    Id_Estado_Asistencia INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Estados_Asistencia](Id_Estado_Asistencia),
    Id_Estado INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    Id_Creador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL DEFAULT GETDATE(),
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL
);
GO

-- HISTORIAL ASISTENCIAS
CREATE TABLE [SQM_GENERAL].[Tbl_Historial_Asistencias] 
(
    Id_Historial_Asistencia INT IDENTITY(1,1) PRIMARY KEY,
    Id_Asistencia INT NOT NULL REFERENCES [SQM_GENERAL].[Tbl_Asistencias](Id_Asistencia),
    Id_EstadoAnterior INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Estados_Asistencia](Id_Estado_Asistencia),
    Id_Estado_Nuevo INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Estados_Asistencia](Id_Estado_Asistencia),
    Fecha_Cambio DATETIME NOT NULL,
    Id_Modificador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO

-- MATERIAS
CREATE TABLE [SQM_CATALOGOS].[Tbl_Materias]
(
    Id_Materia INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Materia VARCHAR(100) NOT NULL,
    Codigo_Materia VARCHAR(20) NOT NULL UNIQUE,
    Id_Estado INT NOT NULL DEFAULT 1 REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    Id_Creador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL DEFAULT GETDATE(),
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL
);
GO

-- CREDENCIALES
CREATE TABLE [SQM_SEGURIDAD].[Tbl_Credenciales]
(
    Id_Credencial INT PRIMARY KEY IDENTITY(1,1),
    Id_Usuario INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    PasswordHash VARBINARY(256) NOT NULL,
    Salt NVARCHAR(50) NOT NULL,
    Id_Creador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL,
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL
);
GO

-- HORARIOS
CREATE TABLE [SQM_GENERAL].[Tbl_Horarios](
    Id_Horario INT PRIMARY KEY IDENTITY(1,1),
    Id_Materia INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Materias](Id_Materia),
    Id_Profesor INT NOT NULL REFERENCES [SQM_GENERAL].[Tbl_Profesores](Id_Profesor),
    Dia_Semana INT NOT NULL,
    Hora_Inicio TIME NOT NULL,
    Hora_Fin TIME NOT NULL,
    Id_Estado INT NOT NULL DEFAULT 1 REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    Id_Creador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL DEFAULT GETDATE(),
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL
);

-- ALUMNOS - MATERIAS
CREATE TABLE [SQM_GENERAL].[Tbl_Alumnos_Materias](
    Id_Alumno_Materia INT PRIMARY KEY IDENTITY(1,1),
    Id_Alumno INT NOT NULL REFERENCES [SQM_GENERAL].[Tbl_Alumnos](Id_Alumno),
    Id_Materia INT NOT NULL REFERENCES [SQM_CATALOGOS].[Tbl_Materias](Id_Materia),
    Id_Estado INT NOT NULL DEFAULT 1 REFERENCES [SQM_CATALOGOS].[Tbl_Estados](Id_Estado),
    Id_Creador INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Creacion DATETIME NOT NULL DEFAULT GETDATE(),
    Id_Modificador INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Fecha_Modificacion DATETIME NULL,
    CONSTRAINT UQ_Alumno_Materia UNIQUE (Id_Alumno, Id_Materia)
);
GO

-- SOLICITUDES DE CAMBIO
CREATE TABLE [SQM_SEGURIDAD].[Tbl_Solicitudes_Cambio](
    Id_Solicitud INT PRIMARY KEY IDENTITY(1,1),
    Id_Usuario INT NOT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario),
    Estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    Nueva_Contrasena VARCHAR(100) NULL,
    Fecha_Solicitud DATETIME NOT NULL DEFAULT GETDATE(),
    Fecha_Atencion DATETIME NULL,
    Id_Admin_Atencion INT NULL REFERENCES [SQM_SEGURIDAD].[Tbl_Usuarios](Id_Usuario)
);
GO