# Prompt 17 — Capas limpias + use case Cancel (pack arquitectura #1)

> En MedApp (Express + SQLite), aplica el pack **Capas limpias (F1 + F3)** sin
> cambiar el contrato HTTP externo:
>
> 1. Crea `backend/src/application/errors.js` con `AppError` (message, status, code).
> 2. Mueve la lógica de citas fuera del controller a use cases en
>    `backend/src/application/appointments/`:
>    - `createAppointment.js` (incluye anti-solape → 409)
>    - `cancelAppointment.js` (un archivo = un caso de uso)
>    - `updateAppointmentStatus.js` (confirm/reject)
>    - `listAppointments.js`
> 3. Deja `appointments.controller.js` delgado: lee `req` → llama use case →
>    mapea `AppError` a JSON.
> 4. Añade tests unitarios de use case (con mocks del model) que fallen si alguien
>    vuelve a poner la regla de solape/cancel solo en el controller.
> 5. No introduzcas ORM ni reescribas auth. Actualiza `docs/roadmap-features.md`
>    marcando el pack como hecho y este prompt en el overview.
>
> Explica en el PR: qué quedó en HTTP vs application vs model.

## Archivos de referencia

- `backend/src/application/**`
- `backend/src/controllers/appointments.controller.js`
- `backend/tests/cancelAppointment.usecase.test.js`
- `backend/tests/createAppointment.usecase.test.js`
