const path = require('node:path')

require('dotenv').config()

const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'secreto_de_desarrollo',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dbFile: resolveDbFile(process.env.DB_FILE || './data/medapp.db'),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
}

function resolveDbFile(file) {
  if (file === ':memory:') return ':memory:'
  return path.resolve(__dirname, '..', file)
}

module.exports = config