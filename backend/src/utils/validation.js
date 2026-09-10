function isValidDate(date) {
  const re = /^\d{4}-\d{2}-\d{2}$/
  if (typeof date !== 'string' || !re.test(date)) return false

  const d = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return false

  // Evita desbordamientos del motor (p. ej. 2026-04-31 no existe aunque
  // Date lo normalice internamente): la fecha debe cuadrar componente a componente.
  return (
    d.getUTCFullYear() === Number(date.slice(0, 4)) &&
    d.getUTCMonth() + 1 === Number(date.slice(5, 7)) &&
    d.getUTCDate() === Number(date.slice(8, 10))
  )
}

function isFutureDate(date) {
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return date >= today
}

function isValidTime(time) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
}

module.exports = { isValidDate, isFutureDate, isValidTime }