

# 🚀  Backend - Task Management System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com/)

Un sistema robusto de gestión de tareas construido con arquitectura de microservicios usando NestJS, TypeScript y PostgreSQL.


### 🔐 Autenticación y Autorización
- JWT Authentication
- Role-based access control (Admin/User)
- Token validation middleware
- Protected routes

### 👥 Gestión de Usuarios
- Registro y login de usuarios
- Gestión de perfiles
- Paginación y filtros
- Soft delete

### 📊 Gestión de Proyectos
- CRUD completo de proyectos
- Fechas de inicio y fin
- Duración de proyectos
- Asociación con tareas

### ✅ Sistema de Tareas
- Creación y gestión de tareas
- Estados: `todo`, `in_progress`, `completed`
- Asignación múltiple de usuarios
- Filtros avanzados (estado, usuario, fecha, búsqueda)
- Ordenamiento personalizable
- Paginación

### 💬 Sistema de Comentarios
- Comentarios por tarea
- Historial de comentarios
- CRUD completo

### 📧 Notificaciones
- Notificaciones por email
- Cambios de estado de tareas
- Templates HTML personalizados
- Integración con SMTP

## 🏗️ Arquitectura

El sistema utiliza una arquitectura de microservicios con los siguientes componentes:


## Arquitectura

```
+-------------------+
|     Frontend      |
+-------------------+
         |
         v
+-------------------+
|   API Gateway     |  <--- Entrada principal (HTTP)
+-------------------+
   |    |     |    |
   |    |     |    |
   |    |     |    |TCP
   v    v     v    v
+------+ +---------+ +---------+ +--------------+
| User  | | Project | | Comment | |   Task      |
|Service| |Service  | |Service  | |  Service    |
+---+---+ +----+----+ +----+----+ +------+------+
    |          |           |             |
    |          |           |             |
    |          |           |-------------|             
    |          |           |             v
    |          |           |     +------------------+
    |          |           |     |  External Svc    |
    |          |           |     +------------------+
    |          |           |            
    |          |           |            
    +----------+-----------+
               |
         +-----------+
         | Databases |
         +-----------+
```


## 🛠️ Tecnologías

### Backend Framework
- **NestJS** - Framework Node.js para aplicaciones escalables
- **TypeScript** - Superset tipado de JavaScript
- **Node.js 18+** - Runtime de JavaScript

### Base de Datos
- **PostgreSQL** - Base de datos relacional
- **TypeORM** - ORM para TypeScript y JavaScript

### Autenticación
- **JWT** - JSON Web Tokens
- **bcrypt** - Hashing de contraseñas

### Validación
- **Zod** - Validación de esquemas TypeScript-first

### Comunicación
- **TCP Microservices** - Comunicación entre servicios
- **RxJS** - Programación reactiva

### Email
- **Nodemailer** - Envío de emails
- **SMTP** - Protocolo de envío

## 🚀 Instalación

1. **Clona el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
cp .env.sample .env
# Edita el archivo .env con tus configuraciones
```

4. **Configura las bases de datos**
```bash
# Levanta las bases de datos con Docker
docker-compose -f docker-compose.db.yml up -d
```

5. **Ejecuta las migraciones**
```bash
npm run migration:run
```

## 🎯 Uso

### Desarrollo

```bash
# Ejecutar todos los servicios en modo desarrollo
npm run dev:all

```

### Producción

```bash
# Compilar todos los servicios
npm run build

# Ejecutar en producción
npm run start:all
```
## Usuario de prueba
email admin@example.com
password admin123

## 📚 API Endpoints

### 🔐 Autenticación
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 👥 Usuarios
```http
# Crear usuario
POST /user
Authorization: Bearer {token}

# Obtener usuarios con paginación
GET /user/all?page=1&limit=10&search=john&role=user&sortBy=name&sortOrder=ASC

# Obtener usuario por ID
GET /user/{id}

# Actualizar usuario
PUT /user/{id}

# Eliminar usuario
DELETE /user/{id}
```

### 📊 Proyectos
```http
# Crear proyecto
POST /project
Authorization: Bearer {token}

{
  "name": "Mi Proyecto",
  "duration": 30,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T00:00:00Z"
}

# Listar proyectos
GET /project

# Obtener proyecto
GET /project/{id}

# Actualizar proyecto
PUT /project/{id}

# Eliminar proyecto
DELETE /project/{id}
```

### ✅ Tareas
```http
# Crear tarea
POST /task
Authorization: Bearer {token}

{
  "title": "Mi Tarea",
  "description": "Descripción de la tarea",
  "dueDate": "2024-01-15T00:00:00Z",
  "status": "todo",
  "users": ["user-uuid-1", "user-uuid-2"],
  "projectId": "project-uuid"
}

# Listar tareas con filtros
GET /task/project/{projectId}?page=1&limit=10&search=test&status=todo&userId=user-uuid&sortBy=dueDate&sortOrder=DESC

# Obtener tarea
GET /task/{id}

# Actualizar tarea
PUT /task/{id}

# Eliminar tarea
DELETE /task/{id}
```

### 💬 Comentarios
```http
# Crear comentario
POST /comment
Authorization: Bearer {token}

{
  "description": "Mi comentario",
  "taskId": "task-uuid",
  "userId": "user-uuid"
}

# Obtener comentarios por tarea
GET /comment/task/{taskId}

# Actualizar comentario
PUT /comment/{id}

# Eliminar comentario
DELETE /comment/{id}
```

## 🏗️ Microservicios

### API Gateway (`apps/api-gateway`)
- **Puerto**: 4000
- **Función**: Punto de entrada único, enrutamiento, autenticación
- **Endpoints**: REST API públicos

### User Service (`apps/user`)
- **Puerto**: 5000
- **Función**: Gestión de usuarios, autenticación, JWT
- **Base de Datos**: PostgreSQL (Puerto 5432)

### Project Service (`apps/project`)
- **Puerto**: 5001
- **Función**: CRUD de proyectos
- **Base de Datos**: PostgreSQL (Puerto 5433)

### Task Service (`apps/task`)
- **Puerto**: 5002
- **Función**: Gestión de tareas, filtros, paginación
- **Base de Datos**: PostgreSQL (Puerto 5434)

### Comment Service (`apps/comment`)
- **Puerto**: 5003
- **Función**: Sistema de comentarios
- **Base de Datos**: PostgreSQL (Puerto 5435)

### External Service (`apps/external`)
- **Puerto**: 5004
- **Función**: Notificaciones por email, integraciones externas

---



⭐ **¡Dale una estrella al repo si te fue útil!** ⭐
