# Prompt: Frontend — Vistas principales (Dashboards)

## Contexto

MedApp tiene vistas principales bajo la línea gráfica **«Oliva y miel»**.
La Home debe pasar el *brand test*: sin el nav, MedApp sigue siendo el
protagonista visual del primer viewport.

## Tarea

### 1. HomeView (`views/HomeView.vue`)

- **Hero a sangre** (no card inset):
  - BrandMark + wordmark **MedApp** a tamaño hero.
  - Un headline.
  - Un párrafo corto de apoyo.
  - Un grupo de CTAs (registro / panel / guía según auth).
  - Gradiente oliva → miel + trazo tipo ECG de fondo.
- **Debajo del fold** (no en el primer viewport):
  - Bloques Paciente / Médico (sin cards decorativas; CTA outline).
  - Credenciales demo (4 médicos, password `doctor123`).
- Evitar stats, chips y promos en el hero.

### 2. LoginView / RegisterView

- Incluir BrandMark + wordmark arriba del formulario.
- Register: selector de rol Paciente/Médico **sin emojis**.
- Usar tokens de superficie/borde de la línea gráfica.

### 3. DashboardPatient (`views/DashboardPatient.vue`)

**Al montar:**
- Cargar citas del paciente (`GET /appointments/mine`).
- Loading state con mensaje.

**Layout:**
- Título display: "Mi panel de paciente".
- Grid: `AppointmentForm` + listado.
- `StatusFilter` sobre la lista.
- `AppointmentCard` con `show-cancel`; manejar `@cancel` →
  `PATCH /appointments/:id/cancel` y recargar.
- Estados: loading, error, empty, empty filtrado.

### 4. DashboardDoctor (`views/DashboardDoctor.vue`)

**Al montar:**
- Cargar en paralelo:
  - `GET /appointments/pending`
  - `GET /appointments/mine`

**Estadísticas:**
- Contadores: pendientes, confirmadas, rechazadas, canceladas.
- Cards de resumen con tipografía display en el número.

**Layout:**
- Título: "Panel del médico".
- Sección pendientes con `AppointmentCard` (`show-actions`).
- Historial con `StatusFilter` (sin opción `pending`) + cards.

**Acciones:**
- Confirmar / rechazar → `PATCH .../confirm|reject` y recargar.

### 5. GuiaIAView

- Tabs con radio suave (no píldoras full).
- Tipografía y bordes alineados a tokens Oliva y miel.

### Archivos a crear / actualizar

```
frontend/src/views/
├── HomeView.vue
├── LoginView.vue
├── RegisterView.vue
├── DashboardPatient.vue
├── DashboardDoctor.vue
└── GuiaIAView.vue
```
