# Plan de Pruebas de Calidad — MedApp

Proyecto: **MedApp — Citas Médicas + Guía de Asistencia de IA**
Versión del plan: **1.0**
Última actualización: **2026-09-10**

Stack: Vue 3 + Vite + Pinia (frontend) · Node.js + Express + SQLite (backend) ·
Vitest / Supertest (testing) · Docker + GitHub Actions (devops).

---

## 1. Objetivo

Definir la estrategia de aseguramiento de calidad para la aplicación demo MedApp,
describiendo los niveles de prueba, los casos a cubrir, los criterios de
aceptación y el flujo de gestión de defectos. El plan sirve como guía de
ejecución para validar que el flujo de una cita médica (solicitud → confirmación)
funciona de extremo a extremo con control de acceso por rol.

## 2. Alcance

### Dentro del alcance

- **Autenticación y autorización**: registro y login de pacientes y médicos, JWT,
  control de acceso por rol.
- **Catálogo de médicos**: listado de profesionales disponibles.
- **Citas médicas**: creación (paciente), consulta (`mine`, `pending`),
  confirmación y rechazo (médico), estados y validaciones.
- **Frontend**: envistas de Home, Login, Register, dashboards de paciente y doctor,
  guía de IA; store de autenticación (Pinia) y protección de rutas por rol.
- **Devops**: pipeline CI (tests y build) e integración Docker.
- **Comportamiento de la API**: códigos HTTP, formato de respuestas y errores.

### Fuera del alcance

- Pruebas de rendimiento/estrés a escala (aplicación educativa con SQLite).
- Auditoría de seguridad completa (pen-testing, cumplimiento de normativas de salud).
- Compatibilidad con múltiples navegadores antiguos (validado en navegadores modernos).
- Funcionalidad de cancelación de citas (reservada para una futura versión).

## 3. Componentes bajo prueba

| Componente | Módulo | Rutas / Vistas |
|------------|--------|----------------|
| Backend API | `backend/src` | `GET /api/health` |
| | | `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me` |
| | | `GET /api/doctors` |
| | | `POST /api/appointments` · `GET /api/appointments/mine` · `GET /api/appointments/pending` |
| | | `PATCH /api/appointments/:id/confirm` · `PATCH /api/appointments/:id/reject` |
| Frontend | `frontend/src` | `/` · `/login` · `/register` · `/dashboard` (patient) · `/dashboard/doctor` · `/guia-ia` |
| Store/Router | `frontend/src` | `stores/auth.js` · `router/index.js` |
| Componentes | `frontend/src/components` | `AppointmentCard.vue` · `NavBar.vue` |
| Composable/Servicio | `frontend/src` | `composables/useAuth.js` · `services/api.js` |
| Utilidades | `backend/src/utils` | `validation.js` (fecha/hora) |
| DevOps | `.github/workflows` | `ci.yml` (tests + build) · `docker.yml` (imágenes GHCR) |

## 4. Estrategia de pruebas

Se aplican los siguientes niveles, de menor a mayor alcance:

### 4.1 Pruebas unitarias

- **Backend**: sobre servicios y lógica de negocio aislada (SQLite en memoria).
- **Frontend**: sobre el store de autenticación (Pinia) con `api` mockeado.

### 4.2 Pruebas de integración (API)

- **Backend**: usando **Supertest** sobre la app Express, con base de datos
  `:memory:` y seed de médicos demo; validan la cadena completa
  ruta → controlador → servicio → modelo → SQLite.
- **Frontend**: integración del store con el cliente Axios y persistencia en
  `localStorage` (via jsdom).

### 4.3 Pruebas E2E (propuestas)

- **Playwright** (pendiente de añadir): flujo completo en navegador —
  registro/login → paciente crea cita → doctor confirma → paciente ve el estado.

### 4.4 Pruebas manuales

- **Humo (smoke)**: puesta en marcha local y con Docker, flujo principal de punta a punta.
- **Exploratorias**: búsqueda de casos no previstos en redirecciones de rutas y UX.

### 4.5 Pruebas de aceptación

- Verificación contra los criterios de salida (sección 8) antes de etiquetar una
  versión (`v*`).

## 5. Stack y herramientas

| Nivel | Herramienta | Comando |
|-------|-------------|---------|
| Unitarias / Integración (backend) | Vitest + Supertest | `cd backend && npm test` |
| Unitarias / Componentes (frontend) | Vitest + jsdom + @vue/test-utils | `cd frontend && npm test` |
| E2E (propuesto) | Playwright | `npx playwright test` |
| CI | GitHub Actions | push / PR a `main` → `.github/workflows/ci.yml` |
| Build | Vite | `cd frontend && npm run build` |

## 6. Matriz de casos de prueba

> Estado: **A** = cubierto por tests automatizados actuales · **P** = propuesto.
> Códigos: `2xx` éxito, `400` validación, `401` no autenticado, `403` rol no autorizado, `409` conflicto.

### 6.1 Autenticación

| ID | Caso | Entradas esperadas | Resultado esperado | Estado |
|----|------|--------------------|--------------------|--------|
| AUTH-01 | Registro de paciente válido | name, email, password, `role: patient` | `201`, devuelve token y usuario (sin `password_hash`) | A |
| AUTH-02 | Registro de médico con especialidad | `role: doctor` + specialty | `201` | A |
| AUTH-03 | Registro de médico sin especialidad | `role: doctor`, sin specialty | `400` con mensaje de error | A |
| AUTH-04 | Registro con email duplicado | email ya existente | `409` | A |
| AUTH-05 | Login con credenciales correctas | email + password válidos | `200`, devuelve token | A |
| AUTH-06 | Login con credenciales inválidas | password incorrecta | `401` | A |
| AUTH-07 | `GET /auth/me` con token válido | header `Authorization: Bearer <token>` | `200`, datos del usuario | A |
| AUTH-08 | `GET /auth/me` sin token | sin header | `401` | A |
| AUTH-09 | Registro con email/password incompletos | faltan campos obligatorios | `400` | A |
| AUTH-10 | Registro con rol no permitido | `role: admin` | `400` | A |
| AUTH-11 | Login con token JWT inválido | token alterado | `401` | A |
| AUTH-12 | Login con token vencido | `JWT_EXPIRES_IN` superado | `401` | A |

### 6.2 Médicos

| ID | Caso | Entradas esperadas | Resultado esperado | Estado |
|----|------|--------------------|--------------------|--------|
| DOC-01 | Listado de médicos autenticado | token de paciente | `200`, lista con `id`, `name`, `specialty` | A |
| DOC-02 | Listado de médicos sin token | sin header | `401` | A |
| DOC-03 | Los médicos demo existen tras el seed | login con usuario demo | 4 médicos con especialidades | A |

### 6.3 Citas

| ID | Caso | Entradas esperadas | Resultado esperado | Estado |
|----|------|--------------------|--------------------|--------|
| APP-01 | Paciente crea cita válida | doctorId, fecha ISO, hora, motivo | `201`, cita `pending` | A |
| APP-02 | Paciente ve sus citas | token de paciente | `200`, lista de citas en las que participa | A |
| APP-03 | Doctor ve citas pendientes | token de doctor | `200`, citas asignadas a él | A |
| APP-04 | Doctor confirma cita | token de doctor + `PATCH :id/confirm` | `200`, estado `confirmed` | A |
| APP-05 | Paciente ve estado confirmada | tras confirmación | `200`, estado `confirmed` | A |
| APP-06 | Paciente no puede confirmar citas | token de paciente | `403` | A |
| APP-07 | Cita con fecha en formato no válido | `date: "15/10/2026"` | `400` | A |
| APP-08 | Doctor no puede crear citas como paciente | token de doctor | `403` | A |
| APP-09 | Doctor rechaza cita | token de doctor + `PATCH :id/reject` | `200`, estado `rejected` | A |
| APP-10 | Paciente no puede rechazar citas | token de paciente | `403` | A |
| APP-11 | Cita sin doctorId | falta `doctorId` | `400` | A |
| APP-12 | Cita sin motivo | falta `reason` | `201` (motivo opcional) | A |
| APP-13 | Cita con doctor inexistente | `doctorId` no existe | `400` (validación de doctor) | A |
| APP-14 | Cita con fecha en el pasado | fecha anterior a hoy | `400` | A |
| APP-15 | Cita con hora inválida | `time: "25:00"` | `400` | A |
| APP-16 | Confirmar/rechazar cita inexistente | `:id` no encontrado | `404` | A |
| APP-17 | Confirmar cita ya confirmada | doble confirmación | `200` (confirmación idempotente) | A |
| APP-18 | Confirmar cita ajena (otro doctor) | cita de otro profesional | `404` (sin permisos) | A |
| APP-19 | Crear cita sin token | sin header | `401` | A |
| APP-20 | `GET /appointments/mine` sin token | sin header | `401` | A |

### 6.4 Frontend

| ID | Caso | Entradas esperadas | Resultado esperado | Estado |
|----|------|--------------------|--------------------|--------|
| FE-01 | Login guarda token y usuario en el store | resp. del API mockeada | `isAuthenticated`, token en `localStorage` | A |
| FE-02 | Store identifica rol doctor/patient | usuario `role` | `isDoctor` / `isPatient` correctos | A |
| FE-03 | Logout limpia estado y `localStorage` | cerrar sesión | estado reseteado, token eliminado | A |
| FE-04 | Redirección a `/login` sin autenticar | visitar `/dashboard` | redirige a login con `redirect` | A |
| FE-05 | Paciente no accede a `/dashboard/doctor` | guarda por rol | redirige a `/` | A |
| FE-06 | Usuario autenticado no accede a `/login` | visita con sesión | redirige a su dashboard | A |
| FE-07 | Guía IA accesible sin login | visitar `/guia-ia` | navega a la ruta pública | A |
| FE-08 | Flujo E2E completa | paciente crea → doctor confirma | estado visible en ambos dashboards | P |

## 7. Cobertura actual y brechas

**Cobertura automatizada existente:**

- Backend: **67 tests** — integración/API (`auth.test.js`, `appointments.test.js`,
  `doctors.test.js`) y unitarias (`validation.test.js`, `middleware.auth.test.js`,
  `user.service.test.js` con dobles de `bcrypt`/modelos).
- Frontend: **35 tests** — store (`auth.store.test.js`), router (`router.test.js`),
  componentes (`AppointmentCard.test.js`, `NavBar.test.js`), composable
  (`useAuth.test.js`) e interceptores Axios (`api.test.js`).

**Brechas restantes (casos marcados como P en la matriz):**

- Test E2E del flujo completo con Playwright (FE-08) en un navegador real.
- Pruebas de usabilidad y compatibilidad de navegadores (manual).

## 8. Criterios de entrada y salida

### Criterios de entrada para iniciar una iteración de pruebas

- El entorno objetivo (local / Docker / CI) levanta sin errores.
- La base de datos se inicializa con migraciones y seed de médicos demo.
- No hay defectos críticos abiertos de la iteración anterior.

### Criterios de salida (definición de "done")

- Todos los tests automatizados pasan en CI (`npm test` en `backend/` y
  `frontend/` + build de Vite).
- Los casos **A** de la matriz pasan en su totalidad.
- El flujo principal (paciente crea → doctor decide) funciona de extremo a extremo.
- No hay defectos de severidad **crítica** ni **mayor** abiertos.
- Las imágenes Docker se construyen correctamente.

## 9. Gestión de defectos

| Severidad | Definición | Ejemplo |
|-----------|------------|---------|
| **Crítica** | Bloquea el uso del sistema o compromete datos | Pérdida de citas, auth rota |
| **Mayor** | Funcionalidad principal no cumple su objetivo | Doctor no puede confirmar citas |
| **Menor** | Fallo cosmético o de bajo impacto | Mensaje de error mal redactado |
| **Cosmético** | Imperfecciones sin impacto funcional | Texto desalineado en una vista |

**Flujo de reporte:** cada defecto se documenta con pasos de reproducción,
resultado esperado vs. obtenido, evidencia y severidad. Los defectos
críticos/mayores bloquean el criterio de salida de la iteración.

## 10. Entornos y datos de prueba

| Entorno | Configuración | Uso |
|---------|---------------|-----|
| Local (backend) | Node 22, `.env` con `DB_FILE`, puerto 3001 | Desarrollo y pruebas manuales |
| Local (frontend) | Vite dev server, puerto 5173 | Pruebas manuales de UI |
| Tests | SQLite `:memory:` en `backend/tests/setup.js` | Aislamiento de datos de tests |
| Docker | `docker compose up --build` | Validación de contenedores |
| CI | GitHub Actions (Node 22) | Tests y build automáticos |

**Datos de prueba (médicos demo):** `ana.torres@medapp.com`, `luis.fernandez@medapp.com`,
`maria.lopez@medapp.com`, `carlos.mendoza@medapp.com` — contraseña **`doctor123`**.

## 11. Integración con CI/CD

- `.github/workflows/ci.yml`: ejecuta `npm test` (backend y frontend) y `npm run
  build` (frontend) en cada push/PR a `main`. **Un fallo bloquea el merge.**
- `.github/workflows/docker.yml`: publica imágenes en GHCR desde `main` y tags `v*`.
- Recomendado: añadir job de E2E con Playwright al pipeline.

## 12. Riesgos y mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| JWT en `localStorage` (demo) | Exposición a XSS en un entorno real | Documentado como nota; para producción usar cookies `httpOnly` + refresh tokens |
| SQLite embebido | Sin concurrencia/consistencia a escala | Adecuado para demo; migrar a PostgreSQL en producción |
| Cuerida de autorización por rol | Posible escalada de privilegios | Reforzar con tests negativos (`403`) en todos los endpoints |
| Dependencia de datos demo | Pruebas acopladas a usuarios fijos | Usar seed aislado y `:memory:` en tests |

## 13. Roles y responsabilidades

| Rol | Responsabilidad |
|-----|-----------------|
| Desarrollador | Ejecutar tests unitarios e integración antes de cada PR; mantener la matriz actualizada |
| QA / Tester | Pruebas manuales, exploratorias, reporte y verificación de defectos |
| DevOps | Mantener el pipeline CI y garantizar builds reproducibles |
| Revisor | Aplicar los criterios de salida antes de etiquetar versiones |