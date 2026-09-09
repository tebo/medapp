const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config')
const userService = require('../services/user.service')

const ROLES = ['patient', 'doctor']

function register(req, res, next) {
  const { name, email, password, role, specialty } = req.body || {}

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email y password son obligatorios' })
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ error: 'El rol debe ser patient o doctor' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    }
    if (role === 'doctor' && !specialty) {
      return res.status(400).json({ error: 'Un doctor debe indicar su especialidad' })
    }

    const user = userService.createUser({ name, email, password, role, specialty })
    const token = signToken(user)

    return res.status(201).json({ token, user: publicUser(user) })
  } catch (err) {
    next(err)
  }
}

function login(req, res, next) {
  const { email, password } = req.body || {}

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son obligatorios' })
    }

    const user = userService.findByEmail(email)
    const valid = user && bcrypt.compareSync(password, user.password_hash)

    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = signToken(user)
    return res.json({ token, user: publicUser(user) })
  } catch (err) {
    next(err)
  }
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  )
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    specialty: user.specialty,
  }
}

function me(req, res) {
  const user = userService.findById(req.user.id)
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
  return res.json({ user: publicUser(user) })
}

module.exports = { register, login, me }