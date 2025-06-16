# 📋 Sistema de Gestión de Proyectos y Tareas

- **Ordenamiento bidireccional**

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **HEROUI** - Componentes UI modernos
- **Tailwind CSS** - Estilos utilitarios
- **Jotai** - Gestión de estado
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de schemas

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Backend API funcionando

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd web
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno
Crear archivo `.env`:

```env
# URL del backend API
API_URL=http://localhost:3001/api

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key-aqui

# Base URL para API pública
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
├── app/                          # App Router de Next.js
│   ├── dashboard/               # Páginas del dashboard
│   │   ├── projects/           # Gestión de proyectos
│   │   │   └── [id]/          # Detalle de proyecto
│   │   └── users/             # Gestión de usuarios
│   ├── login/                  # Página de login
│   └── layout.tsx              # Layout principal
├── modules/                     # Módulos organizados por funcionalidad
│   ├── auth/                   # Autenticación
│   │   ├── components/         # Componentes de auth
│   │   ├── context/           # Estado global
│   │   ├── services/          # Servicios API
│   │   ├── templates/         # Páginas completas
│   │   └── types/             # Tipos TypeScript
│   ├── common/                 # Componentes y servicios comunes
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── button/        # Botón personalizado
│   │   │   ├── table/         # Tabla con filtros
│   │   │   └── ...
│   │   ├── hooks/             # Hooks personalizados
│   │   ├── services/          # Cliente API
│   │   └── types/             # Tipos comunes
│   ├── project/               # Gestión de proyectos
│   │   ├── components/        # Componentes de proyecto
│   │   │   ├── create/        # Modal crear proyecto
│   │   │   ├── edit/          # Modal editar proyecto
│   │   │   └── form/          # Formulario proyecto
│   │   ├── services/          # API de proyectos
│   │   ├── templates/         # Páginas completas
│   │   └── types/             # Tipos de proyecto
│   ├── task/                  # Gestión de tareas
│   │   ├── components/        # Componentes de tarea
│   │   │   ├── create/        # Modal crear tarea
│   │   │   ├── edit/          # Modal editar tarea
│   │   │   └── form/          # Formulario tarea
│   │   ├── services/          # API de tareas
│   │   └── types/             # Tipos de tarea
│   ├── comment/               # Sistema de comentarios
│   │   ├── components/        # Componentes de comentario
│   │   │   ├── chat/          # Chat de comentarios
│   │   │   ├── create/        # Crear comentario
│   │   │   └── edit/          # Editar comentario
│   │   ├── services/          # API de comentarios
│   │   └── types/             # Tipos de comentario
│   ├── user/                  # Gestión de usuarios
│   │   ├── components/        # Componentes de usuario
│   │   ├── services/          # API de usuarios
│   │   ├── templates/         # Página de usuarios
│   │   └── types/             # Tipos de usuario
│   └── dashboard/             # Dashboard principal
│       ├── components/        # Componentes del dashboard
│       ├── services/          # Servicios del dashboard
│       └── types/             # Tipos del dashboard
├── config/                     # Configuración
├── styles/                     # Estilos globales
├── public/                     # Archivos estáticos
└── auth.ts                     # Configuración NextAuth
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```env
# Desarrollo
API_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret

# Producción
API_URL=https://api.tudominio.com
NEXTAUTH_URL=https://tudominio.com
NEXTAUTH_SECRET=production-secret-key
```

## 🚀 Deployment

### Build de Producción
```bash
npm run build
npm run start
```
