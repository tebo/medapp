# Prompt: Documentación — API, Setup, CSS y línea gráfica

## Contexto

MedApp necesita documentación clara para desarrolladores que quieran entender
el proyecto, instalarlo, y usar la guía de IA integrada. El frontend sigue la
línea gráfica **«Oliva y miel»** (ver `docs/linea-grafica.md`).

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
| POST | `/api/appointments` | patient | Crear cita (`409` si hay solape) |
| GET | `/api/appointments/mine` | Autenticado | Mis citas |
| GET | `/api/appointments/pending` | doctor | Citas pendientes |
| PATCH | `/api/appointments/:id/confirm` | doctor | Confirmar cita |
| PATCH | `/api/appointments/:id/reject` | doctor | Rechazar cita |
| PATCH | `/api/appointments/:id/cancel` | patient | Cancelar cita propia |

Incluir tabla de estados de cita con sus transiciones
(`pending` → `confirmed`/`rejected`/`cancelled`; `confirmed` → `cancelled`).

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
7. **Guía paso a paso de prueba**: 5 pasos para probar el flujo completo (login, crear cita, confirmar, cancelar).
8. Enlace a la línea gráfica: `docs/linea-grafica.md`.

### 3. CSS Styles (`frontend/src/assets/main.css`)

Crear estilos globales alineados a **«Oliva y miel»** (no uses azul `#2563eb`
ni grises fríos de Tailwind por defecto):

```css
:root {
  --ink: #2a241c;
  --ink-soft: #5a4e42;
  --muted: #7a6e62;
  --primary: #3f6b52;
  --primary-dark: #2f5240;
  --primary-soft: #e4ede6;
  --accent-line: #c4923a;
  --accent-soft: #f5e6c8;
  --surface: rgba(255, 252, 247, 0.9);
  --border: #d9cfc2;
  --success: #2f6b45;
  --danger: #b42318;
  --warning: #9a6700;
  --radius: 0.65rem;
  --radius-sm: 0.4rem;
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Figtree", "Segoe UI", sans-serif;
}
```

También:
- Fuentes en `frontend/index.html` (Google Fonts: Fraunces + Figtree).
- Atmósfera: fondo arena/melocotón + trama diagonal (no `background: #f3f4f6` plano).
- Clases reutilizables: `.container`, `.card`, `.btn`, `.btn-outline`,
  `.btn-success`, `.btn-danger`, `.form-group`, `.form-control`, `.badge-*`,
  `.alert-error`, `.alert-success`, `.grid-2`, `.brand-mark`.
- Documentar la identidad en `docs/linea-grafica.md`.

### Archivos a crear / actualizar

```
docs/
├── api.md
├── setup.md
├── linea-grafica.md
frontend/index.html
frontend/src/assets/
└── main.css
```
