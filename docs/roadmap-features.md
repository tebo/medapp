# Roadmap / lluvia de ideas — MedApp (clases + IA)

Catálogo para que los alumnos vean el **proceso de desarrollo asistido por IA**:
prompt → revisión → tests → PR. Cada idea indica capas y conceptos de SE.

## Ya en el producto

| Feature | Capas | Conceptos |
|---------|-------|-----------|
| Auth patient/doctor + JWT | Full-stack | Roles, bcrypt, middleware |
| Crear / confirmar / rechazar citas | Full-stack | Flujo happy-path |
| Cancelar citas (paciente) | API + UI + tests | Máquina de estados |
| Anti-solapamiento | API + tests | Regla de negocio, HTTP 409 |
| Filtro por estado | UI + tests | Componente reutilizable |
| Guía de IA in-app | Frontend + docs | Producto educativo |
| Línea gráfica Oliva y miel | Frontend + docs/prompts | Design system ligero |

---

## Lluvia de ideas por tema

### A · Dominio médico (producto)

| # | Idea | Por qué en clase |
|---|------|------------------|
| A1 | Motivo de rechazo del médico | Migración + feedback al paciente |
| A2 | Notas privadas del médico | Visibilidad por rol / datos sensibles |
| A3 | Reprogramar cita | PATCH parcial + conflictos de agenda |
| A4 | Horarios / slots del médico | Modelado de disponibilidad |
| A5 | Duración de cita (15/30/60 min) | Reglas + solapes por intervalo |
| A6 | Lista de espera si el slot está lleno | Colas, estados nuevos |
| A7 | Recordatorio “próxima cita” en el panel | Fechas en cliente, UX |
| A8 | Valoración post-cita (1–5 + comentario) | Nuevo recurso, solo confirmed pasadas |
| A9 | Receta / indicaciones simples al confirmar | Documento clínico mínimo |
| A10 | Especialidades como catálogo (tabla) | Normalización vs texto libre |

### B · UX y frontend

| # | Idea | Por qué en clase |
|---|------|------------------|
| B1 | Buscar / filtrar médicos por especialidad | Query params + UI |
| B2 | Modo oscuro respetando Oliva y miel | Tokens, theming |
| B3 | Empty states ilustrados | Copy + componentes |
| B4 | Skeleton loaders en paneles | Percepción de performance |
| B5 | Confirmación modal al cancelar/rechazar | Accesibilidad, focus trap simple |
| B6 | i18n ES/EN | i18n, claves, no hardcode |
| B7 | Página 404 / error boundary | Resiliencia UI |
| B8 | Onboarding de 3 pasos la primera vez | Estado local, progressive disclosure |

### C · Calidad, seguridad y arquitectura

| # | Idea | Por qué en clase |
|---|------|------------------|
| C1 | Rate limit en login | Seguridad básica |
| C2 | Refresh tokens | Sesiones, rotación |
| C3 | Soft-delete de usuarios | Integridad referencial |
| C4 | Paginación + ordenación de citas | Escalabilidad API |
| C5 | Auditoría `appointment_events` | Trazabilidad / event log |
| C6 | Validación con schema (Zod/Joi) | Contratos explícitos |
| C7 | OpenAPI generado o a mano | Contrato API como artefacto |
| C8 | Feature flags simples en `.env` | Toggle de demos en clase |

### D · Colaboración y DevOps (muy didáctico)

| # | Idea | Por qué en clase |
|---|------|------------------|
| D1 | Seed de pacientes demo + citas de ejemplo | Datos para demos en vivo |
| D2 | Storybook (o páginas de laboratorio) de componentes | Design system en práctica |
| D3 | E2E con Playwright (login → cita → confirm) | Pirámide de tests |
| D4 | Lighthouse / a11y check en CI | Calidad continua |
| D5 | Changelog automático por PR | Comunicación de cambios |
| D6 | Ambiente “demo reset” (endpoint admin) | Operaciones |

### E · Extras “wow” para demo (opcionales)

| # | Idea | Por qué en clase |
|---|------|------------------|
| E1 | Export CSV / iCal | Formatos y descarga |
| E2 | Notificaciones in-app (campana) | Nuevo bounded context |
| E3 | Admin + métricas (citas/día, por especialidad) | Agregaciones SQL |
| E4 | Chat paciente–médico por cita | Tiempo real o polling |
| E5 | Adjuntar PDF de estudios (mock local) | Uploads, límites, MIME |
| E6 | Vista calendario semanal del médico | Complejidad UI + datos |

---

## Packs sugeridos para una sesión de clase

Elige **un pack** (≈ una feature cohesiva), no toda la lluvia:

1. **Feedback clínico** — A1 motivo de rechazo (+ mostrar al paciente).
2. **Agenda real** — A4 slots + B1 filtro especialidad.
3. **Ciclo de vida completo** — A3 reprogramar (+ tests de conflicto).
4. **Calidad visible** — D1 seed rico + D3 un E2E Playwright.
5. **Observabilidad de dominio** — C5 auditoría de estados + UI “historial de eventos”.
6. **Producto admin** — E3 métricas + rol `admin`.

## Cómo usarlo en clase

1. Elige **una** idea (o un pack).
2. Prompt acotado (`docs/prompts/` + guía `/guia-ia`).
3. Revisa el diff: capas, tests, docs.
4. `npm test` en backend y frontend.
5. PR y discusión de trade-offs.

Plantilla:

> «En MedApp (Vue 3 + Express + SQLite), implementa solo `<feature>`.
> Respeta roles JWT, añade tests Vitest/Supertest y actualiza `docs/api.md`.
> Si tocas UI, mantén Oliva y miel (`docs/linea-grafica.md`).
> No refactorices lo que no haga falta.»
