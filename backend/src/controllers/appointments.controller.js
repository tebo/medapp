const appointments = require('../application/appointments')
const { isAppError } = require('../application/errors')

/**
 * Controllers delgados: HTTP in/out. La lógica vive en application/*.
 */
function sendAppError(res, err) {
  const body = { error: err.message }
  if (err.details?.appointment) {
    body.appointment = err.details.appointment
  }
  return res.status(err.status).json(body)
}

function createAppointment(req, res, next) {
  try {
    const { doctorId, date, time, reason } = req.body || {}
    const result = appointments.createAppointment({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      reason,
    })
    return res.status(201).json(result)
  } catch (err) {
    if (isAppError(err)) return sendAppError(res, err)
    return next(err)
  }
}

function listMyAppointments(req, res, next) {
  try {
    return res.json(appointments.listMyAppointments({ userId: req.user.id }))
  } catch (err) {
    if (isAppError(err)) return sendAppError(res, err)
    return next(err)
  }
}

function listPending(req, res, next) {
  try {
    return res.json(appointments.listPendingAppointments({ doctorId: req.user.id }))
  } catch (err) {
    if (isAppError(err)) return sendAppError(res, err)
    return next(err)
  }
}

function confirm(req, res, next) {
  try {
    const result = appointments.updateAppointmentStatus({
      appointmentId: req.params.id,
      doctorId: req.user.id,
      status: 'confirmed',
    })
    return res.json(result)
  } catch (err) {
    if (isAppError(err)) return sendAppError(res, err)
    return next(err)
  }
}

function reject(req, res, next) {
  try {
    const result = appointments.updateAppointmentStatus({
      appointmentId: req.params.id,
      doctorId: req.user.id,
      status: 'rejected',
    })
    return res.json(result)
  } catch (err) {
    if (isAppError(err)) return sendAppError(res, err)
    return next(err)
  }
}

function cancel(req, res, next) {
  try {
    const result = appointments.cancelAppointment({
      appointmentId: req.params.id,
      patientId: req.user.id,
    })
    return res.json(result)
  } catch (err) {
    if (isAppError(err)) return sendAppError(res, err)
    return next(err)
  }
}

module.exports = {
  createAppointment,
  listMyAppointments,
  listPending,
  confirm,
  reject,
  cancel,
}
