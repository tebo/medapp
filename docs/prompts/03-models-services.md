# Prompt: Backend — Models y Services (acceso a datos)

## Contexto

MedApp tiene 2 tablas: `users` y `appointments`. Necesitamos una capa de
modelos con prepared statements y una capa de servicios para la lógica de
negocio (hashing de contraseñas).

## Tarea

### 1. User Model (`models/user.model.js`)

Crear prepared statements y funciones:

- `findByEmail(email)` → retorna el usuario completo o `undefined`.
- `findById(id)` → retorna el usuario completo o `undefined`.
- `createUser({ name, email, password_hash, role, specialty })` → inserta y retorna el usuario creado (sin password_hash en el retorno).
- `listDoctors()` → retorna `[{ id, name, specialty }]` donde `role = 'doctor'`, ordenado por `name`.

Usar prepared statements con `db.prepare()`.

### 2. Appointment Model (`models/appointment.model.js`)

Crear prepared statements y funciones:

- `createAppointment({ patient_id, doctor_id, date, time, reason })` → inserta y retorna la cita creada con nombres del paciente y médico (JOIN).
- `getById(id)` → retorna la cita con `patient_name`, `doctor_name`, `doctor_specialty` (JOINs con users).
- `listPending()` → retorna todas las citas con `status = 'pending'`, con nombres, ordenadas por `date ASC, time ASC`.
- `listForUser(userId)` → retorna citas donde `patient_id = userId OR doctor_id = userId`, con nombres, ordenadas por `date DESC, time DESC`.
- `setStatus(id, userId, status)` → actualiza el status de una cita. La cita solo se actualiza si el `userId` coincide con `patient_id` o `doctor_id`. Retorna la cita actualizada o `null` si no se encontró / no tiene permisos.

### 3. User Service (`services/user.service.js`)

- `createUser(userData)` → hashea la contraseña con `bcryptjs` (cost 10) antes de pasar al modelo.
- `findByEmail(email)` → delega al modelo.
- `findById(id)` → delega al modelo.
- `listDoctors()` → delega al modelo.

### Notas

- Usar `require` (CommonJS).
- Los models reciben `db` como parámetro (no importan el singleton).
- El `db` se inyecta desde `db/index.js` a los controllers.
- No crear service para appointments (acceso directo al modelo desde controllers).
- Los JOINs en appointments deben incluir: `users AS patient` (por `patient_id`) y `users AS doctor` (por `doctor_id`).
- El SELECT de appointments debe retornar: `a.*, patient.name AS patient_name, doctor.name AS doctor_name, doctor.specialty AS doctor_specialty`.

### Archivos a crear

```
backend/src/models/
├── user.model.js
└── appointment.model.js
backend/src/services/
└── user.service.js
```
