const appointmentModel = require('../../models/appointment.model')
const userModel = require('../../models/user.model')
const { isValidDate, isFutureDate, isValidTime } = require('../../utils/validation')
const { AppError } = require('../errors')

/**
 * Caso de uso: paciente solicita una cita.
 * Contiene validaciones y la regla de anti-solapamiento (antes vivía en el controller).
 */
function createAppointment({ patientId, doctorId, date, time, reason }) {
  if (!doctorId || !date || !time) {
    throw new AppError('doctorId, date y time son obligatorios', { status: 400, code: 'validation' })
  }
  if (!isValidDate(date)) {
    throw new AppError('La fecha debe tener formato YYYY-MM-DD', { status: 400, code: 'validation' })
  }
  if (!isFutureDate(date)) {
    throw new AppError('La fecha no puede ser anterior a hoy', { status: 400, code: 'validation' })
  }
  if (!isValidTime(time)) {
    throw new AppError('La hora debe tener formato HH:MM', { status: 400, code: 'validation' })
  }

  const doctor = userModel.findById(doctorId)
  if (!doctor || doctor.role !== 'doctor') {
    throw new AppError('El doctor no existe o no es un médico válido', {
      status: 400,
      code: 'invalid_doctor',
    })
  }

  const conflict = appointmentModel.findDoctorSlotConflict(doctorId, date, time)
  if (conflict) {
    throw new AppError(
      'El médico ya tiene una cita pendiente o confirmada en esa fecha y hora',
      { status: 409, code: 'slot_conflict' }
    )
  }

  const appointment = appointmentModel.createAppointment({
    patientId,
    doctorId,
    date,
    time,
    reason,
  })

  return { appointment }
}

module.exports = { createAppointment }
