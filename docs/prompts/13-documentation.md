# Prompt: Documentación — API, Setup y Guía de IA

## Contexto

MedApp necesita documentación clara para desarrolladores que quieran entender
el proyecto, instalarlo, y usar la guía de IA integrada.

## Tarea

### 1. Documentación de API (`docs/api.md`)

Documentar cada endpoint con:

- Método y ruta.
- Autenticación requerida.
- Body de request (con ejemplos JSON).
- Response esperada (status code + body de ejemplo).
- Errores posibles.

**Endpoints a documentar:**

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/health` | Público | Health check |
| POST | `/api/auth/register` | Público | Registro (patient/doctor) |
| POST | `/api/auth/login` | Público | Login |
| GET | `/api/auth/me` | Autenticado | Datos del usuario actual |
| GET | `/api/doctors` | Autenticado | Listar médicos |
| POST | `/api/appointments` | patient | Crear cita |
| GET | `/api/appointments/mine` | Autenticado | Mis citas |
| GET | `/api/appointments/pending` | doctor | Citas pendientes |
| PATCH | `/api/appointments/:id/confirm` | doctor | Confirmar cita |
| PATCH | `/api/appointments/:id/reject` | doctor | Rechazar cita |

Incluir tabla de estados de cita con sus transiciones.

### 2. Documentación de Setup (`docs/setup.md`)

Estructura:

1. **Prerrequisitos**: Node.js 18+, npm.
2. **Instalación local**:
   - Clonar repo.
   - `cd backend && npm install && npm run dev`.
   - `cd frontend && npm install && npm run dev`.
3. **Variables de entorno**: tabla con cada variable, descripción y valor por defecto.
4. **Docker**: `docker compose up --build`.
5. **Tests**: `cd backend && npm test`, `cd frontend && npm test`.
6. **Rutas de la app**: tabla con rutas de frontend y qué muestran.
7. **Guía paso a paso de prueba**: 5 pasos para probar el flujo completo (login, crear cita, confirmar).

### 3. CSS Styles (`frontend/src/assets/main.css`)

Crear archivo de estilos globales con variables CSS:

```css
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --success: #16a34a;
  --danger: #dc2626;
  --warning: #f59e0b;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;
  --radius: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

Clases reutilizables:
- `.container` — max-width centered.
- `.card` — fondo blanco, border-radius, shadow, padding.
- `.btn`, `.btn-primary`, `.btn-outline`, `.btn-success`, `.btn-danger`.
- `.form-group`, `.form-control`.
- `.badge`, `.badge-pending`, `.badge-confirmed`, `.badge-rejected`, `.badge-cancelled`.
- `.alert-error`.
- `.grid-2` — grid de 2 columnas responsive.

### Archivos a crear

```
docs/
├── api.md
├── setup.md
frontend/src/assets/
└── main.css
```
