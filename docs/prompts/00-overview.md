# Visión general del proyecto MedApp

## Descripción

**MedApp** es una aplicación demo de gestión de citas médicas diseñada como
proyecto educativo para aprender desarrollo asistido por IA.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue 3, Vite, Pinia, Vue Router, Axios |
| Backend | Node.js, Express, better-sqlite3, JWT, bcryptjs |
| Testing | Vitest, Supertest |
| DevOps | Docker, Docker Compose, GitHub Actions, GHCR |
| Database | SQLite (embebida) |

## Funcionalidades

1. **Autenticación**: Login/registro con roles `patient` y `doctor` (JWT).
2. **Paciente**: Seleccionar médico, fecha, motivo; ver estado de citas.
3. **Médico**: Ver solicitudes pendientes; confirmar o rechazar.
4. **Guía de IA**: 7 capítulos navegables dentro de la app.
5. **CI/CD**: Tests y build en GitHub Actions; imágenes Docker en GHCR.

## Flujo principal

```
Paciente registra → Login → Selecciona médico + fecha + motivo
    → Cita creada (pending)
    → Médico ve pendientes → Confirma o rechaza
    → Paciente ve el resultado
```

## Estructura del repositorio

```
demoapp1/
├── .github/workflows/     # CI y Docker build
├── docs/                  # API docs, setup, guía de IA (markdown)
├── docker/                # Dockerfiles y nginx.conf
├── backend/               # Express API
│   ├── src/
│   │   ├── config.js
│   │   ├── app.js
│   │   ├── db/            # Conexión, migraciones, seed
│   │   ├── models/        # SQL prepared statements
│   │   ├── services/      # Lógica de negocio
│   │   ├── controllers/   # Handlers HTTP
│   │   ├── middleware/     # Auth + error handling
│   │   ├── routes/        # Definición de endpoints
│   │   └── utils/         # Validaciones (fecha/hora)
│   └── tests/             # Vitest + Supertest
├── frontend/              # Vue 3 SPA
│   ├── src/
│   │   ├── components/    # NavBar, AppointmentCard, AppointmentForm
│   │   ├── views/         # Home, Login, Register, Dashboards, Guía IA
│   │   ├── stores/        # Auth store (Pinia)
│   │   ├── composables/   # useAuth
│   │   ├── router/        # Rutas con guards por rol
│   │   ├── services/      # Cliente Axios
│   │   └── assets/        # CSS global
│   └── tests/             # Vitest + jsdom
├── docker-compose.yml
└── README.md
```

## Credenciales de demo

| Médico | Email | Especialidad | Contraseña |
|--------|-------|-------------|-----------|
| Dra. Ana Torres | ana.torres@medapp.com | Medicina General | doctor123 |
| Dr. Luis Fernández | luis.fernandez@medapp.com | Cardiología | doctor123 |
| Dra. María López | maria.lopez@medapp.com | Pediatría | doctor123 |
| Dr. Carlos Mendoza | carlos.mendoza@medapp.com | Traumatología | doctor123 |

## Índice de prompts

| # | Prompt | Archivo |
|---|--------|---------|
| 00 | Visión general | `00-overview.md` |
| 01 | Backend — App principal | `01-backend-app.md` |
| 02 | Database y migrations | `02-database.md` |
| 03 | Models y services | `03-models-services.md` |
| 04 | Auth (JWT + middleware) | `04-auth.md` |
| 05 | CRUD de citas | `05-appointments.md` |
| 06 | Frontend — Setup y router | `06-frontend-setup.md` |
| 07 | Auth store y Login/Register | `07-frontend-auth.md` |
| 08 | Componentes reutilizables | `08-frontend-components.md` |
| 09 | Vistas principales | `09-frontend-views.md` |
| 10 | Docker | `10-docker.md` |
| 11 | Testing | `11-testing.md` |
| 12 | CI/CD | `12-cicd.md` |
| 13 | Documentación y CSS | `13-documentation.md` |
| 14 | Guía de IA | `14-guia-ia.md` |
