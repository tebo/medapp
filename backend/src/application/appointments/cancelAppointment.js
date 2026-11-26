const appointmentModel = require('../../models/appointment.model')
const { AppError } = require('../errors')

/**
 * Caso de uso: el paciente cancela su propia cita pending/confirmed.
 * Un archivo = un caso de uso (pack Capas limpias / F3).
 */
function cancelAppointment({ appointmentId, patientId }) {
  const result = appointmentModel.cancelByPatient(appointmentId, patientId)

  if (result.error === 'not_found') {
    throw new AppError('Cita no encontrada o sin permisos', {
      status: 404,
      code: 'not_found',
    })
  }

  if (result.error === 'invalid_status') {
    throw new AppError('Solo se pueden cancelar citas pendientes o confirmadas', {
      status: 400,
      code: 'invalid_status',
      details: { appointment: result.appointment },
    })
  }

  return {
    appointment: result.appointment,
    message: 'Cita cancelada',
  }
}

module.exports = { cancelAppointment }
