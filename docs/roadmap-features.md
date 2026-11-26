# Roadmap / lluvia de ideas — MedApp (clases + IA)

Catálogo para que los alumnos vean el **proceso de desarrollo asistido por IA**:
prompt → revisión → tests → PR. Cada idea indica capas, conceptos de SE y, cuando
aplica, **patrones de arquitectura**.

## Ya en el producto

| Feature | Capas | Conceptos / patrones |
|---------|-------|----------------------|
| Auth patient/doctor + JWT | Full-stack | Roles, bcrypt, **middleware pipeline** |
| Capas Express (routes → controllers → services → models) | Backend | **Layered architecture** |
| Crear / confirmar / rechazar / cancelar citas | Full-stack | **State machine** de dominio |
| Anti-solapamiento | API + tests | Regla de negocio, HTTP 409 |
| Filtro por estado | UI + tests | Componente reutilizable |
| Store Pinia + router guards | Frontend | **Flux-like store**, **front controller** (router) |
| Guía de IA in-app | Frontend + docs | Producto educativo |
| Línea gráfica Oliva y miel | Frontend + docs/prompts | Design tokens / design system ligero |

### Mapa rápido: patrones que ya se pueden señalar en clase

```text
Cliente (Vue)                API (Express)                 Datos
─────────────                ─────────────                 ─────
Views / Components    →      Routes (front door)     →
Composables / Store   →      Controllers             →
services/api (Gateway)→      Services (use cases)    →     Models (SQL)
Router guards                Middleware (auth/RBAC)        SQLite
```

Patrones visibles hoy: **Layered**, **MVC-ish (API)**, **Middleware**,
**Repository-ish (models)**, **Client Gateway (Axios)**, **Guard/Proxy (router)**,
**State machine (status de cita)**.

---

## Lluvia de ideas por tema

### A · Dominio médico (producto)

| # | Idea | Por qué en clase | Patrones |
|---|------|------------------|----------|
| A1 | Motivo de rechazo del médico | Migración + feedback | DTO / contrato API |
| A2 | Notas privadas del médico | Datos por rol | Authorization + information hiding |
| A3 | Reprogramar cita | PATCH + conflictos | State machine + domain rule |
| A4 | Horarios / slots del médico | Disponibilidad | Aggregate (agenda del médico) |
| A5 | Duración 15/30/60 min | Solapes por intervalo | Value Object (TimeRange) |
| A6 | Lista de espera | Nuevos estados | Queue / waitlist |
| A7 | Banner “próxima cita” | UX fechas | Read model / projection simple |
| A8 | Valoración post-cita | Nuevo recurso | Aggregate root (Appointment) |
| A9 | Indicaciones al confirmar | Doc clínico mínimo | Document + ownership |
| A10 | Especialidades como catálogo | Normalización | Lookup / reference data |

### B · UX y frontend

| # | Idea | Por qué en clase | Patrones |
|---|------|------------------|----------|
| B1 | Filtro médicos por especialidad | Query params | Filter / Specification (UI) |
| B2 | Modo oscuro Oliva y miel | Theming | Strategy (tema) + tokens |
| B3 | Empty states | Copy + UI | Presentational component |
| B4 | Skeleton loaders | Perceived perf | Progressive rendering |
| B5 | Modal confirmar cancelar | A11y | Dialog / Command confirm |
| B6 | i18n ES/EN | Claves | Resource bundle |
| B7 | 404 / error boundary | Resiliencia | Circuit / fallback UI |
| B8 | Onboarding 3 pasos | Progressive disclosure | Wizard / State |

### C · Calidad, seguridad y arquitectura de software

| # | Idea | Por qué en clase | Patrones |
|---|------|------------------|----------|
| C1 | Rate limit en login | Seguridad | Throttling / Gatekeeper |
| C2 | Refresh tokens | Sesiones | Token pair / rotating secrets |
| C3 | Soft-delete usuarios | Integridad | Soft delete / tombstone |
| C4 | Paginación + ordenación | Escalabilidad | Cursor/offset pagination |
| C5 | Auditoría `appointment_events` | Trazabilidad | Event sourcing (ligero) / Audit log |
| C6 | Validación Zod/Joi | Contratos | Schema validation / Anti-corruption |
| C7 | OpenAPI | Artefacto de contrato | Contract-first API |
| C8 | Feature flags en `.env` | Demos toggle | Feature toggle |
| C9 | Casos de uso en `/application` | Separar HTTP de dominio | Hexagonal / Ports & Adapters (inicio) |
| C10 | Interfaces de repositorio | Swappable persistence | Repository + DI |
| C11 | Domain events al cambiar status | Desacoplar side-effects | Domain Events / Observer |
| C12 | CQRS ligero (commands vs queries) | Lecturas vs escrituras | CQRS (versión pedagógica) |
| C13 | BFF opcional para el panel | Agregar datos para UI | Backend for Frontend |
| C14 | Modularizar por bounded context | auth / scheduling / catalog | Modular monolith |

### D · Colaboración y DevOps

| # | Idea | Por qué en clase | Patrones |
|---|------|------------------|----------|
| D1 | Seed rico de demos | Datos en vivo | Fixture / Test Data Builder |
| D2 | Storybook / lab de componentes | Design system | Component catalog |
| D3 | E2E Playwright | Pirámide de tests | Black-box / journey test |
| D4 | A11y en CI | Calidad continua | Quality gate |
| D5 | Changelog por PR | Comunicación | Release notes pipeline |
| D6 | Demo reset admin | Operaciones | Admin capability / kill switch |

### E · Extras “wow”

| # | Idea | Por qué en clase | Patrones |
|---|------|------------------|----------|
| E1 | Export CSV / iCal | Formatos | Adapter (export) |
| E2 | Notificaciones in-app | Nuevo contexto | Pub/Sub o polling Observer |
| E3 | Admin + métricas | Agregaciones | Read model / reporting |
| E4 | Chat por cita | Tiempo real | Messaging channel |
| E5 | Adjuntos PDF | Uploads | Object storage adapter (local) |
| E6 | Calendario semanal | UI compleja | Calendar view / projection |

### F · Patrones de arquitectura (sesiones explícitas)

Pensadas para **enseñar el patrón** con un cambio acotado en MedApp (no reescribir todo).

| # | Patrón | Ejercicio concreto en MedApp | Resultado esperable |
|---|--------|------------------------------|---------------------|
| F1 | **Layered (reforzar)** | Extraer reglas de solape del controller a `services/` + tests | Capas claras, controller delgado |
| F2 | **Repository** | Interfaz `AppointmentRepository` + impl SQLite | Persistencia sustituible en tests |
| F3 | **Use Case / Application Service** | `CancelAppointment`, `ConfirmAppointment` como clases/funciones | Un caso de uso = un archivo testeable |
| F4 | **Hexagonal (puertos)** | Puerto `Clock` / `IdGenerator` inyectable | Tests sin `Date` global frágil |
| F5 | **Domain Events** | Emitir `AppointmentCancelled` → log o notificación | Side-effects fuera del use case |
| F6 | **State Machine explícita** | Tabla de transiciones válidas + guardas | 400 si transición ilegal (rechazada→confirmada) |
| F7 | **CQRS ligero** | Commands `POST/PATCH` vs queries `GET` en módulos separados | Lecturas no mezcladas con escrituras |
| F8 | **DTO + Mapper** | No filtrar `password_hash` a mano en cada sitio | Contrato de salida estable |
| F9 | **Middleware pipeline** | Rate limit + audit logger + auth ordenados | Cross-cutting concerns |
| F10 | **Modular monolith** | Carpetas `modules/auth`, `modules/scheduling` | Límites de contexto sin microservicios |
| F11 | **API Gateway / BFF** | Endpoint `GET /me/dashboard` que agrega stats+citas | Menos chatty UI |
| F12 | **Strategy** | Políticas de solape (strict vs allow-override admin) | Variantes de regla sin `if` eternos |
| F13 | **Factory / Builder** | Test data builders para citas en Vitest | Tests legibles |
| F14 | **Observer (frontend)** | Store emite cambios → toasts/banner | UI reactiva desacoplada |
| F15 | **Clean Architecture (slice)** | Un solo flujo (cancel) con entities → use cases → adapters | Discutir costo vs beneficio en demo |

Diagrama pedagógico sugerido (hexagonal mínimo):

```text
                    ┌─────────────────────┐
   HTTP (Express) ─►│  adapters inbound   │
                    └─────────┬───────────┘
                              ▼
                    ┌─────────────────────┐
                    │  application        │
                    │  (use cases)        │
                    └─────────┬───────────┘
                              ▼
                    ┌─────────────────────┐
                    │  domain             │
                    │  (Appointment,      │
                    │   transitions)      │
                    └─────────┬───────────┘
                              ▼
                    ┌─────────────────────┐
   SQLite / Clock ◄─│  adapters outbound  │
                    └─────────────────────┘
```

---

## Packs sugeridos para una sesión de clase

### Producto
1. **Feedback clínico** — A1 motivo de rechazo.
2. **Agenda real** — A4 slots + B1 especialidad.
3. **Ciclo de vida** — A3 reprogramar (+ conflictos).

### Calidad / demo
4. **Calidad visible** — D1 seed + D3 E2E.
5. **Observabilidad** — C5 auditoría + UI historial.
6. **Admin** — E3 métricas + rol `admin`.

### Arquitectura
7. **Capas limpias** — F1 + F3 (controller delgado + use case Cancel). ✅ `application/appointments` + prompt 17.
8. **Máquina de estados** — F6 (transiciones explícitas + tests de ilegales).
9. **Hexagonal en miniatura** — F4 Clock + F2 Repository solo en citas.
10. **Eventos de dominio** — F5 `AppointmentCancelled` → notificación in-app (E2 light).
11. **Modular monolith** — F10 mover auth/scheduling a `modules/*` sin cambiar comportamiento (refactor PR).
12. **CQRS pedagógico** — F7 separar commands/queries de appointments.

## Cómo usarlo en clase

1. Elige **una** idea o **un pack** (producto **o** patrón, no ambos a la vez si el tiempo es corto).
2. Prompt acotado (`docs/prompts/` + guía `/guia-ia`).
3. Si es pack de arquitectura: pide a la IA **primero el diseño en 10 líneas**, luego el código.
4. Revisa el diff: ¿el patrón se ve o solo se renombraron carpetas?
5. `npm test` + PR + discusión de trade-offs (complejidad vs claridad).

Plantilla producto:

> «En MedApp (Vue 3 + Express + SQLite), implementa solo `<feature>`.
> Respeta roles JWT, añade tests y actualiza `docs/api.md`.
> Si tocas UI, mantén Oliva y miel (`docs/linea-grafica.md`).»

Plantilla arquitectura:

> «En MedApp, aplica el patrón `<patrón>` solo al flujo de `<caso>` (p. ej. cancelar cita).
> No conviertas todo el repo. Explica en el PR: qué puerto/adaptador/capa añadiste,
> qué trade-off aceptas, y deja tests que fallen si alguien salta la capa.
> Mantén la API HTTP externa estable salvo que el pack lo pida.»
