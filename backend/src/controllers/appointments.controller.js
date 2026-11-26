const appointmentModel = require('../models/appointment.model')
const userModel = require('../models/user.model')
const { isValidDate, isFutureDate, isValidTime } = require('../utils/validation')

const STATUS_RESPONSE = {
  confirmed: 'Cita confirmada',
  rejected: 'Cita rechazada',
  cancelled: 'Cita cancelada',
}

function createAppointment(req, res, next) {
  const { doctorId, date, time, reason } = req.body || {}

  try {
    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: 'doctorId, date y time son obligatorios' })
    }

    if (!isValidDate(date)) {
      return res.status(400).json({ error: 'La fecha debe tener formato YYYY-MM-DD' })
    }
    if (!isFutureDate(date)) {
      return res.status(400).json({ error: 'La fecha no puede ser anterior a hoy' })
    }
    if (!isValidTime(time)) {
      return res.status(400).json({ error: 'La hora debe tener formato HH:MM' })
    }

    const doctor = userModel.findById(doctorId)
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ error: 'El doctor no existe o no es un médico válido' })
    }

    const conflict = appointmentModel.findDoctorSlotConflict(doctorId, date, time)
    if (conflict) {
      return res.status(409).json({
        error: 'El médico ya tiene una cita pendiente o confirmada en esa fecha y hora',
      })
    }

    const appointment = appointmentModel.createAppointment({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      reason,
    })

    return res.status(201).json({ appointment })
  } catch (err) {
    next(err)
  }
}

function listMyAppointments(req, res) {
  const appointments = appointmentModel.listForUser(req.user.id)
  return res.json({ appointments })
}

function listPending(req, res) {
  const appointments = appointmentModel.listPending().filter(
    (a) => a.doctor_id === req.user.id
  )
  return res.json({ appointments })
}

function updateStatus(status) {
  return (req, res, next) => {
    try {
      const appointment = appointmentModel.setStatus(
        req.params.id,
        status,
        req.user.id
      )

      if (!appointment) {
        return res.status(404).json({ error: 'Cita no encontrada o sin permisos' })
      }

      return res.json({ appointment, message: STATUS_RESPONSE[status] })
    } catch (err) {
      next(err)
    }
  }
}

function cancelAppointment(req, res, next) {
  try {
    const result = appointmentModel.cancelByPatient(req.params.id, req.user.id)

    if (result.error === 'not_found') {
      return res.status(404).json({ error: 'Cita no encontrada o sin permisos' })
    }
    if (result.error === 'invalid_status') {
      return res.status(400).json({
        error: 'Solo se pueden cancelar citas pendientes o confirmadas',
        appointment: result.appointment,
      })
    }

    return res.json({
      appointment: result.appointment,
      message: STATUS_RESPONSE.cancelled,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createAppointment,
  listMyAppointments,
  listPending,
  confirm: updateStatus('confirmed'),
  reject: updateStatus('rejected'),
  cancel: cancelAppointment,
}