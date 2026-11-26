# API de Citas Médicas — MedApp

Backend: **Node.js + Express + better-sqlite3**. Base URL: `http://localhost:3001/api`.

## Autenticación

Todas las rutas excepto `register`, `login` y `health` requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene de `register` o `login`.

## Endpoints

### Salud

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Comprobación de que la API está viva |

### Autenticación

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/auth/register` | Público | Registra paciente o médico |
| POST | `/auth/login` | Público | Inicia sesión y devuelve JWT |
| GET | `/auth/me` | Autenticado | Datos del usuario actual |

#### POST `/auth/register`

```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "password": "secreto123",
  "role": "patient"
}
```

Para médicos, `role: "doctor"` y `specialty` obligatoria.

Respuesta `201`:

```json
{
  "token": "<jwt>",
  "user": { "id": 1, "name": "Juan Pérez", "email": "juan@email.com", "role": "patient", "specialty": null }
}
```

Errores: `400` (validación), `409` (email duplicado).

#### POST `/auth/login`

```json
{ "email": "juan@email.com", "password": "secreto123" }
```

Respuesta `200`: igual que register. Error `401` si credenciales inválidas.

### Médicos

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/doctors` | Autenticado | Lista de médicos (`id`, `name`, `specialty`) |

### Citas

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/appointments` | patient | Crear cita |
| GET | `/appointments/mine` | Autenticado | Citas donde el usuario participa |
| GET | `/appointments/pending` | doctor | Solicitudes pendientes del doctor |
| PATCH | `/appointments/:id/confirm` | doctor | Confirmar cita |
| PATCH | `/appointments/:id/reject` | doctor | Rechazar cita |
| PATCH | `/appointments/:id/cancel` | patient | Cancelar cita propia (`pending` o `confirmed`) |

#### POST `/appointments`

```json
{ "doctorId": 2, "date": "2026-10-15", "time": "10:30", "reason": "Dolor de cabeza" }
```

Respuesta `201`:

```json
{
  "appointment": {
    "id": 1, "patient_id": 1, "doctor_id": 2,
    "date": "2026-10-15", "time": "10:30",
    "reason": "Dolor de cabeza", "status": "pending",
    "patient_name": "Juan Pérez", "doctor_name": "Dra. Ana Torres",
    "doctor_specialty": "Medicina General"
  }
}
```

Validaciones: `date` obligatoria con formato `YYYY-MM-DD` y **no anterior a hoy**;
`time` obligatoria con formato `HH:MM`. Errores: `400` si faltan campos, el formato
es inválido, la fecha es pasada o el doctor no existe. Error `409` si el médico ya
tiene una cita `pending` o `confirmed` en la misma fecha y hora.

#### PATCH `/appointments/:id/cancel`

Solo el paciente dueño de la cita. Solo si el estado es `pending` o `confirmed`.

Respuesta `200`:

```json
{ "appointment": { "...": "...", "status": "cancelled" }, "message": "Cita cancelada" }
```

Errores: `400` (estado no cancelable), `403` (rol distinto de patient), `404` (cita
ajena o inexistente).

#### Estados de una cita

`pending` → `confirmed` | `rejected` | `cancelled`  
`confirmed` → `cancelled`

- `pending`: creada por el paciente, esperando respuesta.
- `confirmed`: aceptada por el médico.
- `rejected`: rechazada por el médico.
- `cancelled`: cancelada por el paciente (libera el horario del médico).

### Ejemplo rápido con curl

```bash
# Login con un médico demo
curl -s -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ana.torres@medapp.com","password":"doctor123"}'
```