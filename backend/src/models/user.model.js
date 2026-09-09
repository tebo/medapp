const { db } = require('../db')

const findByEmail = db.prepare('SELECT * FROM users WHERE email = ?')
const findById = db.prepare('SELECT * FROM users WHERE id = ?')
const insertUser = db.prepare(
  'INSERT INTO users (name, email, password_hash, role, specialty) VALUES (?, ?, ?, ?, ?)'
)
const listDoctors = db.prepare(
  "SELECT id, name, specialty FROM users WHERE role = 'doctor' ORDER BY name"
)

module.exports = {
  findByEmail: (email) => findByEmail.get(email),
  findById: (id) => findById.get(id),
  createUser: ({ name, email, passwordHash, role, specialty = null }) => {
    const result = insertUser.run(name, email, passwordHash, role, specialty)
    return findById.get(result.lastInsertRowid)
  },
  listDoctors: () => listDoctors.all(),
}