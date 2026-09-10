# 🩺 MedApp — Citas Médicas + Guía de Asistencia de IA

Aplicación **demo de una sola pieza** para aprender:

1. **Cómo usar asistencia de IA en el desarrollo** (prompts, mejores prácticas,
   workflow) — disponible en la app (`/guia-ia`) y en `docs/guia-ia/`.
2. **El flujo de una cita médica real**: el paciente solicita, el médico confirma.

Stack: **Vue 3 + Vite + Pinia** (frontend) · **Node.js + Express + SQLite** (backend) ·
**Docker + GitHub Actions** (devops) · **Vitest / Supertest** (testing).

---

## Características

- **Login y registro** con roles `patient` y `doctor` (JWT + bcrypt).
- **Paciente**: elige médico, fecha y motivo; ve el estado de sus citas
  (`pending` → `confirmed`/`rejected`).
- **Médico**: recibe solicitudes pendientes y confirma o rechaza.
- **Guía de IA completa**: 7 capítulos navegables dentro de la propia aplicación.
- **SQLite**: base de datos embebida, sin instalación extra; se crea al arrancar
  con médicos de demostración.
- **CI/CD**: tests y build en GitHub Actions; imágenes Docker publicadas en GHCR.

## Estructura del proyecto

```
demoapp1/
├── .github/workflows/        # CI y build de imágenes Docker
├── docs/
│   ├── guia-ia/              # Guía completa de uso de IA (7 capítulos)
│   ├── api.md                # Documentación de la API
│   └── setup.md              # Guía de instalación y prueba
├── docker/                   # Dockerfiles y configuración nginx
├── backend/                  # API: Express + better-sqlite3 + JWT
│   ├── src/
│   │   ├── db/               # conexión, migraciones y semilla
│   │   ├── models/           # SQL de acceso a datos
│   │   ├── services/         # lógica de negocio
│   │   ├── controllers/      # handlers HTTP
│   │   ├── middleware/       # autenticación/autorización y errores
│   │   ├── routes/           # endpoints por dominio (auth, doctors, citas)
│   │   └── utils/            # validaciones (fecha/hora)
│   └── tests/                # Vitest + Supertest
├── frontend/                 # Vue 3 + Vite + Pinia
│   ├── src/
│   │   ├── components/       # NavBar, AppointmentForm, AppointmentCard
│   │   ├── views/            # Home, Login, Register, dashboards, Guía IA
│   │   ├── stores/           # store de autenticación (Pinia)
│   │   ├── router/           # rutas protegidas por rol
│   │   └── services/         # cliente Axios con interceptor JWT
│   └── tests/
├── docker-compose.yml        # backend + frontend con un comando
└── README.md
```

## Inicio rápido

### Opción A — Local (recomendado para aprender)

```bash
# Terminal 1 — backend
cd backend && npm install && npm run dev

# Terminal 2 — frontend
cd frontend && npm install && npm run dev
```

Abre http://localhost:5173

### Opción B — Docker

```bash
docker compose up --build
```

Abre http://localhost:5173

### Credenciales pre-cargadas

Médicos de demo (contraseña `doctor123`): `ana.torres@medapp.com`,
`luis.fernandez@medapp.com`, `maria.lopez@medapp.com`, `carlos.mendoza@medapp.com`.

## Guía de uso de Asistencia de IA (índice)

| Capítulo | Archivo |
|----------|---------|
| 1. Introducción | [docs/guia-ia/01-introduccion.md](docs/guia-ia/01-introduccion.md) |
| 2. Prompts efectivos | [docs/guia-ia/02-prompts-efectivos.md](docs/guia-ia/02-prompts-efectivos.md) |
| 3. Mejores prácticas | [docs/guia-ia/03-mejores-practicas.md](docs/guia-ia/03-mejores-practicas.md) |
| 4. Ejemplos aplicados | [docs/guia-ia/04-ejemplos-practicos.md](docs/guia-ia/04-ejemplos-practicos.md) |
| 5. Errores comunes | [docs/guia-ia/05-errores-comunes.md](docs/guia-ia/05-errores-comunes.md) |
| 6. Workflow de desarrollo | [docs/guia-ia/06-workflow-desarrollo.md](docs/guia-ia/06-workflow-desarrollo.md) |
| 7. Glosario | [docs/guia-ia/07-glosario.md](docs/guia-ia/07-glosario.md) |

La misma guía está accesible **dentro de la aplicación** en la ruta `/guia-ia`.

## Documentación

- [Setup completo](docs/setup.md) — instalación, variables de entorno, Docker.
- [API](docs/api.md) — endpoints, ejemplos y estados de cita.

## Tests

```bash
cd backend  && npm test   # 67 tests (auth + citas + médicos + unitarias)
cd frontend && npm test   # 35 tests (store + router + componentes + api)
```

## CI/CD

- `.github/workflows/ci.yml`: tests del backend y frontend + build del frontend
  en cada push.
- `.github/workflows/docker.yml`: construye y publica imágenes en
  `ghcr.io/<usuario>/<repo>-backend|frontend` en main y tags `v*`.

## Notas de seguridad (demo)

Este es un proyecto educativo: el token JWT se guarda en `localStorage` (solo
para demo), las contraseñas se almacenan con bcrypt, y los secretos van en `.env`
(no versionado). Para un entorno real con datos de pacientes, añade cifrado en
tránsito, refresh tokens, control de acceso y cumplimiento de normativas
locales de salud.