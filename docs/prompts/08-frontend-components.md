# Prompt: Frontend — Componentes reutilizables

## Contexto

MedApp tiene componentes compartidos bajo la línea gráfica **«Oliva y miel»**
(tokens en `main.css`, tipografía Fraunces/Figtree, `BrandMark`).

## Tarea

### 1. BrandMark (`components/BrandMark.vue`)

- SVG de trazo tipo pulso/ECG dentro de un cuadrado con clase `.brand-mark`.
- Sin emojis. `aria-hidden="true"` cuando es decorativo.
- Reutilizar en NavBar, Home, Login y Register.

### 2. NavBar (`components/NavBar.vue`)

- Brand: `BrandMark` + wordmark "MedApp" (Fraunces), link a home.
- Link siempre visible: "Guía de IA" → `/guia-ia`.
- **Si autenticado:**
  - "Mi panel" → dashboard según rol.
  - Saludo: "Hola, {nombre}".
  - Botón "Salir" que llama `logout()`.
- **Si anónimo:**
  - "Entrar" → `/login`.
  - "Registrarse" → `/register`.
- Estilo: barra sticky café cálido, contraste claro; no navbar azul genérica.

### 3. AppointmentCard (`components/AppointmentCard.vue`)

**Props:**
- `appointment`: objeto con la cita (incluye `patient_name`, `doctor_name`, `doctor_specialty`).
- `showActions`: boolean, default `false`.
- `showCancel`: boolean, default `false`.

**Emits:**
- `confirm` — al hacer clic en "Confirmar".
- `reject` — al hacer clic en "Rechazar".
- `cancel` — al hacer clic en "Cancelar cita".

**Contenido:**
- Badge con estado traducido al español:
  - `pending` → "Pendiente"
  - `confirmed` → "Confirmada"
  - `rejected` → "Rechazada"
  - `cancelled` → "Cancelada"
- Formatear fecha: `YYYY-MM-DD` → `DD/MM/YYYY`.
- Mostrar: médico (nombre + especialidad), paciente, motivo (si existe).
- Borde izquierdo coloreado según estado (tokens de la línea gráfica).
- Botones Confirmar/Rechazar solo si `showActions && status === 'pending'`.
- Botón Cancelar si `showCancel` y estado `pending` o `confirmed`.
- Sin emojis de calendario/reloj.

### 4. AppointmentForm (`components/AppointmentForm.vue`)

**Emits:**
- `created` — después de crear una cita exitosamente.

**Comportamiento:**
- Al montar, cargar lista de médicos (`GET /doctors`).
- Formulario reactivo: `doctorId`, `date`, `time`, `reason` (opcional).
- Validación: doctorId, date y time son requeridos.
- Al enviar: POST `/appointments` con los datos.
- Emitir `created` en éxito.
- Mostrar error del servidor si falla (incluye `409` por solape).
- Estado de carga durante submit.
- Select de médicos mostrando: "Dr. Nombre — Especialidad".

### 5. StatusFilter (`components/StatusFilter.vue`)

- `v-model` con valores `all | pending | confirmed | rejected | cancelled`.
- Chips con radio suave (no `border-radius: 999px`).
- Prop opcional `options` para personalizar (p. ej. historial del médico).

### Archivos a crear

```
frontend/src/components/
├── BrandMark.vue
├── NavBar.vue
├── AppointmentCard.vue
├── AppointmentForm.vue
└── StatusFilter.vue
```

### Estilos

Usar tokens y clases de `main.css` (Oliva y miel):
- `.card`, `.btn`, `.btn-outline`, `.btn-success`, `.btn-danger`
- `.form-group`, `.form-control`
- `.badge`, `.badge-pending`, `.badge-confirmed`, `.badge-rejected`, `.badge-cancelled`
- `.container`, `.grid-2`, `.brand-mark`, `--font-display`, `--accent-line`
