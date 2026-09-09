# Prompt: Backend — CRUD de Citas Médicas

## Contexto

MedApp gestiona citas médicas con el flujo:
- El **paciente** crea una cita → estado `pending`.
- El **médico** confirma o rechaza → estado `confirmed` o `rejected`.
- (Futuro) El paciente puede cancelar → estado `cancelled`.

## Tarea

### 1. Rutas (`routes/appointments.routes.js`)

Todas las rutas requieren `authenticate`:

```
POST   /api/appointments              → createAppointment  (solo patient)
GET    /api/appointments/mine          → listMyAppointments  (cualquier autenticado)
GET    /api/appointments/pending       → listPending         (solo doctor)
PATCH  /api/appointments/:id/confirm   → confirm             (solo doctor)
PATCH  /api/appointments/:id/reject    → reject              (solo doctor)
```

### 2. Controller (`controllers/appointments.controller.js`)

**`createAppointment(req, res, next)`:**
- Validar que `doctorId`, `date` y `time` estén presentes.
- Validar formato de `date`: regex `^\d{4}-\d{2}-\d{2}$` y que sea una fecha real.
- Validar formato de `time`: regex `^\d{2}:\d{2}$`.
- Verificar que el doctor exista y tenga `role = 'doctor'`.
- Crear la cita con `patient_id = req.user.id`.
- Retornar 201 `{ appointment }` con nombres del paciente y doctor.
- Errores: 400 si faltan campos o formatos inválidos; 404 si el doctor no existe.

**`listMyAppointments(req, res, next)`:**
- Obtener todas las citas del usuario actual (`req.user.id`).
- Retornar 200 `{ appointments }`.

**`listPending(req, res, next)`:**
- Obtener todas las citas pendientes.
- Filtrar en JS que `appointment.doctor_id === req.user.id` (solo las asignadas al médico actual).
- Retornar 200 `{ appointments }`.

**`updateStatus(status)` (factory function):**
- Retorna una función `(req, res, next)`.
- Intentar actualizar el status de la cita (`req.params.id`) con el usuario actual.
- Si `setStatus` retorna `null` → 404 `{ error: 'Cita no encontrada o sin permisos' }`.
- Si tiene éxito → 200 `{ appointment, message }`.
- Los mensajes: `confirmed` → `'Cita confirmada'`, `rejected` → `'Cita rechazada'`.

**`confirm` = `updateStatus('confirmed')`**
**`reject` = `updateStatus('rejected')`**

### 3. Validaciones

| Campo | Formato | Ejemplo |
|-------|---------|---------|
| `doctorId` | integer, required | `1` |
| `date` | `YYYY-MM-DD`, fecha real | `2024-03-15` |
| `time` | `HH:MM` | `14:30` |
| `reason` | string, optional | `"Dolor de cabeza"` |

### Archivos a crear

```
backend/src/routes/appointments.routes.js
backend/src/controllers/appointments.controller.js
```

### Ejemplo de flujo completo

```bash
# 1. Login como paciente
TOKEN_PATIENT=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"123456"}' | jq -r '.token')

# 2. Crear cita
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_PATIENT" \
  -d '{"doctorId":1,"date":"2024-03-15","time":"14:30","reason":"Dolor de cabeza"}'

# 3. Login como médico
TOKEN_DOCTOR=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana.torres@medapp.com","password":"doctor123"}' | jq -r '.token')

# 4. Ver citas pendientes
curl http://localhost:3001/api/appointments/pending \
  -H "Authorization: Bearer $TOKEN_DOCTOR"

# 5. Confirmar cita
curl -X PATCH http://localhost:3001/api/appointments/1/confirm \
  -H "Authorization: Bearer $TOKEN_DOCTOR"
```
