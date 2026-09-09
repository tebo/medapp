const bcrypt = require('bcryptjs')
const userModel = require('../models/user.model')

function createUser({ name, email, password, role, specialty }) {
  const passwordHash = bcrypt.hashSync(password, 10)
  return userModel.createUser({ name, email, passwordHash, role, specialty: specialty || null })
}

function findByEmail(email) {
  return userModel.findByEmail(email)
}

function findById(id) {
  return userModel.findById(id)
}

function listDoctors() {
  return userModel.listDoctors()
}

module.exports = { createUser, findByEmail, findById, listDoctors }