# Prompt: Backend — Autenticación (JWT + middleware)

## Contexto

MedApp usa **JWT** para autenticación y **bcryptjs** para hashing de
contraseñas. Los usuarios pueden ser `patient` o `doctor`.

## Tarea

### 1. Middleware de autenticación (`middleware/auth.js`)

Crear 2 middlewares:

**`authenticate(req, res, next)`:**
- Extraer token del header `Authorization: Bearer <token>`.
- Si no hay token → 401 `{ error: 'Token de acceso requerido' }`.
- Verificar con `jsonwebtoken.verify(token, config.JWT_SECRET)`.
- Si el token es inválido/expirado → 401 `{ error: 'Token inválido o expirado' }`.
- Si es válido → `req.user = { id: payload.sub, role: payload.role }` y llamar `next()`.

**`authorize(...roles)`:**
- Retorna un middleware.
- Si `req.user.role` no está en `roles` → 403 `{ error: 'No tienes permiso para esta acción' }`.
- Si está autorizado → `next()`.

### 2. Rutas de auth (`routes/auth.routes.js`)

```
POST   /api/auth/register   → controller.register    (público)
POST   /api/auth/login      → controller.login        (público)
GET    /api/auth/me          → authenticate → controller.me
```

### 3. Controller de auth (`controllers/auth.controller.js`)

**`register(req, res, next)`:**
- Validar: `name`, `email`, `password` son requeridos.
- Validar: `role` ∈ `['patient', 'doctor']`.
- Validar: `password` tiene mínimo 6 caracteres.
- Si `role === 'doctor'`, `specialty` es requerido.
- Si `role` no se envía, asumir `'patient'`.
- Llamar a `userService.createUser(...)`.
- Retornar 201 `{ token, user }` donde `user` no incluye `password_hash`.
- Si el email ya existe (error de constraint UNIQUE) → 409 `{ error: 'El email ya está registrado' }`.
- Si falta algún campo → 400 `{ error: '...' }`.

**`login(req, res, next)`:**
- Extraer `email` y `password` del body.
- Buscar usuario por email.
- Si no existe o password no coincide → 401 `{ error: 'Credenciales inválidas' }`.
- Retornar 200 `{ token, user }`.

**`me(req, res, next)`:**
- Buscar usuario por `req.user.id`.
- Si no existe → 404 `{ error: 'Usuario no encontrado' }`.
- Retornar 200 `{ user }` sin `password_hash`.

**Función auxiliar `publicUser(user)`:**
- Retornar el usuario sin el campo `password_hash`.

**Generación de JWT:**
- Payload: `{ sub: user.id, email: user.email, role: user.role }`.
- `expiresIn`: `config.JWT_EXPIRES_IN`.
- Secret: `config.JWT_SECRET`.

### Archivos a crear

```
backend/src/middleware/auth.js
backend/src/routes/auth.routes.js
backend/src/controllers/auth.controller.js
```

### Ejemplo de uso

```bash
# Registro de paciente
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","email":"juan@test.com","password":"123456","role":"patient"}'

# Respuesta 201
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 5, "name": "Juan", "email": "juan@test.com", "role": "patient" }
}

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"123456"}'
```
