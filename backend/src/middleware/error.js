function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ error: 'El email ya está registrado' })
  }

  if (err.type === 'validation') {
    return res.status(400).json({ error: err.message })
  }

  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
}

module.exports = { notFound, errorHandler }