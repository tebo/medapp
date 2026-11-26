# Prompt 15 — Cancelar citas, anti-solape y filtro por estado

Prompt usado (o reutilizable) para el ciclo de features de agenda:

> En MedApp (Vue 3 + Express + SQLite + Vitest), implementa exactamente estas
> tres mejoras y nada más:
>
> 1. **Cancelar cita**: `PATCH /api/appointments/:id/cancel` solo para el paciente
>    dueño; solo si el estado es `pending` o `confirmed`. Devuelve 400 si el estado
>    no es cancelable, 404 si la cita no es suya.
> 2. **Anti-solapamiento**: al crear una cita, si el médico ya tiene otra `pending`
>    o `confirmed` en la misma fecha y hora, responde `409` con mensaje en español.
>    Tras cancelar, el horario queda libre.
> 3. **Filtro por estado** en los paneles de paciente y médico (componente
>    reutilizable). El paciente ve botón «Cancelar cita» en tarjetas cancelables.
>
> Añade tests backend y frontend, actualiza `docs/api.md` y el README. No cambies
> el esquema SQLite (el CHECK de `cancelled` ya existe).

## Archivos tocados (referencia)

- `backend/src/models/appointment.model.js`
- `backend/src/controllers/appointments.controller.js`
- `backend/src/routes/appointments.routes.js`
- `backend/tests/appointments.test.js`
- `frontend/src/components/AppointmentCard.vue`
- `frontend/src/components/StatusFilter.vue`
- `frontend/src/views/DashboardPatient.vue`
- `frontend/src/views/DashboardDoctor.vue`
- `frontend/tests/AppointmentCard.test.js`
- `frontend/tests/StatusFilter.test.js`
- `docs/api.md`, `docs/roadmap-features.md`
