# Prompt: Frontend — Setup, Router y API Client

## Contexto

MedApp frontend usa **Vue 3 + Vite + Pinia + Vue Router**. Necesitamos la
configuración base, el enrutamiento con guards, y el cliente HTTP.

## Tarea

### 1. Vite Config (`frontend/vite.config.js`)

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```

### 2. Cliente API (`frontend/src/services/api.js`)

- Crear instancia de Axios con `baseURL`: usar `import.meta.env.VITE_API_URL || '/api'`.
- **Request interceptor**: si existe `localStorage.getItem('token')`, agregar header `Authorization: Bearer <token>`.
- **Response interceptor**: en cualquier respuesta con status 401, eliminar `token` de localStorage.
- Exportar la instancia.

### 3. Router (`frontend/src/router/index.js`)

Crear rutas con lazy loading:

| Path | Nombre | Componente | Meta |
|------|--------|-----------|------|
| `/` | `home` | `HomeView` | — |
| `/login` | `login` | `LoginView` | `guestOnly` |
| `/register` | `register` | `RegisterView` | `guestOnly` |
| `/dashboard` | `dashboard` | `DashboardPatient` | `requiresAuth, role: 'patient'` |
| `/dashboard/doctor` | `dashboard-doctor` | `DashboardDoctor` | `requiresAuth, role: 'doctor'` |
| `/guia-ia` | `guia-ia` | `GuiaIAView` | — |

**Guard `beforeEach`:**
- Si `meta.requiresAuth` y no hay token → redirigir a `/login?redirect=<ruta_actual>`.
- Si `meta.role` y el rol del usuario no coincide → redirigir a home.
- Si `meta.guestOnly` y hay token → redirigir al dashboard según rol.

### 4. Main (`frontend/src/main.js`)

- Crear app Vue.
- Instalar Pinia.
- Instalar router.
- Montar en `#app`.

### 5. App.vue

```vue
<template>
  <NavBar />
  <router-view />
</template>
```

Importar `NavBar` y usar `<router-view />` para el contenido.

### Archivos a crear

```
frontend/src/
├── main.js
├── App.vue
├── services/api.js
└── router/index.js
```
