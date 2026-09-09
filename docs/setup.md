# Setup del Proyecto MedApp

Requisitos: **Node.js ≥ 20** (recomendado 22) y **npm**. Para Docker, consulta la
sección final.

## 1. Clonar / entrar en el proyecto

```bash
cd demoapp1
```

## 2. Backend

```bash
cd backend
npm install          # instala dependencias
cp .env.example .env # configuración local
npm run dev          # arranca en http://localhost:3001
```

El backend crea automáticamente la base de datos en `backend/data/medapp.db`
(primera ejecución), ejecuta las migraciones y siembra los médicos demo:

- `ana.torres@medapp.com` · Medicina General
- `luis.fernandez@medapp.com` · Cardiología
- `maria.lopez@medapp.com` · Pediatría
- `carlos.mendoza@medapp.com` · Traumatología

Contraseña de todos los médicos demo: **`doctor123`**.

### Variables de entorno del backend (`.env`)

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `PORT` | `3001` | Puerto del servidor |
| `JWT_SECRET` | `secreto_de_desarrollo` | Secreto para firmar tokens (¡cámbialo!) |
| `JWT_EXPIRES_IN` | `7d` | Duración del token |
| `DB_FILE` | `./data/medapp.db` | Ruta del archivo SQLite. Usa `:memory:` para tests |
| `FRONTEND_URL` | `http://localhost:5173` | Origen permitido por CORS |

### Tests del backend

```bash
cd backend
npm test
```

Los tests usan una base de datos en memoria (`:memory:`), configurada en
`tests/setup.js`.

## 3. Frontend

```bash
cd frontend
npm install
npm run dev          # arranca en http://localhost:5173
```

En desarrollo, Vite proxía `/api` hacia `http://localhost:3001`, así que no hace
falta configurar la URL de la API.

### Variables de entorno del frontend

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `VITE_API_URL` | `/api` | Base URL de la API |

### Tests del frontend

```bash
cd frontend
npm test
```

## 4. Rutas de la aplicación

| URL | Contenido |
|-----|-----------|
| `/` | Portada con la explicación y credenciales demo |
| `/login` · `/register` | Autenticación |
| `/dashboard` | Panel del paciente |
| `/dashboard/doctor` | Panel del médico |
| `/guia-ia` | Guía interactiva de uso de IA |

## 5. Con Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3001/api/health

Los datos de SQLite se guardan en un volumen Docker (`meddata`) y persisten entre
reinicios. Para resetear: `docker compose down -v`.

## 6. Manos a la obra (flujo de prueba)

1. Regístrate como **paciente**.
2. Solicita una cita con algún médico.
3. Sal de sesión y entra como médico demo (`ana.torres@medapp.com` / `doctor123`).
4. Confirma la cita pendiente.
5. Vuelve a entrar como paciente y comprueba que aparece **Confirmada**.