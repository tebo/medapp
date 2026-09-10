# 4. Ejemplos prácticos aplicados a este proyecto

> Parte de la **Guía de uso de Asistencia de IA**.
> Anterior: [3. Mejores prácticas](./03-mejores-practicas.md) · Siguiente: [5. Errores comunes](./05-errores-comunes.md)

¿Qué le habríamos pedido a una IA para construir MedApp? Aquí tienes prompts
reales enlazados con cada parte del código que ya existe en el repositorio.

## 4.1 Prompt → Estructura de carpetas

> «Actúa como arquitecto de software. Propón la estructura de directorios para
> una aplicación de citas médicas monorepo: frontend Vue 3 + backend Node.js/
> Express con SQLite. Nivel avanzado: incluye Docker, CI/CD (GitHub Actions),
> tests (Vitest) y documentación en docs/. No crees la implementación, solo la
> estructura y una breve explicación de cada carpeta.»

**Resultado en este repo:** la estructura raíz (`frontend/`, `backend/`, `docs/`,
`docker/`, `.github/`).

## 4.2 Prompt → Migración SQL inicial

> «Dado este esquema de proyecto (link o pega la descripción), escribe una
> migración SQLite con CREATE TABLE IF NOT EXISTS para: una tabla users con role
> CHECK('patient','doctor'), una columna specialty solo para médicos, y una tabla
> appointments con patient_id y doctor_id como claves foráneas, status con CHECK
> pending/confirmed/rejected/cancelled y created_at con datetime('now'). Nombres
> de columnas en snake_case.»

**Resultado:** `backend/src/db/migrations.js`.

## 4.3 Prompt → Seed de médicos demo

> «Crea un archivo seed para SQLite que inserte 4 médicos de ejemplo (nombres,
> emails, especialidades) con bcrypt para la contraseña "doctor123", solo si la
> tabla users no tiene médicos todavía. Usa better-sqlite3 con prepare/run.»

**Resultado:** `backend/src/db/seed.js`.

## 4.4 Prompt → Registro y login

> «Implementa en Express: POST /api/auth/register validando name, email,
> password (mínimo 6 caracteres), role (patient|doctor) y specialty obligatoria
> si role es doctor. Encripta con bcrypt. POST /api/auth/login devuelve un JWT con
> sub, email y role. Responde solo el token y un objeto user sin password_hash.
> Errores en español.»

**Resultado:** `backend/src/controllers/auth.controller.js` + `user.service.js`.

## 4.5 Prompt → Middleware de autenticación y autorización

> «Crea dos middlewares en un archivo auth.js: authenticate() que lea el header
> Authorization Bearer, verifique con jsonwebtoken y ponga req.user; y
> authorize(...roles) que compruebe el rol y responda 403 si no coincide.
> CommonJS, comentarios mínimos.»

**Resultado:** `backend/src/middleware/auth.js`.

## 4.6 Prompt → Flujo de citas

> «Añade al backend: POST /api/appointments (solo patient) con doctorId, date
> (YYYY-MM-DD), time (HH:MM) y razón; validar fecha y hora con regex. GET
> /api/appointments/mine para ver citas propias. GET /api/appointments/pending
> para que un doctor vea las suyas. PATCH /:id/confirm y /:id/reject solo doctor
> y solo sobre citas pending asignadas a él. La fecha no puede ser anterior a
> hoy: devuelve 400 si lo es.»

**Resultado:** `backend/src/controllers/appointments.controller.js` + las
validaciones de fecha/hora en `backend/src/utils/validation.js` (`isValidDate`,
`isFutureDate`, `isValidTime`).

## 4.7 Prompt → Endpoint de lista de médicos

> «Crea GET /api/doctors que devuelva { doctors: [{id, name, specialty}] } solo
> de usuarios role='doctor' ordenados por nombre. Requiere autenticación.»

**Resultado:** `backend/src/routes/doctors.routes.js` + `doctors.controller.js`.

## 4.8 Prompt → Tests del backend

> «Escribe tests con Vitest + Supertest para una API Express que usa better-sqlite3
> con DB_FILE=:memory:. Cubre: registro válido, email duplicado (409), login
> válido/inválido, /me con y sin token, crear cita, ver mis citas, doctor ve
> pendientes, doctor confirma, paciente no puede confirmar (403). Usa globals y
> un setup file que configure el entorno.»

**Resultado:** `backend/tests/auth.test.js`, `backend/tests/appointments.test.js` y
`backend/tests/doctors.test.js` (integración) más las suites unitarias
`backend/tests/validation.test.js`, `backend/tests/middleware.auth.test.js` y
`backend/tests/user.service.test.js`. En total **67 tests**.

## 4.9 Prompt → Cliente API del frontend

> «Crea un cliente Axios para Vue 3 con baseURL de VITE_API_URL o '/api', un
> interceptor de request que añada el header Authorization Bearer desde
> localStorage, y un interceptor de response que borre el token en 401.»

**Resultado:** `frontend/src/services/api.js`.

## 4.10 Prompt → Store de autenticación con Pinia

> «Crea un store Pinia useAuthStore con estado user (cargado desde localStorage),
> getters isAuthenticated/isDoctor/isPatient, y acciones login, register,
> fetchMe, logout. login/register llaman a la API, guardan el token en
> localStorage y el usuario serializado.»

**Resultado:** `frontend/src/stores/auth.js`.

## 4.11 Prompt → Vistas del paciente y del médico

> «Crea dos vistas Vue 3. Una de paciente: formulario para pedir cita (select de
> médicos y fecha/hora/motivo) y lista de sus citas con badge de estado. Una de
> médico: listado de solicitudes pendientes con botones Confirmar/Rechazar y un
> contador de pendientes/confirmadas/rechazadas. Usa <script setup>.»

**Resultado:** `frontend/src/views/DashboardPatient.vue` y `DashboardDoctor.vue`.

## 4.12 Prompt → Refactor de validaciones y regla de negocio

> «Mueve la validación de fecha y hora del controlador de citas a un módulo
> backend/src/utils/validation.js con funciones isValidDate, isValidTime e
> isFutureDate. Añade la regla de negocio "una cita no puede tener fecha
> anterior a hoy" (devuelve 400) y escribe tests unitarios para cada caso:
> formato, fecha inexistente en el calendario, pasada y hora fuera de rango.»

**Resultado:** `backend/src/utils/validation.js` y `backend/tests/validation.test.js`
(17 casos). Ejemplo real de la fase 4 del workflow: refactorizar con IA sin cambiar
el comportamiento, y de que las reglas de negocio las define el ser humano.

## Cómo leer el resultado

Cada prompt arriba no generó el archivo perfecto a la primera: requirió 1-3
iteraciones de ajuste (p. ej. «los errores en español», «no devuelvas
password_hash», «usa CHECK en SQL, no validación del modelo»). Esa iteración es
parte natural del proceso.

Un caso real ocurrió en `GuiaIAView.vue`: la vista usaba `computed()` en la
plantilla pero el import inicial solo traía `ref`, así que la página no se
renderizaba. La corrección fue una línea —`import { ref, computed } from 'vue'`—,
típico de un "error común" del capítulo 5: código que parece completo pero rompe
al ejecutarse. Ahí es exactamente cuando le muestras el trace a la IA y le pides
arreglar *solo eso*.