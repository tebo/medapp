const bcrypt = require('bcryptjs')

const DOCTORS = [
  { name: 'Dra. Ana Torres', email: 'ana.torres@medapp.com', specialty: 'Medicina General' },
  { name: 'Dr. Luis Fernández', email: 'luis.fernandez@medapp.com', specialty: 'Cardiología' },
  { name: 'Dra. María López', email: 'maria.lopez@medapp.com', specialty: 'Pediatría' },
  { name: 'Dr. Carlos Mendoza', email: 'carlos.mendoza@medapp.com', specialty: 'Traumatología' },
]

function seedDatabase(db) {
  const existing = db.prepare('SELECT COUNT(*) AS count FROM users WHERE role = ?').get('doctor')
  if (existing.count > 0) return

  const insert = db.prepare(
    'INSERT INTO users (name, email, password_hash, role, specialty) VALUES (?, ?, ?, ?, ?)'
  )

  const passwordHash = bcrypt.hashSync('doctor123', 10)

  const insertAll = db.transaction(() => {
    for (const doctor of DOCTORS) {
      insert.run(doctor.name, doctor.email, passwordHash, 'doctor', doctor.specialty)
    }
  })

  insertAll()
}

module.exports = { seedDatabase, DOCTORS }