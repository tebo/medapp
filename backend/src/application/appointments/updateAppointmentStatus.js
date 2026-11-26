const appointmentModel = require('../../models/appointment.model')
const { AppError } = require('../errors')

const STATUS_MESSAGE = {
  confirmed: 'Cita confirmada',
  rejected: 'Cita rechazada',
}

/**
 * Caso de uso: el médico confirma o rechaza una cita.
 */
function updateAppointmentStatus({ appointmentId, doctorId, status }) {
  if (!STATUS_MESSAGE[status]) {
    throw new AppError('Estado no permitido', { status: 400, code: 'validation' })
  }

  const appointment = appointmentModel.setStatus(appointmentId, status, doctorId)
  if (!appointment) {
    throw new AppError('Cita no encontrada o sin permisos', {
      status: 404,
      code: 'not_found',
    })
  }

  return {
    appointment,
    message: STATUS_MESSAGE[status],
  }
}

module.exports = { updateAppointmentStatus }
