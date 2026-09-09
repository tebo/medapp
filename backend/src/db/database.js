const Database = require('better-sqlite3')
const fs = require('node:fs')
const path = require('node:path')
const config = require('../config')

function createDatabase(dbFile = config.dbFile) {
  if (dbFile !== ':memory:') {
    fs.mkdirSync(path.dirname(dbFile), { recursive: true })
  }

  const db = new Database(dbFile)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  return db
}

module.exports = { createDatabase }