# Prompt: Frontend — Vistas principales (Dashboards)

## Contexto

MedApp tiene 3 vistas principales: Home, Dashboard del paciente y Dashboard
del médico. Cada una muestra información diferente según el rol.

## Tarea

### 1. HomeView (`views/HomeView.vue`)

- **Hero section**: título "MedApp", subtítulo sobre citas médicas + guía de IA.
- **2 cards de features** (grid-2):
  - "Solicitar cita": descripción + CTA (link a registro o dashboard paciente según auth).
  - "Confirmar cita": descripción + CTA (link a registro o dashboard médico según auth).
- **Card de credenciales demo**: listar los 4 médicos demo con email y contraseña `doctor123`.
- Usar clases `.card`, `.btn`, `.btn-outline`, `.grid-2`, `.container`.

### 2. DashboardPatient (`views/DashboardPatient.vue`)

**Al montar:**
- Cargar citas del paciente (`GET /appointments/mine`).
- Loading state con spinner/mensaje.

**Layout:**
- Título: "Mi Panel — Solicitar Cita".
- `AppointmentForm` arriba.
- Lista de `AppointmentCard` abajo (sin `showActions`).
- Estados: loading, error, empty ("No tienes citas aún").

**Manejo de eventos:**
- Al recibir evento `created` del form → recargar la lista de citas.

### 3. DashboardDoctor (`views/DashboardDoctor.vue`)

**Al montar:**
- Cargar en paralelo:
  - `GET /appointments/pending` (citas pendientes).
  - `GET /appointments/mine` (todas las citas del médico, para historial).

**Estadísticas:**
- Contadores calculados: pendientes, confirmadas, rechazadas.
- Mostrar en badges/cards resumen.

**Layout:**
- Título: "Panel del Médico".
- Sección "Citas Pendientes" con `AppointmentCard` (con `showActions`).
- Sección "Historial de Decisiones" con `AppointmentCard` (sin actions).

**Manejo de eventos:**
- Confirmar: `PATCH /appointments/:id/confirm`.
- Rechazar: `PATCH /appointments/:id/reject`.
- Después de cada acción → recargar ambas listas.

### Archivos a crear

```
frontend/src/views/
├── HomeView.vue
├── DashboardPatient.vue
└── DashboardDoctor.vue
```
