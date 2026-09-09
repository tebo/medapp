# Prompt: Backend — App principal y configuración

## Contexto

Estamos construyendo **MedApp**, una aplicación demo de citas médicas con roles
`patient` y `doctor`. El backend usa **Node.js + Express + better-sqlite3**.

## Tarea

Crear el punto de entrada del backend en `backend/src/app.js` con las siguientes
características:

### 1. Archivo de configuración (`config.js`)

- Cargar variables de entorno con `dotenv`.
- Exportar un objeto `config` con las siguientes claves y valores por defecto:
  - `PORT`: `3001`
  - `JWT_SECRET`: `'secreto_de_desarrollo'`
  - `JWT_EXPIRES_IN`: `'7d'`
  - `DB_FILE`: `'./data/medapp.db'` (resolver相对于 backend/)
  - `FRONTEND_URL`: `'http://localhost:5173'`

### 2. App principal (`app.js`)

- Crear la app Express.
- Middleware:
  - `cors({ origin: config.frontendUrl, credentials: true })`
  - `express.json()`
  - `morgan('dev')`
- Ruta de health: `GET /api/health` que retorne `{ status: 'ok', timestamp: new Date().toISOString() }`.
- Montar routers:
  - `/api/auth` — rutas de autenticación
  - `/api/doctors` — listado de médicos
  - `/api/appointments` — gestión de citas
- Los routers se importan desde `./routes/auth.routes.js`, `./routes/doctors.routes.js`, `./routes/appointments.routes.js`.
- Agregar middleware `notFound` al final (retorna 404 JSON).
- Agregar middleware `errorHandler` al final (manejo centralizado de errores).
- Solo ejecutar `app.listen(config.port)` cuando el archivo se ejecuta directamente (`require.main === module`), para permitir tests con Supertest.
- Exportar `app`.

### 3. Requisitos

- Usar `require` (CommonJS, `"type": "commonjs"` en package.json).
- No usar frameworks adicionales a los ya instalados (express, cors, morgan, dotenv).
- El middleware `notFound` y `errorHandler` se definen en `middleware/error.js`.
- Separar configuración, app, y middleware en archivos distintos.

### Archivos a crear

```
backend/src/
├── config.js
├── app.js
└── middleware/
    └── error.js
```

### Ejemplo de respuesta esperada

```js
// GET /api/health
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}

// POST a ruta inexistente
{
  "error": "Ruta no encontrada: POST /api/inexistente"
}
```
