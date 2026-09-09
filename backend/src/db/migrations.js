function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      email         TEXT    NOT NULL UNIQUE,
      password_hash TEXT    NOT NULL,
      role          TEXT    NOT NULL CHECK (role IN ('patient', 'doctor')),
      specialty     TEXT,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id  INTEGER NOT NULL,
      date       TEXT    NOT NULL,
      time       TEXT    NOT NULL,
      reason     TEXT,
      status     TEXT    NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled')),
      created_at TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id)  REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_appointments_status  ON appointments(status);
    CREATE INDEX IF NOT EXISTS idx_appointments_doctor  ON appointments(doctor_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
  `)
}

module.exports = { runMigrations }