# 🏥 API Clínica Salud Integral

API REST desarrollada para gestionar las operaciones de una clínica médica. Permite administrar pacientes, médicos, especialidades, horarios, citas médicas y reportes.

El proyecto está desarrollado con Node.js, Express, TypeScript, Prisma ORM y PostgreSQL.

## 🚀 Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express 5:** framework para crear la API REST.
- **TypeScript:** tipado estático para mejorar la seguridad del código.
- **Prisma ORM:** comunicación y gestión de la base de datos.
- **PostgreSQL:** sistema gestor de base de datos.
- **Zod:** validación de los datos recibidos.
- **JWT (JSON Web Token):** autenticación y protección de rutas.
- **bcryptjs:** encriptación de contraseñas mediante hash.
- **Swagger:** documentación de los endpoints.

## 📋 Funcionalidades principales

- Registro y consulta de pacientes.
- Consulta del historial médico de los pacientes.
- Registro y consulta de médicos.
- Filtrado de médicos por especialidad.
- Administración de horarios médicos.
- Consulta de disponibilidad de turnos.
- Registro y gestión de citas médicas.
- Actualización del estado de las citas.
- Agenda individual de los médicos.
- Consulta de citas del paciente autenticado.
- Reportes diarios y por especialidad.
- Autenticación mediante JWT.
- Protección de rutas según el rol del usuario.

## 👥 Roles del sistema

El sistema utiliza los siguientes roles:

| Rol           | Permisos principales                                        |
| ------------- | ----------------------------------------------------------- |
| RECEPCIONISTA | Registrar pacientes y gestionar citas.                      |
| MEDICO        | Consultar su agenda y gestionar el estado de sus citas.     |
| GERENCIA      | Administrar médicos, pacientes, usuarios, citas y reportes. |
| PACIENTE      | Consultar sus citas y reservar sus propias citas.           |

**Nota:** PACIENTE se maneja actualmente como un valor de texto en el campo `User.role`.

## 📁 Estructura del proyecto

```text
API_CLINICA/
│
├── generated/
│   └── prisma/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── index.ts
│   │
│   └── ...
│
├── .env
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── prisma7.config.ts
├── tsconfig.json
└── README.md
```

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone URL_DE_TU_REPOSITORIO
```

### 2. Entrar a la carpeta

```bash
cd API_CLINICA
```

### 3. Instalar dependencias

```bash
pnpm install
```

### 4. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/NOMBRE_BASE_DATOS"
PORT=3000
JWT_SECRET="TU_CLAVE_SECRETA"
```

Reemplazar los valores de ejemplo por la configuración local correspondiente.

**Importante:** no subir el archivo `.env` a GitHub, porque contiene información privada.

### 5. Ejecutar las migraciones

```bash
pnpm exec prisma migrate dev
```

### 6. Generar el cliente de Prisma

```bash
pnpm exec prisma generate
```

### 7. Iniciar el servidor

```bash
pnpm dev
```

El servidor se ejecutará en:

```text
http://localhost:3000
```

## 📚 Documentación de la API

La documentación de los endpoints está disponible mediante Swagger:

```text
http://localhost:3000/api/docs
```

Desde Swagger se pueden consultar y probar las rutas de la API.

## 🔗 Principales endpoints

### Autenticación

| Método | Endpoint          | Función                                |
| ------ | ----------------- | -------------------------------------- |
| POST   | `/api/auth/login` | Iniciar sesión y obtener un token JWT. |

### Pacientes

| Método | Endpoint                        | Función                                       |
| ------ | ------------------------------- | --------------------------------------------- |
| POST   | `/api/patients`                 | Registrar un paciente.                        |
| GET    | `/api/patients`                 | Listar pacientes.                             |
| GET    | `/api/patients/:id`             | Buscar paciente por ID.                       |
| GET    | `/api/patients/:id/history`     | Consultar historial médico.                   |
| GET    | `/api/patients/me/appointments` | Consultar las citas del paciente autenticado. |

### Médicos

| Método | Endpoint                      | Función                                 |
| ------ | ----------------------------- | --------------------------------------- |
| GET    | `/api/doctors/public`         | Consultar médicos activos públicamente. |
| GET    | `/api/doctors`                | Listar médicos.                         |
| GET    | `/api/doctors?specialityId=1` | Filtrar médicos por especialidad.       |
| GET    | `/api/doctors/my-agenda`      | Consultar agenda médica.                |
| GET    | `/api/doctors/:id/schedules`  | Consultar horarios de un médico.        |
| POST   | `/api/doctors`                | Registrar un médico.                    |
| POST   | `/api/doctors/schedules`      | Registrar horarios médicos.             |
| PATCH  | `/api/doctors/:id/status`     | Activar o desactivar un médico.         |

### Citas médicas

| Método | Endpoint                         | Función                                     |
| ------ | -------------------------------- | ------------------------------------------- |
| GET    | `/api/appointments`              | Listar citas.                               |
| GET    | `/api/appointments/availability` | Consultar turnos disponibles.               |
| POST   | `/api/appointments`              | Registrar una cita por personal autorizado. |
| POST   | `/api/appointments/mine`         | Reservar una cita como paciente.            |
| PATCH  | `/api/appointments/:id/status`   | Actualizar el estado de una cita.           |

### Reportes

| Método | Endpoint                                     | Función                                         |
| ------ | -------------------------------------------- | ----------------------------------------------- |
| GET    | `/api/reports/profitability-by-area`         | Consultar el volumen de citas por especialidad. |
| GET    | `/api/reports/daily-summary?date=2026-11-20` | Consultar el resumen diario de citas.           |

## 🔐 Seguridad

La API implementa diferentes mecanismos de seguridad:

- JWT para autenticar a los usuarios.
- Middleware para verificar los tokens.
- Middleware para controlar los permisos según el rol.
- bcryptjs para almacenar contraseñas mediante hash.
- Zod para validar los datos recibidos.
- Restricción de acceso a las agendas y citas según el usuario autenticado.

## 🧪 Verificación del proyecto

Para comprobar que el código TypeScript no presenta errores:

```bash
pnpm exec tsc --noEmit
```

Para iniciar el servidor:

```bash
pnpm dev
```

## 👨‍💻 Autor

**Kevinchotech**

Proyecto funvalero desarrollado para la gestión de una clínica médica, utilizando Node.js, Express, TypeScript, Prisma y PostgreSQL.
