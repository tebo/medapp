# Prompt: Backend — Base de datos, migraciones y semilla

## Contexto

MedApp usa **better-sqlite3** como base de datos embebida (SQLite). La DB se
crea automáticamente al arrancar el servidor. Necesitamos un esquema con 2
tablas: `users` y `appointments`.

## Tarea

Crear la capa de persistencia del backend.

### 1. Conexión a la DB (`db/database.js`)

- Función `createDatabase(dbFile)` que:
  - Asegure que el directorio del archivo exista (crear con `fs.mkdirSync(recursive)`).
  - Cree la instancia de `better-sqlite3`.
  - Ejecute `PRAGMA journal_mode = WAL` y `PRAGMA foreign_keys = ON`.
  - Retorne la instancia de la DB.

### 2. Migraciones (`db/migrations.js`)

- Función `runMigrations(db)` que ejecute `CREATE TABLE IF NOT EXISTS` para:

**Tabla `users`:**
```sql
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL CHECK(role IN ('patient', 'doctor')),
  specialty     TEXT,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

**Tabla `appointments`:**
```sql
CREATE TABLE IF NOT EXISTS appointments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date        TEXT    NOT NULL,
  time        TEXT    NOT NULL,
  reason      TEXT,
  status      TEXT    NOT NULL DEFAULT 'pending'
              CHECK(status IN ('pending', 'confirmed', 'rejected', 'cancelled')),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
```

**Índices:**
```sql
CREATE INDEX IF NOT EXISTS idx_appointments_status  ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor   ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient  ON appointments(patient_id);
```

### 3. Semilla (`db/seed.js`)

- Función `seedDatabase(db)` que:
  - Verifique si ya existen usuarios (`SELECT COUNT(*) FROM users`).
  - Si es 0, inserte 4 médicos de demostración con `password_hash` bcrypt de `'doctor123'` (cost 10):

| Nombre | Email | Especialidad |
|--------|-------|-------------|
| Dra. Ana Torres | ana.torres@medapp.com | Medicina General |
| Dr. Luis Fernández | luis.fernandez@medapp.com | Cardiología |
| Dra. María López | maria.lopez@medapp.com | Pediatría |
| Dr. Carlos Mendoza | carlos.mendoza@medapp.com | Traumatología |

- Exportar `{ seedDatabase, DOCTORS }` donde `DOCTORS` es el array de médicos.

### 4. Índice (`db/index.js`)

- Importar `createDatabase`, `runMigrations`, `seedDatabase`.
- Crear la DB usando `config.DB_FILE`.
- Ejecutar migraciones y semilla.
- Exportar `{ db }`.

### Archivos a crear

```
backend/src/db/
├── database.js
├── migrations.js
├── seed.js
└── index.js
```

### Notas

- El archivo de la DB se resuelve relativo al directorio `backend/` (no al CWD).
- `':memory:'` se usa para tests; no se crea directorio en ese caso.
- El seed solo inserta si la tabla está vacía (idempotente).
