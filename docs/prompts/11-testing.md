# Prompt: Tests — Backend (Vitest + Supertest) y Frontend (Vitest)

## Contexto

MedApp usa **Vitest** para tests en backend y frontend. El backend usa
**Supertest** para testing HTTP. Los tests usan DB en memoria (`:memory:`).

## Tarea

### 1. Configuración Backend (`backend/vitest.config.js`)

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.js']
  }
})
```

### 2. Setup de tests (`backend/tests/setup.js`)

- Establecer variables de entorno antes de cada suite:
  - `process.env.DB_FILE = ':memory:'`
  - `process.env.JWT_SECRET = 'secreto-de-test'`
  - `process.env.JWT_EXPIRES_IN = '1h'`
- Importar `db` desde `src/db/index.js` para crear la DB en memoria.
- Las migraciones y seed se ejecutan automáticamente al importar `db/index.js`.

### 3. Tests de Auth (`backend/tests/auth.test.js`)

17 tests en total. Ejemplos:

- **Registro paciente**: POST `/api/auth/register` con `{ name, email, password, role: 'patient' }` → 201 con `token` y `user` (sin `password_hash`).
- **Registro médico**: POST `/api/auth/register` con `{ name, email, password, role: 'doctor', specialty: 'Cardiología' }` → 201.
- **Médico sin specialty**: POST sin `specialty` → 400.
- **Email duplicado**: registrar el mismo email dos veces → 409.
- **Login exitoso**: POST `/api/auth/login` con credenciales válidas → 200 con `token`.
- **Login inválido**: contraseña incorrecta → 401.
- **GET /me autenticado**: con token válido → 200 con usuario.
- **GET /me sin token**: sin header → 401.

### 4. Tests de Citas (`backend/tests/appointments.test.js`)

- **Listar médicos**: GET `/api/doctors` → 200 con array.
- **Crear cita**: POST `/api/appointments` como paciente → 201.
- **Listar mis citas**: GET `/api/appointments/mine` → 200 con las citas del usuario.
- **Citas pendientes**: GET `/api/appointments/pending` como médico → 200 con solo las asignadas al médico.
- **Confirmar cita**: PATCH `/api/appointments/:id/confirm` → 200 con status `confirmed`.
- **Paciente ve confirmada**: GET mine después de confirmar → status `confirmed`.
- **Paciente no puede confirmar**: PATCH como paciente → 403.
- **Fecha inválida**: POST con fecha malformada → 400.
- **Médico no puede crear**: POST como doctor → 403.

### 5. Tests Frontend (`frontend/tests/auth.store.test.js`)

- Mockear `services/api` con `vi.mock`.
- Test login: verificar que `store.login()` guarda token y user en el store.
- Test registro doctor: verificar `isDoctor === true` y `isPatient === false`.
- Test logout: verificar que limpia state y localStorage (`token`, `medapp_user`).

### Configuración Frontend

```js
// frontend/vitest.config.js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```

### Archivos a crear

```
backend/
├── vitest.config.js
└── tests/
    ├── setup.js
    ├── auth.test.js
    └── appointments.test.js
frontend/
├── vitest.config.js  (en vite.config.js)
└── tests/
    └── auth.store.test.js
```

### Ejecución

```bash
cd backend  && npm test   # Vitest + Supertest
cd frontend && npm test   # Vitest + jsdom
```
