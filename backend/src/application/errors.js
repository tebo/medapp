/**
 * Error de aplicación con status HTTP.
 * Los use cases lanzan AppError; el controller lo traduce a JSON.
 */
class AppError extends Error {
  constructor(message, { status = 400, code = 'bad_request', details } = {}) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.details = details
  }
}

function isAppError(err) {
  return err instanceof AppError || err?.name === 'AppError'
}

module.exports = { AppError, isAppError }
