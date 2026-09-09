const config = require('../config')
const { createDatabase } = require('./database')
const { runMigrations } = require('./migrations')
const { seedDatabase } = require('./seed')

const db = createDatabase(config.dbFile)
runMigrations(db)
seedDatabase(db)

module.exports = { db }