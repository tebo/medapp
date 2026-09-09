# Prompt: Frontend — Componentes reutilizables

## Contexto

MedApp tiene 3 componentes compartidos: NavBar, AppointmentCard y
AppointmentForm.

## Tarea

### 1. NavBar (`components/NavBar.vue`)

- Brand: "MedApp" con icono, link a home.
- Link siempre visible: "Guía de IA" → `/guia-ia`.
- **Si autenticado:**
  - "Mi panel" → dashboard según rol.
  - Saludo: "Hola, {nombre}".
  - Botón "Salir" que llama `logout()`.
- **Si anónimo:**
  - "Entrar" → `/login`.
  - "Registrarse" → `/register`.
- Responsive: hamburger menu en móvil.

### 2. AppointmentCard (`components/AppointmentCard.vue`)

**Props:**
- `appointment`: objeto con la cita (incluye `patient_name`, `doctor_name`, `doctor_specialty`).
- `showActions`: boolean, default `false`.

**Emits:**
- `confirm` — al hacer clic en "Confirmar".
- `reject` — al hacer clic en "Rechazar".

**Contenido:**
- Badge con estado traducido al español:
  - `pending` → "Pendiente" (amarillo)
  - `confirmed` → "Confirmada" (verde)
  - `rejected` → "Rechazada" (rojo)
  - `cancelled` → "Cancelada" (gris)
- Formatear fecha: `YYYY-MM-DD` → `DD/MM/YYYY`.
- Mostrar: médico (nombre + especialidad), paciente, motivo (si existe).
- Botones "Confirmar" y "Rechazar" solo si `showActions && status === 'pending'`.

### 3. AppointmentForm (`components/AppointmentForm.vue`)

**Emits:**
- `created` — después de crear una cita exitosamente.

**Comportamiento:**
- Al montar, cargar lista de médicos (`GET /doctors`).
- Formulario reactivo: `doctorId`, `date`, `time`, `reason` (opcional).
- Validación: doctorId, date y time son requeridos.
- Al enviar: POST `/appointments` con los datos.
- Emitir `created` en éxito.
- Mostrar error del servidor si falla.
- Estado de carga durante submit.
- Select de médicos mostrando: "Dr. Nombre — Especialidad".

### Archivos a crear

```
frontend/src/components/
├── NavBar.vue
├── AppointmentCard.vue
└── AppointmentForm.vue
```

### Estilos

Usar las clases CSS ya definidas en `main.css`:
- `.card`, `.btn`, `.btn-outline`, `.btn-success`, `.btn-danger`
- `.form-group`, `.form-control`
- `.badge`, `.badge-pending`, `.badge-confirmed`, `.badge-rejected`
- `.container`, `.grid-2`
