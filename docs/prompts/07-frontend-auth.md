# Prompt: Frontend — Store de autenticación y Login/Register

## Contexto

MedApp frontend necesita gestionar el estado de autenticación con Pinia,
persistir token en localStorage, y manejar login + registro con roles.

## Tarea

### 1. Auth Store (`stores/auth.js`)

Crear store Pinia con:

**State:**
- `user`: objeto usuario o `null`. Cargar desde `localStorage.getItem('medapp_user')` (JSON.parse con try/catch, default `null`).

**Getters:**
- `isAuthenticated`: `!!this.user`.
- `isDoctor`: `this.user?.role === 'doctor'`.
- `isPatient`: `this.user?.role === 'patient'`.

**Actions:**
- `async login(email, password)`:
  - POST `/auth/login` con `{ email, password }`.
  - Llamar `setSession(data)`.
  - Retornar `data`.
- `async register(payload)`:
  - POST `/auth/register` con payload.
  - Llamar `setSession(data)`.
  - Retornar `data`.
- `async fetchMe()`:
  - GET `/auth/me`.
  - Actualizar `this.user`.
  - Persistir.
- `setSession({ token, user })`:
  - Guardar `token` en `localStorage.setItem('token', token)`.
  - Asignar `this.user = user`.
  - Persistir.
- `logout()`:
  - Eliminar `token` y `medapp_user` de localStorage.
  - `this.user = null`.
- `persist()`:
  - `localStorage.setItem('medapp_user', JSON.stringify(this.user))`.

### 2. Composable `useAuth` (`composables/useAuth.js`)

- Importar `useAuthStore` y `useRouter`.
- Retornar:
  - `welcomeName`: `store.user?.name?.split(' ')[0]` o `''`.
  - `login(email, password)`: llama `store.login()` y luego `redirectByRole()`.
  - `register(payload)`: llama `store.register()` y luego `redirectByRole()`.
  - `logout()`: llama `store.logout()` y redirige a `/`.
  - `redirectByRole()`: si doctor → `/dashboard/doctor`, si no → `/dashboard`.

### 3. LoginView (`views/LoginView.vue`)

- Formulario con `email` y `password` (v-model).
- Enviar al composable `login()`.
- Si hay `route.query.redirect`, redirigir ahí después del login.
- Mostrar errores del servidor.
- Link a registro: "¿No tienes cuenta? Regístrate".
- Estado de carga durante submit.

### 4. RegisterView (`views/RegisterView.vue`)

- Formulario con: `name`, `email`, `password`, `role` (radio: patient/doctor).
- Si `role === 'doctor'`, mostrar campo `specialty`.
- Enviar al composable `register()`.
- Mostrar errores del servidor.
- Link a login: "¿Ya tienes cuenta? Inicia sesión".
- Estado de carga durante submit.

### Archivos a crear

```
frontend/src/
├── stores/auth.js
├── composables/useAuth.js
├── views/LoginView.vue
└── views/RegisterView.vue
```
